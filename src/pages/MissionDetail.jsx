import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import MissionFigure from "../components/MissionFigure";
import Reveal from "../components/Reveal";
import StatusChip from "../components/StatusChip";
import {
  BeforeAfter,
  ByTheNumbers,
  DirectVsInterpreted,
  DiscoverySpotlight,
  EntityCards,
  FactList,
  InstrumentFocus,
  InstrumentList,
  Prose,
  RippleEffect,
  StatusTable,
  Timeline,
  Unanswered,
} from "../components/story/StoryBlocks";
import useDocumentTitle from "../hooks/useDocumentTitle";
import content from "../data/missionContent.json";
import { ALL_MISSIONS, formatDate, getMissionById, joinList } from "../utils/missions";
import { missionCardImage } from "../utils/missionImages";
import { dedupeStoryFigures } from "../utils/story";
import "./MissionDetail.css";

const CHAPTERS = [
  { id: "beginning", title: "The Beginning", blurb: "Purpose, context, design and launch" },
  { id: "journey", title: "The Journey", blurb: "Route, milestones and encounters" },
  { id: "science", title: "The Science", blurb: "Instruments and experiments" },
  { id: "hardware", title: "The Hardware", blurb: "What was built, and what is left" },
  { id: "afterlife", title: "The Afterlife", blurb: "Final contact, status and what remains" },
  { id: "legacy", title: "The Legacy", blurb: "What changed because of it" },
  { id: "inherited", title: "The Science We Inherited", blurb: "What we learned, and why it matters" },
];

