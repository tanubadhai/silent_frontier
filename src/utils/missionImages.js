import manifest from "../data/missionImages.json";

/** Every image in the manifest, keyed by id. See src/data/missionImages.json. */
export const IMAGES = manifest.images;

export function getImage(id) {
  return IMAGES[id] ?? null;
}

/** Public URL of an image file. Respects Vite's `base` option. */
export function imageSrc(image) {
  if (!image?.file) return null;
  return `${import.meta.env.BASE_URL}${manifest.basePath.replace(/^\//, "")}/${image.file}`;
}

/** The image used on mission cards and as the hero of a mission story. */
export function missionCardImage(missionId) {
  const entry = manifest.missions[missionId];
  return entry ? getImage(entry.card) : null;
}

/** Image for a destination tile: "moon", "mars", "belt" or "deep". */
export function destinationImage(kind) {
  const entry = manifest.destinations[kind];
  return entry ? getImage(entry.image) : null;
}

const TYPE_LABELS = {
  photograph: "Photograph",
  "processed image": "Processed image",
  mosaic: "Mosaic",
  diagram: "Diagram",
  "artist concept": "Artist’s concept",
};

export function typeLabel(type) {
  return TYPE_LABELS[type] ?? "Image";
}
