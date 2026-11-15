import { useState } from "react";
import { ImageOff } from "lucide-react";
import { imageSrc, typeLabel } from "../utils/missionImages";
import "./ImageFrame.css";

/**
 * A fixed-aspect box for one NASA image from the manifest.
 * - The aspect ratio is reserved up front, so nothing jumps when the image loads.
 * - Images are lazy-loaded unless `priority` is set (use it for the first image on a page).
 * - If the file is missing, a clearly labelled panel links to the NASA source
 *   page. A stand-in picture is never drawn.
 * `aspect` and `fit` override the manifest values for a specific use (cards).
 */
export default function ImageFrame({ image, priority = false, aspect, fit }) {
  const [failedId, setFailedId] = useState(null);
  if (!image) return null;

  const failed = failedId === image.id;

  return (
    <div
      className="image-frame"
      style={{ aspectRatio: aspect ?? image.aspect }}
      data-fit={fit ?? image.fit}
    >
      {failed ? (
        <div className="image-frame__fallback">
          <ImageOff aria-hidden="true" />
          <p>NASA image not added yet</p>
          <p className="image-frame__fallback-title">
            {image.title} ({typeLabel(image.type)})
          </p>
          {image.sourcePage && (
            <a href={image.sourcePage} target="_blank" rel="noopener noreferrer">
              Open the NASA source page
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      ) : (
        <img
          src={imageSrc(image)}
          alt={image.alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          style={{ objectPosition: image.position }}
          onError={() => setFailedId(image.id)}
        />
      )}
    </div>
  );
}
