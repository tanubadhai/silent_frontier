import { Link } from "react-router-dom";
import { TIMELINE_RANGE, TIMELINE_ROWS, formatSpan } from "../../utils/intelligence";

const START = Date.UTC(TIMELINE_RANGE.from, 0, 1);
const END = Date.UTC(TIMELINE_RANGE.to, 0, 1);
const pct = (date) => ((date.getTime() - START) / (END - START)) * 100;

const TICKS = [];
for (let year = TIMELINE_RANGE.from; year <= TIMELINE_RANGE.to; year += 5) TICKS.push(year);

/**
 * Launch to last contact for each mission, with the formal end date shown
 * separately where it differs. Every position comes from missions.json.
 */
export default function MissionTimeline() {
  return (
    <div className="timeline-chart">
      <div className="timeline-chart__axis" aria-hidden="true">
        {TICKS.map((year) => (
          <span key={year} style={{ left: `${pct(new Date(Date.UTC(year, 0, 1)))}%` }}>
            {year}
          </span>
        ))}
      </div>

      <ul className="timeline-chart__rows">
        {TIMELINE_ROWS.map((row) => {
          const left = pct(row.start);
          const width = Math.max(pct(row.stop) - left, 0.7);
          return (
            <li key={row.id} className="timeline-chart__row">
              <p className="timeline-chart__label">
                <Link to={`/mission/${row.id}`}>{row.label}</Link>
                <span>
                  {formatSpan(row.spanDays)}
                  {row.ongoing ? " so far" : ""}
                </span>
              </p>
              <div className="timeline-chart__track" aria-hidden="true">
                <span className={`timeline-chart__bar${row.ongoing ? " is-ongoing" : ""}`} style={{ left: `${left}%`, width: `${width}%` }} />
                {row.tailDays > 1 && row.formalEnd && (
                  <span
                    className="timeline-chart__tail"
                    style={{ left: `${pct(row.stop)}%`, width: `${Math.max(pct(row.formalEnd) - pct(row.stop), 0.4)}%` }}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="legend">
        <span className="legend__swatch legend__swatch--bar" /> Launch to last contact.{" "}
        <span className="legend__swatch legend__swatch--tail" /> Last contact to the formal end of the mission, where
        they differ. <span className="legend__swatch legend__swatch--ongoing" /> Still operating, so the bar runs to
        today.
      </p>
      <p className="note">
        Bars start at launch, not arrival, so they are not the time spent at the destination. ALSEP’s launch date is
        Apollo 12’s; its first station was set up on 19 November 1969. Surveyor 3’s bar is only 17 days long.
        Voyager 1 has no last-contact or end date because it is still transmitting.
      </p>

      <details className="timeline-chart__table">
        <summary>Show the dates behind the chart</summary>
        <div className="compare-wrap">
          <table className="compare">
            <caption className="visually-hidden">Launch, last contact and formal end dates for each mission</caption>
            <thead>
              <tr>
                <th scope="col">Mission</th>
                <th scope="col">Launch</th>
                <th scope="col">Last contact</th>
                <th scope="col">Formal end</th>
                <th scope="col">Launch to last contact</th>
              </tr>
            </thead>
            <tbody>
              {TIMELINE_ROWS.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.label}</th>
                  <td>{row.launch}</td>
                  <td>{row.lastContact ?? "Still transmitting"}</td>
                  <td>{row.end ?? "Not declared"}</td>
                  <td>
                    {formatSpan(row.spanDays)}
                    {row.ongoing ? " so far" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
