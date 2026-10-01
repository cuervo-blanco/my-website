let enginePromise;

// Load the decorative canvas separately from the initial page and only once.
export function getHeroStarEngine() {
  enginePromise ||= Promise.all([
    import("@tsparticles/engine"),
    import("@tsparticles/basic"),
    import("@tsparticles/shape-star"),
  ]).then(async ([{ tsParticles }, { loadBasic }, { loadStarShape }]) => {
    await loadBasic(tsParticles);
    await loadStarShape(tsParticles);
    return tsParticles;
  });
  return enginePromise;
}
