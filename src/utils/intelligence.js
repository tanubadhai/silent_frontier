import content from "../data/missionContent.json";
import intel from "../data/intelligence.json";
import { DESTINATIONS } from "./destinations";
import { ALL_MISSIONS, formatDate, shortName } from "./missions";

/*
 * Data layer for the Mission Intelligence page.
 *
 * Nothing here adds a measurement or a discovery. The curated file
 * (src/data/intelligence.json) only decides which subject a finding belongs to,
 * which instruments it used and which missions are linked. Every sentence shown
 * is resolved from missions.json or missionContent.json through a reference.
 */

export const SUBJECTS = intel.subjects;
export const INSTRUMENT_CATEGORIES = intel.instrumentCategories;
export const METHOD_NOTE = intel.method;

/** Missions in launch order, with a short display label. */
export const MISSIONS = [...ALL_MISSIONS]
  .sort((a, b) => a.timeline.launch_date.localeCompare(b.timeline.launch_date))
  .map((mission) => ({ id: mission.id, name: mission.name, label: shortName(mission.name) }));

export function missionLabel(id) {
  return MISSIONS.find((mission) => mission.id === id)?.label ?? id;
}

export function missionRecord(id) {
  return ALL_MISSIONS.find((mission) => mission.id === id);
}

/** Resolves a reference such as { from: "directVsInterpreted", index: 0 } to text. */
export function refText(missionId, ref) {
  const inherited = content[missionId].inherited;
  switch (ref.from) {
    case "directVsInterpreted":
      return inherited.directVsInterpreted[ref.index].text;
    case "evidence":
      return inherited.evidence[ref.index];
    case "beforeAfterAfter":
      return inherited.beforeAfter.after[ref.index];
    case "ripple":
      return inherited.ripple[ref.index].text;
    case "technology":
      return inherited.technology;
    case "unanswered":
      return inherited.unanswered.text;
    default:
      return "";
  }
}

export function refTitle(missionId, ref) {
  return ref.from === "ripple" ? content[missionId].inherited.ripple[ref.index].title : null;
}

const SUBJECT_TITLES = Object.fromEntries(SUBJECTS.map((subject) => [subject.id, subject.title]));

/** True when every "observed" sentence comes from the story's observed/interpreted list. */
function isStrictObservation(refs) {
  return refs.length > 0 && refs.every((ref) => ref.from === "directVsInterpreted");
}

export const TYPE_LABELS = {
  finding: "Finding",
  engineering: "Engineering demonstration",
  negative: "Unexpected or negative result",
};

export const DISCOVERIES = intel.discoveries.map((d) => {
  const record = d.headline == null ? null : missionRecord(d.mission).science.discoveries[d.headline];
  return {
    ...d,
    missionLabel: missionLabel(d.mission),
    subjectTitles: d.subjects.map((id) => SUBJECT_TITLES[id]),
    observedText: d.observed.map((ref) => refText(d.mission, ref)),
    observedIsStrict: isStrictObservation(d.observed),
    interpretedText: d.interpreted.map((ref) => refText(d.mission, ref)),
    cautionText: d.caution.map((ref) => refText(d.mission, ref)),
    record: record ? { text: record.description, url: record.source_url } : null,
  };
});

export function getDiscovery(id) {
  return DISCOVERIES.find((d) => d.id === id) ?? null;
}

/* ---- Instruments ----------------------------------------------------------- */

export const INSTRUMENTS = MISSIONS.flatMap(({ id: missionId }) => {
  const story = content[missionId];
  const featured = story.inherited.instrument;
  return story.chapters.science.instruments.map((instrument) => ({
    id: `${missionId}:${instrument.name}`,
    mission: missionId,
    missionLabel: missionLabel(missionId),
    name: instrument.name,
    role: instrument.role,
    status: instrument.status,
    category: intel.instrumentCategoryByMission[missionId][instrument.name],
    how: instrument.name.startsWith(featured.name) || featured.name === instrument.name ? featured.how : null,
    findings: DISCOVERIES.filter((d) => d.mission === missionId && d.instruments.includes(instrument.name)),
  }));
});

/* ---- Connections ------------------------------------------------------------ */

export const CONNECTIONS = intel.connections.map((connection) => ({
  ...connection,
  basis: connection.basis.map((ref) => ({
    mission: ref.mission,
    title: refTitle(ref.mission, ref),
    text: refText(ref.mission, ref),
  })),
}));

/** Where each mission's influence went next, as recorded in its story (beyond this archive). */
export const RIPPLES = MISSIONS.map(({ id }) => ({
  mission: id,
  label: missionLabel(id),
  items: content[id].inherited.ripple,
}));

/* ---- Timeline ---------------------------------------------------------------- */

const TODAY = new Date();
const toDate = (value) => (value ? new Date(`${value}T00:00:00Z`) : null);
const DAY = 86_400_000;

export function formatSpan(days) {
  if (days < 90) return `${Math.max(1, Math.round(days))} days`;
  return `${(days / 365.25).toFixed(1)} years`;
}

export const TIMELINE_ROWS = MISSIONS.map(({ id, label }) => {
  const { launch_date: launch, last_contact_date: last, end_date: end } = missionRecord(id).timeline;
  const start = toDate(launch);
  const lastContact = toDate(last);
  const formalEnd = toDate(end);
  const ongoing = !lastContact;
  const stop = lastContact ?? TODAY;
  return {
    id,
    label,
    launch: formatDate(launch),
    lastContact: last ? formatDate(last) : null,
    end: end ? formatDate(end) : null,
    start,
    stop,
    formalEnd,
    ongoing,
    spanDays: (stop - start) / DAY,
    tailDays: formalEnd && lastContact ? (formalEnd - lastContact) / DAY : 0,
  };
});

export const TIMELINE_RANGE = (() => {
  const years = TIMELINE_ROWS.flatMap((row) => [row.start, row.stop, row.formalEnd].filter(Boolean)).map((d) => d.getUTCFullYear());
  return { from: Math.floor((Math.min(...years) - 1) / 5) * 5, to: Math.ceil((Math.max(...years) + 1) / 5) * 5 };
})();

/* ---- Connection map layout ------------------------------------------------------ */

/** Which destination lane a mission belongs to, using the same groups as the Explorer. */
export function laneFor(missionId) {
  const destinations = missionRecord(missionId).destinations ?? [];
  const lane = DESTINATIONS.find((group) => destinations.some((place) => group.pattern.test(place)));
  return lane?.kind ?? "deep";
}

export const LANES = DESTINATIONS.map(({ kind, title }) => ({ kind, title }));
export const STORIES = content;
