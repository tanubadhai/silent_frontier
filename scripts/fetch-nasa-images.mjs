#!/usr/bin/env node
/**
 * Downloads the NASA images listed in src/data/missionImages.json into
 * public/images/missions/, using the official NASA Image and Video Library API
 * (images-api.nasa.gov), the Photojournal and, where an entry says so, the
 * NASA page it names. Requires Node 18+ and internet access. No dependencies.
 *
 *   npm run images                  download everything that is missing
 *   npm run images -- --force       download again, even if the file exists
 *   npm run images -- --only=pia00452,as12-48-7133
 *   npm run images -- --dry         show what would be downloaded
 *
 * acquire methods: "nasa-library" (NASA ID), "scrape" (image on a NASA page) and
 * "url" (direct file URLs, tried in order). To add a picture by hand, save it as
 * public/images/missions/<file from the manifest>; existing files are never overwritten.
 *
 * For every download it checks the title and credit NASA gives for the ID
 * against the manifest and prints a warning when they do not match. Results are
 * written to scripts/image-report.json.
 */
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(path.join(root, "src/data/missionImages.json"), "utf8"));
const outRoot = path.join(root, "public", manifest.basePath);

const args = process.argv.slice(2);
const force = args.includes("--force");
const dry = args.includes("--dry");
const onlyArg = args.find((arg) => arg.startsWith("--only="));
const only = onlyArg ? new Set(onlyArg.slice(7).split(",").map((id) => id.trim().toLowerCase())) : null;

const HEADERS = { "User-Agent": "STARSTUFF-image-fetch/1.0 (NASA Space Apps project)" };

