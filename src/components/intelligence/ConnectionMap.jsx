import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CONNECTIONS,
  LANES,
  MISSIONS,
  RIPPLES,
  laneFor,
  missionLabel,
  missionRecord,
} from "../../utils/intelligence";

const WIDTH = 1000;
const LANE_TOP = 62;
const LANE_GAP = 92;
const X_FROM = 175;
const X_TO = 960;
const RADIUS = 15;

const yearOf = (iso) => {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.getUTCFullYear() + d.getUTCMonth() / 12;
};

const years = MISSIONS.map((m) => yearOf(missionRecord(m.id).timeline.launch_date));
const Y0 = Math.floor(Math.min(...years)) - 1;
const Y1 = Math.ceil(Math.max(...years)) + 1;

/** Nodes sit at their launch date (left to right) and in the lane of their destination. */
const NODES = (() => {
  const nodes = MISSIONS.map((m) => {
    const lane = LANES.findIndex((l) => l.kind === laneFor(m.id));
    return {
      id: m.id,
      label: m.label,
      x: X_FROM + ((yearOf(missionRecord(m.id).timeline.launch_date) - Y0) / (Y1 - Y0)) * (X_TO - X_FROM),
      y: LANE_TOP + lane * LANE_GAP,
      lane,
      above: false,
    };
  });
  // When two labels in one lane would collide, put the later one above its node.
  for (const lane of LANES.keys()) {
    const inLane = nodes.filter((n) => n.lane === lane).sort((a, b) => a.x - b.x);
    inLane.forEach((node, i) => {
      if (i > 0 && node.x - inLane[i - 1].x < 90 && !inLane[i - 1].above) node.above = true;
    });
  }
  return nodes;
})();

const node = (id) => NODES.find((n) => n.id === id);

function edgePath(from, to) {
  const a = node(from);
  const b = node(to);
  if (a.y === b.y) {
    const mid = (a.x + b.x) / 2;
    return `M${a.x + RADIUS} ${a.y - 4} Q${mid} ${a.y - 52} ${b.x - RADIUS - 4} ${b.y - 6}`;
  }
  const dir = b.y > a.y ? 1 : -1;
  return `M${a.x + RADIUS} ${a.y + 2 * dir} C${a.x + 280} ${a.y} ${b.x - 220} ${b.y} ${b.x - RADIUS - 6} ${b.y}`;
}

/**
 * Missions placed by launch date and destination, joined only by the
 * connections documented in this archive's stories. The list under the map is
 * the accessible version of the same information.
 */
export default function ConnectionMap() {
  const [selectedId, setSelectedId] = useState(CONNECTIONS[0].id);
  const selected = CONNECTIONS.find((c) => c.id === selectedId);
  const linked = new Set(CONNECTIONS.flatMap((c) => [c.from, c.to]));
  const isolated = MISSIONS.filter((m) => !linked.has(m.id));

  return (
    <div className="connections">
      <div className="connections__scroll">
        <svg viewBox={`0 0 ${WIDTH} ${LANE_TOP + (LANES.length - 1) * LANE_GAP + 60}`} aria-hidden="true">
          <defs>
            <marker id="conn-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" />
            </marker>
          </defs>

          {LANES.map((lane, i) => (
            <g key={lane.kind}>
              <line className="connections__lane" x1="150" x2={WIDTH - 10} y1={LANE_TOP + i * LANE_GAP} y2={LANE_TOP + i * LANE_GAP} />
              <text className="connections__lane-label" x="10" y={LANE_TOP + i * LANE_GAP + 5}>
                {lane.title}
              </text>
            </g>
          ))}

          {CONNECTIONS.map((c) => (
            <path
              key={c.id}
              d={edgePath(c.from, c.to)}
              className={`connections__edge${c.id === selectedId ? " is-selected" : ""}`}
              data-status={c.status}
              markerEnd="url(#conn-arrow)"
              onClick={() => setSelectedId(c.id)}
            />
          ))}

          {NODES.map((n) => (
            <g key={n.id} className={`connections__node${linked.has(n.id) ? "" : " is-isolated"}`}>
              <circle cx={n.x} cy={n.y} r={RADIUS} />
              <text x={n.x} y={n.above ? n.y - 24 : n.y + 36} textAnchor="middle">
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <p className="note">
        Position left to right is launch date ({Y0} to {Y1}); position up and down is destination. A line is drawn
        only where a mission story documents the link. A dashed line means the link relies on a statement that still
        needs checking against a NASA page.
      </p>

      <ul className="connections__list" aria-label="Documented connections">
        {CONNECTIONS.map((c) => (
          <li key={c.id}>
            <button type="button" aria-pressed={c.id === selectedId} onClick={() => setSelectedId(c.id)}>
              <strong>
                {missionLabel(c.from)} to {missionLabel(c.to)}
              </strong>
              <span>{c.typeLabel}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="connections__detail" aria-live="polite">
        <h3>
          {missionLabel(selected.from)} to {missionLabel(selected.to)}
        </h3>
        <p className="connections__type">
          {selected.typeLabel}
          <span className="connections__status" data-status={selected.status}>
            {selected.status === "supported" ? "Supported by the mission stories" : "Needs checking against a NASA page"}
          </span>
        </p>
        {selected.basis.map((b) => (
          <blockquote key={b.text}>
            <p>
              {b.title && <strong>{b.title}. </strong>}
              {b.text}
            </p>
            <footer>
              From the <Link to={`/mission/${b.mission}#inherited`}>{missionLabel(b.mission)} story</Link>
            </footer>
          </blockquote>
        ))}
        <p>{selected.note}</p>
        <p className="connections__caveat">
          <strong>Limit of this link.</strong> {selected.caveat}
        </p>
      </div>

      {isolated.length > 0 && (
        <p className="note">
          {isolated.map((m) => m.label).join(" and ")} {isolated.length === 1 ? "has" : "have"} no documented link to
          another mission in this archive, so no line is drawn for {isolated.length === 1 ? "it" : "them"}.
        </p>
      )}

      <h3 className="connections__beyond-title">Where each mission’s influence went next</h3>
      <p className="note">These are the “ripple effects” recorded in each mission story, including follow-on work outside this archive.</p>
      <div className="connections__beyond">
        {RIPPLES.map((entry) => (
          <details key={entry.mission}>
            <summary>{entry.label}</summary>
            <ul>
              {entry.items.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}.</strong> {item.text}
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}
