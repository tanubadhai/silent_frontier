import { useState } from "react";
import { Link } from "react-router-dom";
import StatusChip from "../StatusChip";
import { joinList } from "../../utils/missions";
import { DISCOVERIES, MISSIONS, STORIES, missionRecord } from "../../utils/intelligence";
import ChipGroup from "./ChipGroup";

const MAX = 3;

function List({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

const ROWS = [
  {
    label: "Status",
    cell: (id) => {
      const status = missionRecord(id).status;
      return (
        <div className="compare__status">
          <p>
            <span>Mission</span> <StatusChip label={status.mission_status} />
          </p>
          <p>
            <span>Spacecraft</span> <StatusChip label={status.spacecraft_status} />
          </p>
        </div>
      );
    },
  },
  { label: "Destination", cell: (id) => joinList(missionRecord(id).destinations) },
  { label: "Scientific objectives", cell: (id) => <List items={missionRecord(id).science.objectives} /> },
  {
    label: "Instruments",
    cell: (id) => <List items={STORIES[id].chapters.science.instruments.map((instrument) => instrument.name)} />,
  },
  {
    label: "Findings",
    cell: (id) => <List items={DISCOVERIES.filter((d) => d.mission === id && d.type !== "engineering").map((d) => d.title)} />,
  },
  {
    label: "Engineering firsts",
    cell: (id) => <List items={DISCOVERIES.filter((d) => d.mission === id && d.type === "engineering").map((d) => d.title)} />,
  },
  { label: "Scientific contribution", cell: (id) => STORIES[id].inherited.breakthrough },
  {
    label: "Long-term influence",
    cell: (id) => (
      <>
        <p>{STORIES[id].inherited.legacy}</p>
        <List items={STORIES[id].inherited.ripple.map((item) => item.title)} />
      </>
    ),
  },
  { label: "Still unknown", cell: (id) => STORIES[id].inherited.unanswered.question },
];

/** Side-by-side table of up to three missions, built only from missions.json and the mission stories. */
export default function MissionCompare() {
  const [selected, setSelected] = useState(["voyager-1", "pioneer-10"]);

  const toggle = (id) =>
    setSelected((current) => {
      if (current.includes(id)) return current.length > 1 ? current.filter((item) => item !== id) : current;
      return current.length < MAX ? [...current, id] : current;
    });

  const disabledIds = selected.length >= MAX ? MISSIONS.filter((m) => !selected.includes(m.id)).map((m) => m.id) : [];
  const ordered = MISSIONS.filter((m) => selected.includes(m.id));

  return (
    <div className="compare-panel">
      <ChipGroup
        label={`Choose up to ${MAX} missions to compare`}
        options={MISSIONS.map((m) => ({ id: m.id, label: m.label }))}
        selected={selected}
        onToggle={toggle}
        disabledIds={disabledIds}
      />
      <p className="note" aria-live="polite">
        {selected.length >= MAX
          ? `Comparing ${MAX} missions. Deselect one to choose another.`
          : "Choose up to three. Good pairs to try: Opportunity and InSight, or ALSEP and InSight."}
      </p>

      <div className="compare-wrap">
        <table className="compare">
          <caption className="visually-hidden">Comparison of the selected missions</caption>
          <thead>
            <tr>
              <td />
              {ordered.map((mission) => (
                <th key={mission.id} scope="col">
                  <Link to={`/mission/${mission.id}`}>{mission.name}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {ordered.map((mission) => (
                  <td key={mission.id}>{row.cell(mission.id)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
