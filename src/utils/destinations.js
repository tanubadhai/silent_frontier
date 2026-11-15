/**
 * Destination groups shared by the homepage and the Explorer.
 * The missions in each group are looked up in missions.json by matching the
 * `destinations` field, so mission data is never duplicated here.
 */
export const DESTINATIONS = [
  {
    kind: "moon",
    title: "The Moon",
    pattern: /moon/i,
    text: "Landers and experiment stations from the 1960s and 1970s remain on the lunar surface.",
  },
  {
    kind: "mars",
    title: "Mars",
    pattern: /^mars/i,
    text: "Rovers and landers have ended their missions on Mars and remain on the surface where they stopped.",
  },
  {
    kind: "belt",
    title: "The asteroid belt",
    pattern: /vesta|ceres|asteroid/i,
    text: "Dawn visited Vesta and Ceres, and remains in orbit around Ceres after its fuel ran out.",
  },
  {
    kind: "deep",
    title: "Deep space",
    pattern: /interstellar|outer solar system/i,
    text: "Voyager 1 is still travelling beyond the heliopause. Pioneer 10, on an escape trajectory, last made contact in 2003.",
  },
];