const exists = (file) => stat(file).then(() => true, () => false);
const norm = (text) => String(text ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "_");
const https = (url) => url.replace(/^http:\/\//i, "https://");

async function getJson(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function getBuffer(url, { jpeg = false } = {}) {
  const res = await fetch(https(url), { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  const type = res.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) throw new Error(`not an image (${type}) at ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length < 5000) throw new Error(`file too small (${buffer.length} bytes) at ${url}`);
  if (jpeg && !(buffer[0] === 0xff && buffer[1] === 0xd8)) throw new Error(`not a JPEG file at ${url}`);
  return buffer;
}

/** Looks up an ID in the NASA Image and Video Library; returns a file URL and NASA's metadata. */
async function fromLibrary(id) {
  const ids = [...new Set([id, id.toUpperCase(), id.toLowerCase()])];
  for (const candidate of ids) {
    try {
      const asset = await getJson(`https://images-api.nasa.gov/asset/${encodeURIComponent(candidate)}`);
      const hrefs = (asset?.collection?.items ?? []).map((item) => item.href).filter((href) => /\.jpe?g$/i.test(href));
      if (hrefs.length === 0) continue;
      const pick =
        hrefs.find((href) => /~large\./i.test(href)) ??
        hrefs.find((href) => /~medium\./i.test(href)) ??
        hrefs.find((href) => /~orig\./i.test(href)) ??
        hrefs[0];
      let meta = null;
      try {
        const search = await getJson(`https://images-api.nasa.gov/search?nasa_id=${encodeURIComponent(candidate)}`);
        meta = search?.collection?.items?.[0]?.data?.[0] ?? null;
      } catch {
        /* metadata is only used for checks */
      }
      return { url: pick, meta, via: "nasa-library" };
    } catch {
      /* try the next spelling of the ID */
    }
  }
  return null;
}

/** Looks for an image on a NASA page whose URL or alt text contains the match token. */
async function fromPage(page, match) {
  const res = await fetch(page, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${page}`);
  const html = await res.text();
  const token = norm(match);
  const found = [];
  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    const alt = /alt="([^"]*)"/i.exec(tag)?.[1] ?? "";
    const sources = [/\bsrc="([^"]+)"/i.exec(tag)?.[1], /data-src="([^"]+)"/i.exec(tag)?.[1], /srcset="([^"\s]+)/i.exec(tag)?.[1]];
    for (const src of sources.filter(Boolean)) {
      if (norm(src).includes(token) || norm(alt).includes(token)) found.push(new URL(src, page).href);
    }
  }
  // Prefer the original file over a resized copy such as name-1024x683.jpg.
  const full = found.map((url) => url.replace(/-\d+x\d+(?=\.\w+(\?|$))/, "").split("?")[0]);
  const best = full.find((url) => /\.(jpe?g|png)$/i.test(url));
  return best ? { url: best, meta: null, via: "page-scrape" } : null;
}

function checkMeta(entry, meta) {
  const warnings = [];
  if (!meta) return warnings;
  const haystack = `${meta.title ?? ""} ${meta.description ?? ""}`.toLowerCase();
  if (entry.expectTitle?.length && !entry.expectTitle.some((word) => haystack.includes(word.toLowerCase()))) {
    warnings.push(`TITLE CHECK: NASA calls this "${meta.title}", expected one of: ${entry.expectTitle.join(", ")}. Make sure it is the right picture.`);
  }
  warnings.push(`NASA credit data: center=${meta.center ?? "?"}; photographer=${meta.photographer ?? meta.secondary_creator ?? "?"}. Manifest credit: ${entry.credit}.`);
  return warnings;
}

const entries = Object.values(manifest.images).filter((entry) => !only || only.has(entry.id));
const report = [];

for (const entry of entries) {
  const target = path.join(outRoot, entry.file);
  const row = { id: entry.id, file: entry.file, status: "", via: "", url: "", warnings: [] };

  if (!force && (await exists(target))) {
    row.status = "already present";
    report.push(row);
    console.log(`  skip     ${entry.id} (already present)`);
    continue;
  }
  if (dry) {
    row.status = "would download";
    row.via = entry.acquire.method;
    report.push(row);
    console.log(`  dry-run  ${entry.id}  <- ${entry.acquire.method} ${entry.acquire.id ?? entry.acquire.page ?? entry.acquire.urls?.[0]}`);
    continue;
  }

  try {
    let found = null;
    if (entry.acquire.method === "nasa-library") {
      found = await fromLibrary(entry.acquire.id);
      if (!found && entry.acquire.fallback === "photojournal") {
        found = { url: `https://photojournal.jpl.nasa.gov/jpeg/${entry.acquire.id}.jpg`, meta: null, via: "photojournal" };
      }
    } else if (entry.acquire.method === "scrape") {
      found = await fromPage(entry.acquire.page, entry.acquire.match);
    } else if (entry.acquire.method === "url") {
      // Direct file URLs, tried in order. Each must be a real JPEG.
      for (const url of entry.acquire.urls ?? []) {
        try {
          found = { url, meta: null, via: "direct-url", buffer: await getBuffer(url, { jpeg: true }) };
          break;
        } catch (error) {
          row.warnings.push(String(error.message ?? error));
        }
      }
      if (!found) throw new Error(row.warnings.join(" | ") || "no URL listed");
    }
    if (!found) throw new Error("no downloadable image found");

    const buffer = found.buffer ?? (await getBuffer(found.url));
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, buffer);
    row.status = "downloaded";
    row.via = found.via;
    row.url = found.url;
    row.warnings = checkMeta(entry, found.meta);
    console.log(`  ok       ${entry.id}  (${Math.round(buffer.length / 1024)} KB via ${found.via})`);
    for (const warning of row.warnings.filter((w) => w.startsWith("TITLE"))) console.warn(`           ! ${warning}`);
  } catch (error) {
    row.status = "FAILED";
    row.warnings.push(String(error.message ?? error));
    console.error(`  FAILED   ${entry.id}: ${row.warnings[0]}`);
    console.error(`           Save it by hand as public${manifest.basePath}/${entry.file} from ${entry.acquire.manualSource ?? entry.sourcePage}`);
  }
  report.push(row);
}

await writeFile(path.join(root, "scripts", "image-report.json"), JSON.stringify(report, null, 2));
const failed = report.filter((row) => row.status === "FAILED").length;
console.log(`\n${report.length} images checked, ${failed} failed. Details: scripts/image-report.json`);
if (failed) console.log("The site still works: missing images show a labelled panel that links to the NASA source page.");
