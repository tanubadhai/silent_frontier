import { useState } from "react";
import { Link } from "react-router-dom";
import ImageFrame from "../components/ImageFrame";
import MissionCard from "../components/MissionCard";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { DESTINATIONS } from "../utils/destinations";
import { destinationImage } from "../utils/missionImages";
import { getMissionsByDestination } from "../utils/missions";
import "./Explorer.css";

const FILTERS = [{ kind: "all", title: "Everywhere" }, ...DESTINATIONS.map(({ kind, title }) => ({ kind, title }))];

export default function Explorer() {
  useDocumentTitle("Explorer Atlas");
  const [filter, setFilter] = useState("all");

  const groups = DESTINATIONS.filter((destination) => filter === "all" || destination.kind === filter);

  return (
    <div className="explorer container">
      <header className="explorer__intro">
        <h1>Explorer Atlas</h1>
        <p>
          Every spacecraft in the archive, grouped by where it ended up. Choose a destination, then open any
          mission for its full story.
        </p>

        <div className="explorer__filters" role="group" aria-label="Filter by destination">
          {FILTERS.map((item) => (
            <button
              key={item.kind}
              type="button"
              className="explorer__filter"
              aria-pressed={filter === item.kind}
              onClick={() => setFilter(item.kind)}
            >
              {item.title}
            </button>
          ))}
        </div>
      </header>

      {groups.map((destination) => {
        const missions = getMissionsByDestination(destination.pattern);
        const image = destinationImage(destination.kind);

        return (
          <section key={destination.kind} className="destination" aria-labelledby={`dest-${destination.kind}`}>
            <div className="destination__header">
              {image && (
                <figure className="destination__figure">
                  <ImageFrame image={image} aspect="16 / 9" />
                  <figcaption>
                    {image.title}. Credit: {image.credit}
                    {image.sourcePage && (
                      <>
                        {" · "}
                        <a href={image.sourcePage} target="_blank" rel="noopener noreferrer">
                          Source
                          <span className="visually-hidden"> (opens in a new tab)</span>
                        </a>
                      </>
                    )}
                  </figcaption>
                </figure>
              )}
              <div>
                <h2 id={`dest-${destination.kind}`}>{destination.title}</h2>
                <p>{destination.text}</p>
              </div>
            </div>

            {missions.length > 0 ? (
              <ul className="destination__grid">
                {missions.map((mission) => (
                  <li key={mission.id}>
                    <MissionCard mission={mission} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="destination__empty">No missions in the archive for this destination yet.</p>
            )}
          </section>
        );
      })}

      <p className="explorer__voyager">
        Looking for the centrepiece? <Link to="/voyager">Follow Voyager 1</Link>.
      </p>
    </div>
  );
}
