import { DISCOVERIES, MISSIONS, SUBJECTS } from "../../utils/intelligence";

/**
 * Subjects down the side, missions across the top. A dot marks a mission that
 * has at least one documented finding on that subject in this archive. It shows
 * coverage, not importance, and the dots are the filter for the explorer below.
 */
export default function ImpactMatrix({ subject, missionIds, onPick }) {
  return (
    <div className="matrix-wrap">
      <table className="matrix">
        <caption className="visually-hidden">
          Which missions have documented findings on each scientific subject. Select a dot to filter the findings.
        </caption>
        <thead>
          <tr>
            <td />
            {MISSIONS.map((mission) => (
              <th key={mission.id} scope="col">
                <span>{mission.label}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SUBJECTS.map((item) => (
            <tr key={item.id}>
              <th scope="row">{item.title}</th>
              {MISSIONS.map((mission) => {
                const count = DISCOVERIES.filter((d) => d.mission === mission.id && d.subjects.includes(item.id)).length;
                const isOn = subject === item.id && missionIds.length === 1 && missionIds[0] === mission.id;
                return (
                  <td key={mission.id}>
                    {count > 0 ? (
                      <button
                        type="button"
                        className="matrix__dot"
                        aria-pressed={isOn}
                        aria-label={`${item.title}, ${mission.label}: ${count} documented ${count === 1 ? "finding" : "findings"}`}
                        onClick={() => onPick(item.id, mission.id)}
                      >
                        <span aria-hidden="true" />
                      </button>
                    ) : (
                      <span className="matrix__empty" aria-label={`${item.title}, ${mission.label}: none documented`}>
                        <span aria-hidden="true" />
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
