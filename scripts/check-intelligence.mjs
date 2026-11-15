#!/usr/bin/env node
/**
 * Checks that src/data/intelligence.json still lines up with missions.json and
 * missionContent.json: every instrument name, every sentence reference and every
 * subject must exist. Run it after editing a mission story.
 *   npm run check:intelligence
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/data");
const read = async (name) => JSON.parse(await readFile(path.join(dir, name), "utf8"));
const [intel, content, missionList] = await Promise.all([read("intelligence.json"), read("missionContent.json"), read("missions.json")]);
const missions = Object.fromEntries(missionList.map((m) => [m.id, m]));

const problems = [];
const subjects = new Set(intel.subjects.map((s) => s.id));
const categories = new Set(intel.instrumentCategories.map((c) => c.id));

function checkRef(owner, mission, ref, wantKind) {
  const story = content[mission]?.inherited;
  if (!story) return problems.push(`${owner}: unknown mission ${mission}`);
  let value;
  switch (ref.from) {
    case "directVsInterpreted": {
      const item = story.directVsInterpreted[ref.index];
      value = item?.text;
      if (item && wantKind && item.kind !== wantKind) problems.push(`${owner}: reference ${ref.index} is "${item.kind}", expected "${wantKind}"`);
      break;
    }
    case "evidence": value = story.evidence[ref.index]; break;
    case "beforeAfterAfter": value = story.beforeAfter.after[ref.index]; break;
    case "ripple": value = story.ripple[ref.index]?.text; break;
    case "technology": value = story.technology; break;
    case "unanswered": value = story.unanswered?.text; break;
    default: problems.push(`${owner}: unknown reference type ${ref.from}`);
  }
  if (!value) problems.push(`${owner}: reference ${JSON.stringify(ref)} points at nothing`);
}

for (const [mission, map] of Object.entries(intel.instrumentCategoryByMission)) {
  const names = content[mission].chapters.science.instruments.map((i) => i.name);
  for (const name of names) if (!map[name]) problems.push(`${mission}: instrument "${name}" has no category`);
  for (const [name, cat] of Object.entries(map)) {
    if (!names.includes(name)) problems.push(`${mission}: category given for unknown instrument "${name}"`);
    if (!categories.has(cat)) problems.push(`${mission}: unknown category "${cat}"`);
  }
}

for (const d of intel.discoveries) {
  const names = content[d.mission].chapters.science.instruments.map((i) => i.name);
  d.instruments.forEach((n) => names.includes(n) || problems.push(`${d.id}: unknown instrument "${n}"`));
  d.subjects.forEach((s) => subjects.has(s) || problems.push(`${d.id}: unknown subject "${s}"`));
  d.observed.forEach((r) => checkRef(d.id, d.mission, r, "observed"));
  d.interpreted.forEach((r) => checkRef(d.id, d.mission, r, "interpreted"));
  d.caution.forEach((r) => checkRef(d.id, d.mission, r, "interpreted"));
  if (d.headline != null && !missions[d.mission].science.discoveries[d.headline]) problems.push(`${d.id}: no mission-record discovery #${d.headline}`);
}

for (const c of intel.connections) {
  if (!missions[c.from] || !missions[c.to]) problems.push(`${c.id}: unknown mission`);
  c.basis.forEach((b) => checkRef(c.id, b.mission, b));
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`intelligence.json is consistent: ${intel.discoveries.length} findings, ${intel.connections.length} connections, ${Object.values(intel.instrumentCategoryByMission).reduce((n, m) => n + Object.keys(m).length, 0)} instruments.`);
