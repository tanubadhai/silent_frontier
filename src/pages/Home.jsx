import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Radio, Star } from "lucide-react";
import ImageFrame from "../components/ImageFrame";
import MissionCard from "../components/MissionCard";
import MissionFigure from "../components/MissionFigure";
import Reveal from "../components/Reveal";
import StatusChip from "../components/StatusChip";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { DESTINATIONS } from "../utils/destinations";
import { destinationImage } from "../utils/missionImages";
import {
  ALL_MISSIONS,
  formatDate,
  getMissionById,
  getMissionsByDestination,
  joinList,
  shortName,
} from "../utils/missions";
import "./Home.css";

const FEATURED_ID = "voyager-1";

/** Missions shown in "Explore the archive". Ids that do not exist are skipped. */
const ARCHIVE_PREVIEW_IDS = ["alsep", "surveyor-3", "sojourner", "opportunity", "dawn", "pioneer-10"];
const ARCHIVE_PREVIEW_COUNT = 6;

function pickArchiveMissions() {
  const picked = ARCHIVE_PREVIEW_IDS.map(getMissionById).filter(Boolean);
  if (picked.length >= ARCHIVE_PREVIEW_COUNT) return picked.slice(0, ARCHIVE_PREVIEW_COUNT);

  // If some ids are missing from the data, fill the gap with other missions.
  const used = new Set(picked.map((mission) => mission.id));
  const filler = ALL_MISSIONS.filter((mission) => !used.has(mission.id) && mission.id !== FEATURED_ID);
  return [...picked, ...filler].slice(0, ARCHIVE_PREVIEW_COUNT);
}

const ARCHIVE_MISSIONS = pickArchiveMissions();

/* ---- 1. Hero ---------------------------------------------------------------- */

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

