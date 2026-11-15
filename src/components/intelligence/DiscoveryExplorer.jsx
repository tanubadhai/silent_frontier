import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DISCOVERIES, MISSIONS, SUBJECTS } from "../../utils/intelligence";
import ChipGroup from "./ChipGroup";
import DiscoveryCard from "./DiscoveryCard";
import ImpactMatrix from "./ImpactMatrix";

const ALL = "all";

/** Subject and mission filters over every documented finding, plus the impact matrix. */
export default function DiscoveryExplorer() {
  const [subject, setSubject] = useState(ALL);
  const [missionIds, setMissionIds] = useState([]);
  const resultsRef = useRef(null);

  const subjectInfo = SUBJECTS.find((item) => item.id === subject);
  const results = DISCOVERIES.filter(
    (d) =>
      (subject === ALL || d.subjects.includes(subject)) &&
      (missionIds.length === 0 || missionIds.includes(d.mission)),
  );

  const toggleMission = (id) =>
    setMissionIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const pick = (subjectId, missionId) => {
    setSubject(subjectId);
    setMissionIds([missionId]);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resultsRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const reset = () => {
    setSubject(ALL);
    setMissionIds([]);
  };

  return (
    <div className="explorer-panel">
      <ImpactMatrix subject={subject} missionIds={missionIds} onPick={pick} />
      <p className="note">
        A dot means this archive documents at least one finding on that subject for that mission. It shows coverage,
        not importance.
      </p>

      <div className="filters">
        <p className="filters__label" id="filter-subject">
          Subject
        </p>
        <ChipGroup
          label="Filter by subject"
          options={[{ id: ALL, label: "All subjects" }, ...SUBJECTS.map((s) => ({ id: s.id, label: s.title }))]}
          selected={[subject]}
          onToggle={setSubject}
        />
        <p className="filters__label" id="filter-mission">
          Mission
        </p>
        <ChipGroup
          label="Filter by mission (choose any number)"
          options={MISSIONS.map((m) => ({ id: m.id, label: m.label }))}
          selected={missionIds}
          onToggle={toggleMission}
        />
      </div>

      <div ref={resultsRef} className="results-head" aria-live="polite">
        <p>
          Showing {results.length} of {DISCOVERIES.length} documented findings
          {subjectInfo ? ` on ${subjectInfo.title.toLowerCase()}` : ""}.
        </p>
        {(subject !== ALL || missionIds.length > 0) && (
          <button type="button" className="text-button" onClick={reset}>
            Clear filters
          </button>
        )}
      </div>
      {subjectInfo && (
        <p className="subject-blurb">
          {subjectInfo.blurb}
          {subjectInfo.caution && <strong> {subjectInfo.caution}</strong>}
        </p>
      )}

      <p className="legend">
        <span className="legend__swatch legend__swatch--observed" /> Observed: what an instrument recorded.{" "}
        <span className="legend__swatch legend__swatch--interpreted" /> Interpreted: what scientists infer from it.
      </p>

      {results.length === 0 ? (
        <p className="empty">No documented findings match those filters. Try clearing one.</p>
      ) : (
        <ul className="discovery-grid">
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((d) => (
              <motion.li
                key={d.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <DiscoveryCard discovery={d} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
