import DiscoveryExplorer from "../components/intelligence/DiscoveryExplorer";
import ConnectionMap from "../components/intelligence/ConnectionMap";
import EvidenceMap from "../components/intelligence/EvidenceMap";
import InstrumentExplorer from "../components/intelligence/InstrumentExplorer";
import MissionCompare from "../components/intelligence/MissionCompare";
import MissionTimeline from "../components/intelligence/MissionTimeline";
import Reveal from "../components/Reveal";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { METHOD_NOTE } from "../utils/intelligence";
import "../components/intelligence/intelligence.css";
import "./Intelligence.css";

const SECTIONS = [
  {
    id: "findings",
    title: "Discovery explorer",
    blurb: "Every documented finding across the eight missions, grouped by scientific subject.",
    body: <DiscoveryExplorer />,
  },
  {
    id: "evidence",
    title: "From instrument to insight",
    blurb: "Pick a mission and follow each finding back to the instruments that made it possible.",
    body: <EvidenceMap />,
  },
  {
    id: "compare",
    title: "Compare missions",
    blurb: "Objectives, instruments, findings, contribution and long-term influence, side by side.",
    body: <MissionCompare />,
  },
  {
    id: "instruments",
    title: "Instrument intelligence",
    blurb: "What each instrument measured, how it worked and where observation ends and interpretation begins.",
    body: <InstrumentExplorer />,
  },
  {
    id: "connections",
    title: "Discovery connections",
    blurb: "How one mission’s work reached the next, only where a link is documented.",
    body: <ConnectionMap />,
  },
  {
    id: "timeline",
    title: "Mission timeline",
    blurb: "When each mission flew and when it fell silent, from the dates in the mission data.",
    body: <MissionTimeline />,
  },
];

const LIMITS = [
  "The subject groups, instrument categories and connections are editorial choices by the STARSTUFF team. Every sentence of evidence shown is quoted from the mission data or the mission stories. Nothing on this page adds a new measurement.",
  "Dots, lists and counts show what this archive documents. They are not rankings, and there is no score for importance.",
  "A missing line on the connection map means no link is documented here. It does not mean there was no influence. Dawn, for example, has no documented link to the other seven missions in this archive.",
  "Two of the four connections rely on statements in the mission stories that still need checking against a NASA page. They are drawn dashed and labelled.",
  "Two findings, Titan’s atmosphere and Vesta’s composition, are not tied to a named instrument because the stories do not name one.",
  "There are no charts comparing distances, data volumes or costs across missions, because the archive has no sourced, like-for-like values to plot.",
  "Instrument and spacecraft statuses are as written in the mission stories. They can change, most of all for Voyager 1.",
];

export default function Intelligence() {
  useDocumentTitle("Mission intelligence");

  return (
    <div className="intelligence">
      <Reveal as="header" className="intelligence__hero container">
        <h1>Mission intelligence</h1>
        <p className="intelligence__lead">
          What eight missions discovered, how the evidence was gathered, and how the work of one mission reached
          the next.
        </p>
        <nav className="intelligence__nav" aria-label="On this page">
          <ul>
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
            <li>
              <a href="#limits">What this page does not claim</a>
            </li>
          </ul>
        </nav>
        <p className="intelligence__method">{METHOD_NOTE}</p>
      </Reveal>

      <div className="container">
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="intel-section" aria-labelledby={`${section.id}-title`}>
            <Reveal as="header" className="intel-section__header">
              <h2 id={`${section.id}-title`}>{section.title}</h2>
              <p>{section.blurb}</p>
            </Reveal>
            <Reveal amount={0.05} y={24}>
              {section.body}
            </Reveal>
          </section>
        ))}

        <section id="limits" className="intel-section intel-section--limits" aria-labelledby="limits-title">
          <header className="intel-section__header">
            <h2 id="limits-title">What this page does not claim</h2>
            <p>Where the data stops, so nothing here is mistaken for more than it is.</p>
          </header>
          <ul className="limits">
            {LIMITS.map((text) => (
              <li key={text.slice(0, 40)}>{text}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