function Chapter({ id, title, blurb, children, media }) {
  return (
    <section id={id} className="chapter" aria-labelledby={`${id}-title`}>
      <Reveal as="header" className="chapter__header">
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{blurb}</p>
      </Reveal>
      <div className={`chapter__body${media?.length ? " chapter__body--with-media" : ""}`}>
        <Reveal className="chapter__main" amount={0.05} y={24}>
          {children}
        </Reveal>
        {media?.length > 0 && (
          <div className="chapter__media">
            {media.map((imageId, index) => (
              <Reveal key={imageId} amount={0.1} delay={0.1 + index * 0.12}>
                <MissionFigure imageId={imageId} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SubHeading({ children }) {
  return <h3 className="sub-heading">{children}</h3>;
}

function Inherited({ data }) {
  return (
    <div className="inherited">
      <div className="inherited__step">
        <SubHeading>Before</SubHeading>
        <Prose paragraphs={[data.before]} />
        <BeforeAfter before={data.beforeAfter.before} after={data.beforeAfter.after} />
      </div>

      <div className="inherited__step">
        <SubHeading>The instrument</SubHeading>
        <InstrumentFocus name={data.instrument.name} how={data.instrument.how} figure={data.instrument.figure} />
      </div>

      <div className="inherited__step">
        <SubHeading>The evidence</SubHeading>
        <ul className="evidence-list">
          {data.evidence.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      <div className="inherited__step">
        <DiscoverySpotlight {...data.spotlight} />
      </div>

      <div className="inherited__step">
        <SubHeading>The breakthrough</SubHeading>
        <p className="breakthrough">{data.breakthrough}</p>
        <DirectVsInterpreted items={data.directVsInterpreted} />
      </div>

      <div className="inherited__step">
        <SubHeading>By the numbers</SubHeading>
        <ByTheNumbers numbers={data.numbers} />
        <p className="inherited__note">
          Numbers are quoted from the sources shown, as published. Check NASA for current figures.
        </p>
      </div>

      <div className="inherited__step">
        <SubHeading>The legacy</SubHeading>
        <Prose paragraphs={[data.legacy, data.technology]} />
        <h4 className="ripple-heading">Ripple effect</h4>
        <RippleEffect items={data.ripple} />
      </div>

      <Unanswered {...data.unanswered} />
    </div>
  );
}

export default function MissionDetail() {
  const { id } = useParams();
  const mission = getMissionById(id);
  const rawStory = content[id];

  useDocumentTitle(mission?.name ?? "Mission not found");

  // Links such as /mission/insight#inherited should land on that chapter.
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash, id]);

  if (!mission || !rawStory) {
    return (
      <section className="container mission-missing">
        <h1>Mission not found</h1>
        <p>There is no mission story for this address.</p>
        <Link to="/explorer" className="button button--primary">
          Browse the Explorer Atlas
        </Link>
      </section>
    );
  }

  const heroImageId = missionCardImage(mission.id)?.id;
  const story = dedupeStoryFigures(rawStory, heroImageId ? [heroImageId] : []);
  const { chapters } = story;
  const launch = formatDate(mission.timeline?.launch_date);
  const index = ALL_MISSIONS.findIndex((item) => item.id === mission.id);
  const previous = ALL_MISSIONS[(index - 1 + ALL_MISSIONS.length) % ALL_MISSIONS.length];
  const next = ALL_MISSIONS[(index + 1) % ALL_MISSIONS.length];

  return (
    <article className="mission-story">
      <header className="story-hero container">
        <Reveal className="story-hero__text">
          <p className="story-hero__crumb">
            <Link to="/explorer">Explorer Atlas</Link>
            {mission.mission_category && <span> / {mission.mission_category}</span>}
          </p>
          <h1>{mission.name}</h1>
          <p className="story-hero__tagline">{story.tagline}</p>
          <p className="story-hero__dek">{story.dek}</p>

          <dl className="story-hero__status">
            {mission.status?.mission_status && (
              <div>
                <dt>Mission</dt>
                <dd>
                  <StatusChip label={mission.status.mission_status} />
                </dd>
              </div>
            )}
            {mission.status?.spacecraft_status && (
              <div>
                <dt>Spacecraft</dt>
                <dd>
                  <StatusChip label={mission.status.spacecraft_status} />
                </dd>
              </div>
            )}
            {launch && (
              <div>
                <dt>Launched</dt>
                <dd>{launch}</dd>
              </div>
            )}
            {mission.destinations?.length > 0 && (
              <div>
                <dt>Destination</dt>
                <dd>{joinList(mission.destinations)}</dd>
              </div>
            )}
            {mission.agency?.length > 0 && (
              <div>
                <dt>Agencies</dt>
                <dd>{joinList(mission.agency)}</dd>
              </div>
            )}
          </dl>
          {mission.status?.description && <p className="story-hero__note">{mission.status.description}</p>}
        </Reveal>

        {heroImageId && (
          <Reveal className="story-hero__figure" delay={0.2}>
            <MissionFigure imageId={heroImageId} priority />
          </Reveal>
        )}
      </header>

      <nav className="chapter-nav" aria-label="Story chapters">
        <ul className="container">
          {CHAPTERS.map((chapter) => (
            <li key={chapter.id}>
              <a href={`#${chapter.id}`}>{chapter.title}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container chapters">
        <Chapter {...CHAPTERS[0]} media={chapters.beginning.figures}>
          <Prose paragraphs={chapters.beginning.paragraphs} />
          <FactList facts={chapters.beginning.facts} />
        </Chapter>

        <Chapter {...CHAPTERS[1]} media={chapters.journey.figures}>
          <Prose paragraphs={chapters.journey.paragraphs} />
          <Timeline items={chapters.journey.timeline} label={`${mission.name} timeline`} />
        </Chapter>

        <Chapter {...CHAPTERS[2]} media={chapters.science.figures}>
          <Prose paragraphs={chapters.science.paragraphs} />
          <InstrumentList instruments={chapters.science.instruments} />
        </Chapter>

        <Chapter {...CHAPTERS[3]} media={chapters.hardware.figures}>
          <Prose paragraphs={chapters.hardware.paragraphs} />
          <EntityCards entities={chapters.hardware.entities} />
        </Chapter>

        <Chapter {...CHAPTERS[4]} media={chapters.afterlife.figures}>
          <Prose paragraphs={chapters.afterlife.paragraphs} />
          <StatusTable rows={chapters.afterlife.status} />
        </Chapter>

        <Chapter {...CHAPTERS[5]}>
          <Prose paragraphs={chapters.legacy.paragraphs} />
        </Chapter>

        <Chapter {...CHAPTERS[6]}>
          <Inherited data={story.inherited} />
        </Chapter>

        <section className="chapter sources" aria-labelledby="sources-title">
          <header className="chapter__header">
            <h2 id="sources-title">Sources</h2>
            <p>Official NASA sources behind this story. Images are credited under each picture.</p>
          </header>
          <ul className="sources__list">
            {story.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.label}
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <nav className="story-pager" aria-label="Other mission stories">
          <Link to={`/mission/${previous.id}`}>
            <span>Previous mission</span>
            {previous.name}
          </Link>
          <Link to={`/mission/${next.id}`} className="story-pager__next">
            <span>Next mission</span>
            {next.name}
          </Link>
        </nav>
      </div>
    </article>
  );
}
