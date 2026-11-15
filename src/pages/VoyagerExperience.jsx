import { Link } from "react-router-dom";
import MissionFigure from "../components/MissionFigure";
import Reveal from "../components/Reveal";
import {
  DirectVsInterpreted,
  EntityCards,
  InstrumentFocus,
  InstrumentList,
  Prose,
  StatusTable,
  Timeline,
} from "../components/story/StoryBlocks";
import useDocumentTitle from "../hooks/useDocumentTitle";
import content from "../data/missionContent.json";
import { getMissionById } from "../utils/missions";
import "./VoyagerExperience.css";

const voyager = content["voyager-1"];
const GOLDEN_RECORD = voyager.chapters.hardware.entities.find((entity) => /golden record/i.test(entity.name));
const HELIOPAUSE_EVIDENCE = voyager.inherited.evidence[1];

export default function VoyagerExperience() {
  useDocumentTitle("Voyager 1");
  const mission = getMissionById("voyager-1");

  return (
    <div className="voyager-page">
      <header className="voyager-page__hero container">
        <div>
          <p className="voyager-page__crumb">
            <Link to="/explorer">Explorer Atlas</Link>
          </p>
          <h1>Voyager 1</h1>
          <p className="voyager-page__tagline">{voyager.tagline}</p>
          <p className="voyager-page__dek">{voyager.dek}</p>
          <div className="voyager-page__actions">
            <Link to="/mission/voyager-1" className="button button--primary">
              Read the full mission story
            </Link>
            <a
              className="button button--ghost"
              href="https://voyager.jpl.nasa.gov/mission/status/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NASA’s live status
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
        <MissionFigure imageId="pia00452" priority />
      </header>

      <section className="voyager-section container" aria-labelledby="now-title">
        <Reveal as="header" className="voyager-section__header">
          <h2 id="now-title">Right now</h2>
          <p>
            Voyager 1 is still travelling and still transmitting. The mission data records it as{" "}
            {mission?.status?.mission_status?.toLowerCase() ?? "active"} with a spacecraft that is{" "}
            {mission?.status?.spacecraft_status?.toLowerCase() ?? "partially operational"}. Status below is as
            reported by NASA when this archive was written, and it changes. Check NASA’s page for today’s figures.
          </p>
        </Reveal>
        <StatusTable rows={voyager.chapters.afterlife.status} />
        <h3 className="voyager-section__sub">Instrument by instrument</h3>
        <InstrumentList instruments={voyager.chapters.science.instruments} />
      </section>

      <section className="voyager-section container" aria-labelledby="journey-title">
        <Reveal as="header" className="voyager-section__header">
          <h2 id="journey-title">The journey</h2>
          <p>From the 1977 launch to the milestones still being reached in 2026.</p>
        </Reveal>
        <div className="voyager-section__split">
          <Timeline items={voyager.chapters.journey.timeline} label="Voyager 1 timeline" />
          <div className="voyager-section__media">
            <MissionFigure imageId="pia00379" />
            <MissionFigure imageId="pia00451" />
          </div>
        </div>
      </section>

      <section className="voyager-section container" aria-labelledby="heliopause-title">
        <Reveal as="header" className="voyager-section__header">
          <h2 id="heliopause-title">Crossing the heliopause</h2>
          <p>{voyager.inherited.breakthrough}</p>
        </Reveal>
        <InstrumentFocus
          name={voyager.inherited.instrument.name}
          how={voyager.inherited.instrument.how}
          figure={voyager.inherited.instrument.figure}
        />
        <Prose paragraphs={[HELIOPAUSE_EVIDENCE]} />
        <DirectVsInterpreted items={voyager.inherited.directVsInterpreted} />
      </section>

      {GOLDEN_RECORD && (
        <section className="voyager-section container" aria-labelledby="record-title">
          <Reveal as="header" className="voyager-section__header">
            <h2 id="record-title">The Golden Record</h2>
            <p>A message carried on board, not a scientific instrument.</p>
          </Reveal>
          <div className="voyager-section__split">
            <EntityCards entities={[GOLDEN_RECORD]} />
            <MissionFigure imageId="voyager-golden-record" />
          </div>
        </section>
      )}

      <section className="voyager-page__closing container">
        <h2>The farthest thing we have made.</h2>
        <p>
          Two instruments are still listening. Every month of data from this one narrow line through interstellar
          space is irreplaceable.
        </p>
        <Link to="/mission/voyager-1" className="button button--primary">
          Read the science we inherited
        </Link>
      </section>
    </div>
  );
}
