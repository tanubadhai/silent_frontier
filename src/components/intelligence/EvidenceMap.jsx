import { useState } from "react";
import { DISCOVERIES, MISSIONS, SUBJECTS } from "../../utils/intelligence";
import ChipGroup from "./ChipGroup";
import DiscoveryCard from "./DiscoveryCard";

const PITCH = 80; // vertical distance between rows, in px
const ITEM_HEIGHT = 68;

/**
 * Instrument → finding → subject for one mission. Lines are drawn only where
 * the curated data links them: a finding lists the instruments it used and the
 * subjects it belongs to. Choose or hover a finding to follow its lines.
 */
export default function EvidenceMap() {
  const [missionId, setMissionId] = useState("insight");
  const [activeId, setActiveId] = useState(null);

  const findings = DISCOVERIES.filter((d) => d.mission === missionId && d.instruments.length > 0);
  const unlinked = DISCOVERIES.filter((d) => d.mission === missionId && d.instruments.length === 0);
  const instruments = [...new Set(findings.flatMap((d) => d.instruments))];
  const subjects = [...new Set(findings.flatMap((d) => d.subjects))].map((id) => SUBJECTS.find((s) => s.id === id));
  const active = findings.find((d) => d.id === activeId) ?? findings[0];

  const rows = Math.max(instruments.length, findings.length, subjects.length);
  const height = rows * PITCH - (PITCH - ITEM_HEIGHT);
  const offset = (count) => ((rows - count) * PITCH) / 2;
  const centre = (index, count) => offset(count) + index * PITCH + ITEM_HEIGHT / 2;

  const chooseMission = (id) => {
    setMissionId(id);
    setActiveId(null);
  };

  return (
    <div className="evidence-map">
      <ChipGroup
        label="Choose a mission"
        options={MISSIONS.map((m) => ({ id: m.id, label: m.label }))}
        selected={[missionId]}
        onToggle={chooseMission}
      />

      <div className="evidence-map__diagram" style={{ height }}>
        <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">
          {findings.map((finding, fi) => {
            const yFinding = centre(fi, findings.length);
            const isActive = active?.id === finding.id;
            return (
              <g key={finding.id} className={`evidence-map__lines${isActive ? " is-active" : ""}`}>
                {finding.instruments.map((name) => {
                  const yInstrument = centre(instruments.indexOf(name), instruments.length);
                  return <path key={name} d={`M26 ${yInstrument} C30 ${yInstrument} 30 ${yFinding} 34 ${yFinding}`} />;
                })}
                {finding.subjects.map((id) => {
                  const ySubject = centre(subjects.findIndex((s) => s.id === id), subjects.length);
                  return <path key={id} d={`M66 ${yFinding} C70 ${yFinding} 70 ${ySubject} 74 ${ySubject}`} />;
                })}
              </g>
            );
          })}
        </svg>

        <ul className="evidence-map__col" style={{ paddingTop: offset(instruments.length) }} aria-label="Instruments">
          {instruments.map((name) => (
            <li key={name} className="evidence-map__node" data-linked={active?.instruments.includes(name) || undefined}>
              {name}
            </li>
          ))}
        </ul>

        <ul className="evidence-map__col evidence-map__col--findings" style={{ paddingTop: offset(findings.length) }} aria-label="Findings">
          {findings.map((finding) => (
            <li key={finding.id}>
              <button
                type="button"
                className="evidence-map__node evidence-map__node--finding"
                aria-pressed={active?.id === finding.id}
                onMouseEnter={() => setActiveId(finding.id)}
                onFocus={() => setActiveId(finding.id)}
                onClick={() => setActiveId(finding.id)}
              >
                {finding.title}
              </button>
            </li>
          ))}
        </ul>

        <ul className="evidence-map__col" style={{ paddingTop: offset(subjects.length) }} aria-label="Subjects">
          {subjects.map((subject) => (
            <li key={subject.id} className="evidence-map__node" data-linked={active?.subjects.includes(subject.id) || undefined}>
              {subject.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Small screens: no diagram, so each finding says what it links to. */}
      <ul className="evidence-map__stack">
        {findings.map((finding) => (
          <li key={finding.id}>
            <button
              type="button"
              aria-pressed={active?.id === finding.id}
              onClick={() => setActiveId(finding.id)}
            >
              <strong>{finding.title}</strong>
              <span>Measured with: {finding.instruments.join("; ")}</span>
              <span>Subject: {finding.subjectTitles.join("; ")}</span>
            </button>
          </li>
        ))}
      </ul>

      {unlinked.length > 0 && (
        <p className="note">
          Also documented for this mission, but not tied to a single instrument in this archive:{" "}
          {unlinked.map((d) => d.title).join("; ")}.
        </p>
      )}

      {active && (
        <div className="evidence-map__detail" aria-live="polite">
          <DiscoveryCard discovery={active} />
        </div>
      )}
    </div>
  );
}
