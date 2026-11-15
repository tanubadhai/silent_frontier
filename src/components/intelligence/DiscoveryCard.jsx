import { Link } from "react-router-dom";
import { TYPE_LABELS } from "../../utils/intelligence";

/**
 * The evidence ladder: what an instrument recorded, then what scientists
 * infer from it, kept visibly apart. A caution box is shown when the story
 * flags a limit on the interpretation.
 */
export function EvidenceLadder({ type, observed, observedIsStrict, interpreted, caution }) {
  const observedLabel =
    type === "engineering" ? "Demonstrated" : observedIsStrict ? "Observed" : "What the mission reported";

  return (
    <div className="ladder">
      {observed.map((text) => (
        <div key={text} className="ladder__step ladder__step--observed">
          <p className="ladder__label">{observedLabel}</p>
          <p>{text}</p>
        </div>
      ))}
      {interpreted.map((text) => (
        <div key={text} className="ladder__step ladder__step--interpreted">
          <p className="ladder__label">Interpreted</p>
          <p>{text}</p>
        </div>
      ))}
      {caution.map((text) => (
        <div key={text} className="ladder__step ladder__step--caution">
          <p className="ladder__label">Be careful here</p>
          <p>{text}</p>
        </div>
      ))}
    </div>
  );
}

/** One documented finding, with its mission, subjects, instruments and evidence. */
export default function DiscoveryCard({ discovery }) {
  const d = discovery;

  return (
    <article className="discovery">
      <div className="discovery__top">
        <Link to={`/mission/${d.mission}`} className="discovery__mission">
          {d.missionLabel}
        </Link>
        <span className="discovery__type" data-type={d.type}>
          {TYPE_LABELS[d.type]}
        </span>
      </div>

      <h3>{d.title}</h3>

      <ul className="discovery__subjects" aria-label="Subjects">
        {d.subjectTitles.map((title) => (
          <li key={title}>{title}</li>
        ))}
      </ul>

      {d.record && (
        <p className="discovery__record">
          Mission record: {d.record.text}{" "}
          <a href={d.record.url} target="_blank" rel="noopener noreferrer">
            Source
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </p>
      )}

      <EvidenceLadder
        type={d.type}
        observed={d.observedText}
        observedIsStrict={d.observedIsStrict}
        interpreted={d.interpretedText}
        caution={d.cautionText}
      />

      {d.instruments.length > 0 && (
        <p className="discovery__instruments">
          <span>Measured with</span> {d.instruments.join("; ")}
        </p>
      )}
      {d.note && <p className="discovery__note">{d.note}</p>}

      <Link to={`/mission/${d.mission}#inherited`} className="discovery__more">
        Read the full evidence in the mission story
      </Link>
    </article>
  );
}
