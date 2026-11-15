#!/usr/bin/env node
/** Lists which images from src/data/missionImages.json are present in public/images/missions/. */
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(path.join(root, "src/data/missionImages.json"), "utf8"));
const exists = (file) => stat(file).then(() => true, () => false);

let missing = 0;
for (const entry of Object.values(manifest.images)) {
  const present = await exists(path.join(root, "public", manifest.basePath, entry.file));
  if (!present) {
    missing += 1;
    console.log(`MISSING  ${entry.file}\n         ${entry.title}\n         ${entry.sourcePage}`);
  }
}
const total = Object.keys(manifest.images).length;
console.log(`\n${total - missing} of ${total} images present.`);
process.exit(missing ? 1 : 0);
