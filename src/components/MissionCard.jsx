import { Link } from "react-router-dom";
import { formatYear } from "../utils/missions";
import { missionCardImage } from "../utils/missionImages";
import ImageFrame from "./ImageFrame";
import StatusChip from "./StatusChip";
import "./MissionCard.css";

/**
 * Summary card for one mission from missions.json, with its NASA image.
 * Every field except `id` and `name` is optional: anything missing is left out.
 * The whole card is clickable through the title link.
 */
export default function MissionCard({ mission }) {
  if (!mission?.id || !mission?.name) return null;

  const image = missionCardImage(mission.id);
  const year = formatYear(mission.timeline?.launch_date);
  const category = mission.mission_category;
  const destination = mission.destinations?.[0];
  const summary = mission.science?.legacy || mission.status?.description;
  const facts = [category, destination].filter(Boolean);

  return (
    <article className="mission-card">
      {image && (
        <div className="mission-card__media">
          <ImageFrame image={image} aspect="16 / 10" />
          <p className="mission-card__credit">
            {image.type === "artist concept" ? "Artist’s concept. " : ""}
            Credit: {image.credit}
          </p>
        </div>
      )}

      <div className="mission-card__body">
        <div className="mission-card__top">
          <StatusChip label={mission.status?.spacecraft_status} />
          {year && <span className="mission-card__year">Launched {year}</span>}
        </div>

        <h3 className="mission-card__title">
          <Link className="mission-card__link" to={`/mission/${mission.id}`}>
            {mission.name}
          </Link>
        </h3>

        {facts.length > 0 && (
          <ul className="mission-card__facts">
            {facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        )}

        {summary && <p className="mission-card__summary">{summary}</p>}
      </div>
    </article>
  );
}
