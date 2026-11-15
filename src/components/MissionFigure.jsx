import { getImage, typeLabel } from "../utils/missionImages";
import ImageFrame from "./ImageFrame";
import "./MissionFigure.css";

/**
 * A NASA image with its caption, image type, credit, NASA ID and a link to
 * the original source page. Artist concepts get a visible warning so they
 * are never mistaken for photographs.
 */
export default function MissionFigure({ imageId, priority = false, aspect, fit, compact = false }) {
  const image = getImage(imageId);

  if (!image) {
    if (import.meta.env.DEV) console.warn(`MissionFigure: no image "${imageId}" in missionImages.json`);
    return null;
  }

  const isConcept = image.type === "artist concept";

  return (
    <figure className={`mission-figure${compact ? " mission-figure--compact" : ""}`}>
      <ImageFrame image={image} priority={priority} aspect={aspect} fit={fit} />
      <figcaption>
        <p className="mission-figure__title">
          <span className="mission-figure__type" data-type={image.type}>
            {typeLabel(image.type)}
          </span>
          {image.title}
        </p>
        {!compact && <p className="mission-figure__caption">{image.caption}</p>}
        {isConcept && (
          <p className="mission-figure__warning">
            This is an artist’s concept. It is an illustration, not a photograph.
          </p>
        )}
        <p className="mission-figure__credit">
          Credit: {image.credit}
          {image.nasaId && <> · NASA ID {image.nasaId}</>}
          {image.sourcePage && (
            <>
              {" · "}
              <a href={image.sourcePage} target="_blank" rel="noopener noreferrer">
                Source
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </>
          )}
        </p>
      </figcaption>
    </figure>
  );
}