function HeroOrbits() {
  return (
    <div className="hero__orbits" aria-hidden="true">
      <svg viewBox="0 0 800 800">
        <g transform="rotate(-18 400 400)" fill="none">
          <ellipse className="hero__orbit hero__orbit--outer" cx="400" cy="400" rx="380" ry="150" />
          <ellipse className="hero__orbit hero__orbit--middle" cx="400" cy="400" rx="300" ry="118" />
          <ellipse className="hero__orbit hero__orbit--inner" cx="400" cy="400" rx="220" ry="86" />
          <circle cx="780" cy="400" r="3.5" fill="var(--color-gold)" />
          <circle cx="180" cy="400" r="3" fill="var(--color-blue)" />
        </g>
      </svg>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroOrbits />
      <div className="hero__horizon" aria-hidden="true" />

      <motion.div
        className="hero__content container"
        variants={heroContainer}
        initial="hidden"
        animate="show"
      >
        <motion.h1 id="hero-title" className="hero__title" variants={heroItem}>
          The Silent Frontier
        </motion.h1>
        <motion.p className="hero__lead" variants={heroItem}>
          An interactive archive of humanity’s machines left across the Solar System and beyond.
          Follow their journeys, their discoveries and the legacies they left behind.
        </motion.p>
        <motion.div className="hero__actions" variants={heroItem}>
          <Link to="/explorer" className="button button--primary">
            <Compass aria-hidden="true" />
            Explore the Atlas
          </Link>
          <Link to="/voyager" className="button button--ghost">
            <Radio aria-hidden="true" />
            Meet Voyager 1
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ---- 2. Featured mission: Voyager 1 ----------------------------------------- */

function VoyagerFeature() {
  const voyager = getMissionById(FEATURED_ID);
  if (!voyager) return null;

  const launch = formatDate(voyager.timeline?.launch_date);
  const planets = (voyager.destinations ?? []).filter((place) => !/interstellar/i.test(place));
  const milestone = voyager.science?.discoveries?.find((item) =>
    /heliopause/i.test(item?.description ?? ""),
  );
  const craft = voyager.hardware_entities?.find((item) => /spacecraft/i.test(item?.type ?? ""));
  const record = voyager.hardware_entities?.find((item) => /golden record/i.test(item?.item_name ?? ""));

  const lead =
    launch && planets.length > 0
      ? `${voyager.name} launched on ${launch} to study ${joinList(planets)}. It never turned back.`
      : `${voyager.name} is humanity’s farthest-travelling spacecraft.`;

  return (
    <section className="home-section" aria-labelledby="voyager-title">
      <div className="container">
        <Reveal className="voyager" amount={0.1}>
          <div className="voyager__text">
            <p className="voyager__tag">
              <Star aria-hidden="true" />
              Featured mission
            </p>
            <h2 id="voyager-title">Beyond the heliopause</h2>
            <p className="voyager__lead">{lead}</p>

            {milestone && (
              <blockquote className="voyager__milestone">
                <p>{milestone.description}</p>
                {milestone.source_url && (
                  <footer>
                    <a href={milestone.source_url} target="_blank" rel="noopener noreferrer">
                      Source: NASA
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  </footer>
                )}
              </blockquote>
            )}

            <dl className="voyager__status">
              {voyager.status?.mission_status && (
                <div>
                  <dt>Mission</dt>
                  <dd>
                    <StatusChip label={voyager.status.mission_status} />
                  </dd>
                </div>
              )}
              {voyager.status?.spacecraft_status && (
                <div>
                  <dt>Spacecraft</dt>
                  <dd>
                    <StatusChip label={voyager.status.spacecraft_status} />
                  </dd>
                </div>
              )}
              {craft?.location && (
                <div className="voyager__status-wide">
                  <dt>Location</dt>
                  <dd>{craft.location}</dd>
                </div>
              )}
              {record?.item_name && (
                <div className="voyager__status-wide">
                  <dt>Carrying</dt>
                  <dd>{record.item_name}</dd>
                </div>
              )}
            </dl>

            {voyager.status?.description && (
              <p className="voyager__note">{voyager.status.description}</p>
            )}

            <div className="voyager__actions">
              <Link to="/voyager" className="button button--primary">
                <Radio aria-hidden="true" />
                Follow Voyager 1’s journey
              </Link>
              <Link to={`/mission/${voyager.id}`} className="button button--ghost">
                Read the mission story
              </Link>
            </div>
          </div>

          <div className="voyager__visual">
            <MissionFigure imageId="pia00452" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---- 3. The abandoned frontier ---------------------------------------------- */

function Frontier() {
  return (
    <section className="home-section" aria-labelledby="frontier-title">
      <div className="container">
        <Reveal className="section-heading">
          <h2 id="frontier-title">The abandoned frontier</h2>
          <p>
            Humanity has left machines in many places: on the Moon, on Mars, among the asteroids and
            in the space between the stars. Some have fallen silent and others are still sending
            signals, but every one of them is still out there.
          </p>
        </Reveal>

        <ul className="frontier-grid">
          {DESTINATIONS.map((destination, index) => {
            const missions = getMissionsByDestination(destination.pattern);
            const image = destinationImage(destination.kind);

            return (
              <Reveal as="li" key={destination.kind} delay={(index % 3) * 0.1}>
              <div className="frontier-card">
                {image && (
                  <div className="frontier-card__media">
                    <ImageFrame image={image} aspect="3 / 2" />
                    <p className="frontier-card__credit">
                      {image.title}. Credit: {image.credit}
                    </p>
                  </div>
                )}
                <div className="frontier-card__body">
                  <h3>{destination.title}</h3>
                  <p>{destination.text}</p>
                  {missions.length > 0 && (
                    <ul
                      className="frontier-card__missions"
                      aria-label={`Missions in the archive: ${destination.title}`}
                    >
                      {missions.map((mission) => (
                        <li key={mission.id}>
                          <Link to={`/mission/${mission.id}`}>{shortName(mission.name)}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ---- 4. Explore the archive ------------------------------------------------- */

function Archive() {
  if (ARCHIVE_MISSIONS.length === 0) return null;

  return (
    <section className="home-section" aria-labelledby="archive-title">
      <div className="container">
        <Reveal className="section-heading">
          <h2 id="archive-title">Explore the archive</h2>
          <p>
            Every mission has its own story: why it flew, what it found and what became of it. Start
            with one of these.
          </p>
        </Reveal>

        <ul className="archive-grid">
          {ARCHIVE_MISSIONS.map((mission, index) => (
            <Reveal as="li" key={mission.id} delay={(index % 3) * 0.1}>
              <MissionCard mission={mission} />
            </Reveal>
          ))}
        </ul>

        <div className="archive-more">
          <Link to="/explorer" className="button button--ghost">
            <Compass aria-hidden="true" />
            Browse everything in the Atlas
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---- 5. Closing ------------------------------------------------------------- */

function Closing() {
  return (
    <section className="closing" aria-labelledby="closing-title">
      <div className="container closing__inner">
        <h2 id="closing-title">Every one of them was a question we sent into the dark.</h2>
        <p>
          Some are still travelling and some rest where they stopped. Together they are humanity’s
          record of looking outward.
        </p>
        <Link to="/explorer" className="button button--primary">
          <Compass aria-hidden="true" />
          Explore the archive
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  useDocumentTitle();

  return (
    <div className="home">
      <Hero />
      <VoyagerFeature />
      <Frontier />
      <Archive />
      <Closing />
    </div>
  );
}
