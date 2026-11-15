/**
 * Removes repeated pictures from a mission story, so each image appears once,
 * in the first place it is used. `seed` lists images already on the page
 * (for example the hero image).
 */
export function dedupeStoryFigures(story, seed = []) {
  const used = new Set(seed);
  const take = (id) => {
    if (!id || used.has(id)) return null;
    used.add(id);
    return id;
  };

  const chapters = {};
  for (const key of ["beginning", "journey", "science", "hardware", "afterlife", "legacy"]) {
    const chapter = story.chapters[key];
    chapters[key] = { ...chapter, figures: (chapter.figures ?? []).map(take).filter(Boolean) };
  }

  const inherited = {
    ...story.inherited,
    instrument: { ...story.inherited.instrument, figure: take(story.inherited.instrument.figure) },
    spotlight: { ...story.inherited.spotlight, figure: take(story.inherited.spotlight.figure) },
  };

  return { ...story, chapters, inherited };
}
