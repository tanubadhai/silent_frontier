import "./Starfield.css";

/**
 * Small seeded random number generator, so the starfield is identical on
 * every load and every render.
 */
function mulberry32(seed) {
  let a = seed;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateStars(count, seed) {
  const random = mulberry32(seed);

  return Array.from({ length: count }, (_, id) => {
    const sizeRoll = random();
    const toneRoll = random();

    return {
      id,
      x: random() * 100,
      y: random() * 100,
      size: sizeRoll < 0.72 ? 1 : sizeRoll < 0.94 ? 1.6 : 2.4,
      opacity: 0.25 + random() * 0.55,
      tone: toneRoll < 0.08 ? "yellow" : toneRoll < 0.28 ? "blue" : "white",
      twinkle: random() < 0.2,
      duration: 4 + random() * 6,
      delay: random() * 8,
    };
  });
}

// Generated once when the module loads, not on every render.
// The seed and the order of random calls are unchanged, so every star keeps
// the same position, size, brightness and twinkle timing as before.
const STARS = generateStars(160, 2026);

/**
 * Decorative, fixed background. Hidden from assistive technology and
 * non-interactive.
 *
 * Layer order, back to front: nebula glow, slowly drifting cloud, stars.
 * Everything above the stars on the page must stay translucent so the
 * stars remain visible. Motion is disabled under prefers-reduced-motion
 * (see Starfield.css).
 */
export default function Starfield() {
  return (
    <div className="starfield" aria-hidden="true">
      <div className="starfield__glow" />
      <div className="starfield__drift" />
      {STARS.map((star) => (
        <span
          key={star.id}
          className="star"
          data-tone={star.tone}
          data-twinkle={star.twinkle}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            "--star-opacity": star.opacity,
            "--twinkle-duration": `${star.duration}s`,
            "--twinkle-delay": `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
