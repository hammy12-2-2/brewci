/*
 * All tunable scroll/motion timings live here. Nothing else in the codebase
 * should hardcode a vh, scrub, or duration value for a scene.
 */
const CONFIG = {
  scroll: {
    lerp: 0.1,
    wheelMultiplier: 1,
  },
  scenes: {
    blast: {
      vh: 200,
      scrub: 1,
      pinned: true,
      logoIntroAt: 0,
      logoScaleOutAt: 0.12,
      headlineWipeAt: 0.35,
    },
    pour: {
      vh: 170,
      scrub: 1,
      pinned: true,
    },
    table: {
      vh: 560,
      scrub: 1,
      pinned: true,
    },
    coffee: {
      vh: 80,
      pinned: false,
      textureParallaxSpeed: 0.3,
      cardStagger: 0.08,
    },
    hours: {
      vh: 70,
      pinned: false,
      inversionStart: 0.1,
      inversionEnd: 0.6,
    },
    host: {
      vh: 100,
      pinned: false,
      formStagger: 0.06,
    },
  },
  easing: {
    entrance: 'power2.out',
    scrubbed: 'power2.inOut',
    linear: 'none',
  },
  brand: {
    timezoneOffsetHours: 5, // Pakistan Standard Time, UTC+5, no DST
    openMinute: 8 * 60, // 8:00 AM
    closeMinute: 2 * 60, // 2:00 AM (next day)
  },
};
