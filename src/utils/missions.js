import missions from "../data/missions.json";

/** Every mission in src/data/missions.json. This file is the single source of truth. */
export const ALL_MISSIONS = missions;

export function getMissionById(id) {
  return missions.find((mission) => mission.id === id) ?? null;
}

/** Looks up several ids and silently skips any that do not exist. */
export function getMissionsByIds(ids) {
  return ids.map(getMissionById).filter(Boolean);
}

/** Missions with at least one destination matching the given regular expression. */
export function getMissionsByDestination(pattern) {
  return missions.filter((mission) =>
    (mission.destinations ?? []).some((destination) => pattern.test(destination)),
  );
}

function parseDate(value) {
  if (typeof value !== "string" || !value) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "1977-09-05" -> "5 September 1977". Returns null for missing or invalid dates. */
export function formatDate(value) {
  const date = parseDate(value);
  if (!date) return null;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "1977-09-05" -> "1977". Returns null for missing or invalid dates. */
export function formatYear(value) {
  const date = parseDate(value);
  return date ? String(date.getUTCFullYear()) : null;
}

/** ["Jupiter", "Saturn"] -> "Jupiter and Saturn". */
export function joinList(items) {
  const list = (items ?? []).filter(Boolean);
  return new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(list);
}

/**
 * Short display name for tight spaces:
 * "Sojourner (Mars Pathfinder)" -> "Sojourner",
 * "Apollo Lunar Surface Experiments Package (ALSEP)" -> "ALSEP".
 */
export function shortName(name) {
  if (typeof name !== "string") return "";
  const match = name.match(/^(.*?)\s*\((.+)\)$/);
  if (!match) return name;
  const [, base, inner] = match;
  return base.length > 24 ? inner : base;
}

/** Maps a status label to a visual tone: "active", "inactive" or "neutral". */
export function statusTone(label) {
  const value = String(label ?? "").toLowerCase();
  if (!value) return "neutral";
  if (value.includes("inactive") || value.includes("completed")) return "inactive";
  if (value.includes("active") || value.includes("operational") || value.includes("operating")) return "active";
  return "neutral";
}
