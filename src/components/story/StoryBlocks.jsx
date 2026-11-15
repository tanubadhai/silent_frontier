import MissionFigure from "../MissionFigure";
import StatusChip from "../StatusChip";
import "./StoryBlocks.css";

/** Plain paragraphs. */
export function Prose({ paragraphs }) {
  if (!paragraphs?.length) return null;
  return (
    <div className="prose">
      {paragraphs.map((text) => (
        <p key={text.slice(0, 48)}>{text}</p>
      ))}
    </div>
  );
}

/** Vertical timeline of dated events. */
export function Timeline({ items, label }) {
  if (!items?.length) return null;
  return (
    <ol className="timeline" aria-label={label}>
      {items.map((item) => (
        <li key={`${item.date}-${item.title}`} className="timeline__item">
          <p className="timeline__date">{item.date}</p>
          <div>
            <p className="timeline__title">{item.title}</p>
            <p className="timeline__text">{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Short label / value facts. */
export function FactList({ facts }) {
  if (!facts?.length) return null;
  return (
    <dl className="fact-list">
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Mission status, spacecraft status, last contact, end date and what remains. */
export function StatusTable({ rows }) {
  if (!rows?.length) return null;
  return (
    <dl className="status-table">
      {rows.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function instrumentTone(text = "") {
  const value = text.toLowerCase();
  if (value.includes("operating")) return "active";
  if (/(off|inactive|powered down|damaged|did not|completed|removed|returned)/.test(value)) return "inactive";
  return "neutral";
}

/** One row per instrument: what it does and what state it is in. */
export function InstrumentList({ instruments }) {
  if (!instruments?.length) return null;
  return (
    <ul className="instrument-list">
      {instruments.map((instrument) => (
        <li key={instrument.name} className="instrument-list__item">
          <p className="instrument-list__name">{instrument.name}</p>
          <p className="instrument-list__role">{instrument.role}</p>
          <p className="instrument-list__status" data-tone={instrumentTone(instrument.status)}>
            <span aria-hidden="true" />
            {instrument.status}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Hardware cards: each important physical object, its place and its condition. */
export function EntityCards({ entities }) {
  if (!entities?.length) return null;
  return (
    <ul className="entity-cards">
      {entities.map((entity) => (
        <li key={entity.name} className="entity-card">
          <div className="entity-card__top">
            <p className="entity-card__type">{entity.type}</p>
            <StatusChip label={entity.condition} />
          </div>
          <h4>{entity.name}</h4>
          <p>{entity.text}</p>
          <p className="entity-card__location">
            <span>Where</span> {entity.location}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Two columns showing how understanding changed. */
export function BeforeAfter({ before, after }) {
  return (
    <div className="before-after">
      <div className="before-after__col">
        <h4>Before this mission</h4>
        <ul>
          {before.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
      <div className="before-after__col before-after__col--after">
        <h4>After this mission</h4>
        <ul>
          {after.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** "Inside the instrument": how one piece of hardware worked. */
export function InstrumentFocus({ name, how, figure }) {
  return (
    <div className="instrument-focus" data-has-figure={figure ? "true" : undefined}>
      <div className="instrument-focus__text">
        <h4>{name}</h4>
        <p>{how}</p>
      </div>
      {figure && (
        <div className="instrument-focus__figure">
          <MissionFigure imageId={figure} compact />
        </div>
      )}
    </div>
  );
}

/** What was observed and what was interpreted, kept apart. */
export function DirectVsInterpreted({ items }) {
  if (!items?.length) return null;
  return (
    <ul className="dvi">
      {items.map((item) => (
        <li key={item.text} className="dvi__item" data-kind={item.kind}>
          <span className="dvi__badge">{item.kind === "observed" ? "Observed" : "Interpreted"}</span>
          <p>{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

/** The most surprising verified discovery. */
export function DiscoverySpotlight({ headline, text, evidence, figure }) {
  return (
    <div className="spotlight" data-has-figure={figure ? "true" : undefined}>
      <div className="spotlight__text">
        <h4>{headline}</h4>
        <p>{text}</p>
        {evidence?.length > 0 && (
          <ul className="spotlight__evidence" aria-label="Supporting evidence">
            {evidence.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
      </div>
      {figure && (
        <div className="spotlight__figure">
          <MissionFigure imageId={figure} compact />
        </div>
      )}
    </div>
  );
}

/** Verified quantities. Every number shows its source. */
export function ByTheNumbers({ numbers }) {
  if (!numbers?.length) return null;
  return (
    <ul className="numbers">
      {numbers.map((item) => (
        <li key={item.label} className="numbers__item">
          <p className="numbers__value">{item.value}</p>
          <p className="numbers__label">{item.label}</p>
          <p className="numbers__source">Source: {item.source}</p>
        </li>
      ))}
    </ul>
  );
}

/** How the findings or technology influenced later work. */
export function RippleEffect({ items }) {
  if (!items?.length) return null;
  return (
    <ol className="ripple">
      {items.map((item) => (
        <li key={item.title} className="ripple__item">
          <p className="ripple__title">{item.title}</p>
          <p>{item.text}</p>
        </li>
      ))}
    </ol>
  );
}

/** Ends each story with what scientists still do not know. */
export function Unanswered({ question, text, future }) {
  return (
    <div className="unanswered">
      <h3>The unanswered question</h3>
      <p className="unanswered__question">{question}</p>
      <p>{text}</p>
      {future && <p className="unanswered__future">{future}</p>}
    </div>
  );
}
