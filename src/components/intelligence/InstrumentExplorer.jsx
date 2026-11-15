import { useState } from "react";
import { Link } from "react-router-dom";
import { INSTRUMENTS, INSTRUMENT_CATEGORIES } from "../../utils/intelligence";
import ChipGroup from "./ChipGroup";
import { EvidenceLadder } from "./DiscoveryCard";

const ALL = "all";

function statusTone(status = "") {
  const value = status.toLowerCase();
  if (value.includes("operating")) return "active";
  if (/(off|inactive|powered down|damaged|did not|completed|removed|returned)/.test(value)) return "inactive";
  return "neutral";
}

function InstrumentCard({ instrument }) {
  const categoryTitle = INSTRUMENT_CATEGORIES.find((c) => c.id === instrument.category)?.title;
  return (
    <article className="instrument">
      <p className="instrument__category">{categoryTitle}</p>
      <h3>{instrument.name}</h3>
      <p className="instrument__mission">
        On <Link to={`/mission/${instrument.mission}`}>{instrument.missionLabel}</Link>
      </p>
      <p className="instrument__role">
        <span>What it measured</span> {instrument.role}
      </p>
      <p className="instrument__status" data-tone={statusTone(instrument.status)}>
        <span aria-hidden="true" />
        {instrument.status}
      </p>

      {instrument.findings.length > 0 && (
        <p className="instrument__findings">
          <span>Contributed to</span> {instrument.findings.map((f) => f.title).join("; ")}
        </p>
      )}

      {(instrument.how || instrument.findings.length > 0) && (
        <details className="instrument__details">
          <summary>{instrument.how ? "How it works, and what it showed" : "What it showed"}</summary>
          {instrument.how && <p>{instrument.how}</p>}
          {instrument.findings.slice(0, 2).map((finding) => (
            <div key={finding.id} className="instrument__finding">
              <p className="instrument__finding-title">{finding.title}</p>
              <EvidenceLadder
                type={finding.type}
                observed={finding.observedText}
                observedIsStrict={finding.observedIsStrict}
                interpreted={finding.interpretedText}
                caution={finding.cautionText}
              />
            </div>
          ))}
        </details>
      )}
    </article>
  );
}

/** Every instrument in the archive, grouped by what kind of measurement it makes. */
export default function InstrumentExplorer() {
  const [category, setCategory] = useState(ALL);
  const info = INSTRUMENT_CATEGORIES.find((c) => c.id === category);
  const shown = INSTRUMENTS.filter((instrument) => category === ALL || instrument.category === category);

  return (
    <div className="instrument-panel">
      <ol className="steps">
        <li>
          <strong>The instrument measures.</strong> A camera records light, a seismometer records ground motion, a
          spectrometer records how light is absorbed.
        </li>
        <li>
          <strong>The measurement is the observation.</strong> It is a direct record of what happened at the
          spacecraft.
        </li>
        <li>
          <strong>Scientists interpret it.</strong> They connect observations to a model, such as “this heat came from
          tidal squeezing”. Interpretations can be revised.
        </li>
      </ol>

      <ChipGroup
        label="Filter instruments by kind of measurement"
        options={[{ id: ALL, label: "All instruments" }, ...INSTRUMENT_CATEGORIES.map((c) => ({ id: c.id, label: c.title }))]}
        selected={[category]}
        onToggle={setCategory}
      />
      <p className="subject-blurb" aria-live="polite">
        {info
          ? info.blurb
          : "Each card shows what an instrument measured and what state it is in. Step-by-step explanations are written for the eight featured instruments, one per mission; the rest show what each measured."}
      </p>

      <ul className="instrument-grid">
        {shown.map((instrument) => (
          <li key={instrument.id}>
            <InstrumentCard instrument={instrument} />
          </li>
        ))}
      </ul>
      <p className="note">
        Status is as recorded in the mission stories and can change, most of all for Voyager 1. Check NASA for the
        current state.
      </p>
    </div>
  );
}
