(() => {
  gsap.registerPlugin(ScrollTrigger);

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduceMotion = () => reduceMotionQuery.matches;

  let lenis = null;
  if (!reduceMotion()) {
    lenis = new Lenis({
      lerp: CONFIG.scroll.lerp,
      wheelMultiplier: CONFIG.scroll.wheelMultiplier,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  window.__brewciLenis = lenis;

  const vh = (n) => `${n}vh`;

  function ensurePlaying(video) {
    if (!video) return;
    const tryPlay = () => video.play().catch(() => {});
    tryPlay();
    const retry = () => {
      tryPlay();
      window.removeEventListener('pointerdown', retry);
      window.removeEventListener('scroll', retry);
    };
    window.addEventListener('pointerdown', retry, { once: true });
    window.addEventListener('scroll', retry, { once: true, passive: true });
  }

  // ---------------------------------------------------------------- S1
  function initSceneBlast() {
    const section = document.getElementById('scene-blast');
    if (!section) return;
    const cfg = CONFIG.scenes.blast;
    const video = document.getElementById('hero-video');

    const logo = section.querySelector('.scene-blast__logo');
    gsap.set(logo, { xPercent: -50, yPercent: -50 });
    const chars = section.querySelectorAll('.headline__char');

    gsap.set(chars, { yPercent: 110, opacity: 0 });

    if (reduceMotion()) {
      video.pause();
      gsap.set(logo, { opacity: 0 });
      gsap.set(chars, { yPercent: 0, opacity: 1 });
      return;
    }

    ensurePlaying(video);

    gsap.matchMedia().add(
      {
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)',
      },
      (context) => {
        const { isDesktop } = context.conditions;

        if (isDesktop) {
          ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: '+=' + (cfg.vh - 100) + '%',
            pin: true,
            scrub: cfg.scrub,
            onUpdate: (self) => {
              const p = self.progress;

              if (p >= cfg.logoIntroAt) {
                const logoP = gsap.utils.clamp(0, 1, p / cfg.logoScaleOutAt);
                gsap.set(logo, { opacity: 1 - logoP, scale: 1 + logoP * 1.4 });
              }

              if (p >= cfg.headlineWipeAt) {
                const wipeP = gsap.utils.clamp(0, 1, (p - cfg.headlineWipeAt) / 0.15);
                chars.forEach((el, i) => {
                  const charP = gsap.utils.clamp(0, 1, wipeP * chars.length - i);
                  gsap.set(el, { yPercent: 110 * (1 - charP), opacity: charP });
                });
              }
            },
          });
        } else {
          gsap.set(chars, { yPercent: 0, opacity: 1 });
          gsap.set(logo, { opacity: 0 });
        }
      }
    );
  }

  // ---------------------------------------------------------------- S2
  function initScenePour() {
    const section = document.getElementById('scene-pour');
    if (!section) return;
    const cfg = CONFIG.scenes.pour;
    const video = document.getElementById('pour-video');

    if (reduceMotion()) {
      video.pause();
      return;
    }

    ensurePlaying(video);

    gsap.matchMedia().add(
      { isDesktop: '(min-width: 768px)', isMobile: '(max-width: 767px)' },
      (context) => {
        const { isDesktop } = context.conditions;
        if (isDesktop) {
          ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: '+=' + (cfg.vh - 100) + '%',
            pin: true,
            scrub: cfg.scrub,
          });
        }
      }
    );
  }

  // ---------------------------------------------------------------- S3
  // Exactly one item sits center-stage at a time. Each item pops in from its
  // own direction (2D only — no 3D/perspective, kept cheap and stable), and
  // colourful confetti pulses in from the sides when an item is centered.
  function initSceneTable() {
    const section = document.getElementById('scene-table');
    if (!section) return;
    const cfg = CONFIG.scenes.table;
    const items = Array.from(section.querySelectorAll('.showcase__item'));
    const confettiPieces = Array.from(section.querySelectorAll('.confetti__piece'));
    const N = items.length;
    const VISIBLE_RANGE = 0.65; // offset distance at which an item is fully hidden — >0.5 so neighbours briefly overlap instead of both hitting zero at once

    // Fixed travel direction per variant (px at full displacement, settle=1).
    const VARIANTS = {
      'from-left': { dx: -560, dy: 0, rot: 0 },
      'from-right': { dx: 560, dy: 0, rot: 0 },
      'from-top': { dx: 0, dy: -380, rot: 0 },
      'from-bottom': { dx: 0, dy: 380, rot: 0 },
      'from-top-left': { dx: -420, dy: -300, rot: -14 },
      'from-bottom-right': { dx: 420, dy: 300, rot: 14 },
      zoom: { dx: 0, dy: 0, rot: 0 },
      spin: { dx: 0, dy: 0, rot: 0 },
    };

    const placeItem = (el, offset) => {
      const variant = VARIANTS[el.dataset.variant] || VARIANTS['from-right'];
      const shadow = el.querySelector('.showcase__shadow');
      const abs = Math.min(Math.abs(offset), 1);
      const settle = gsap.utils.clamp(0, 1, abs / VISIBLE_RANGE);
      const opacity = gsap.utils.clamp(0, 1, 1 - abs / VISIBLE_RANGE);

      const state = {
        xPercent: -50,
        yPercent: -50,
        x: settle * variant.dx,
        y: settle * variant.dy,
        rotate: settle * variant.rot,
        scale: 1 - settle * 0.35,
      };

      if (el.dataset.variant === 'zoom') state.scale = 1 - settle * 0.85;
      if (el.dataset.variant === 'spin') {
        state.rotate = offset * -140;
        state.scale = 1 - settle * 0.5;
      }

      gsap.set(el, { ...state, opacity, zIndex: Math.round(100 - abs * 100) });
      if (shadow) gsap.set(shadow, { opacity });
    };

    const placeConfetti = (pulse) => {
      confettiPieces.forEach((piece) => {
        const side = piece.dataset.side === 'right' ? 1 : -1;
        const baseX = parseFloat(piece.dataset.x || 0);
        const baseY = parseFloat(piece.dataset.y || 0);
        gsap.set(piece, {
          x: baseX + side * (1 - pulse) * 120,
          y: baseY,
          rotate: pulse * 220 * side,
          scale: 0.5 + pulse * 0.7,
          opacity: gsap.utils.clamp(0, 1, pulse * 1.5 - 0.3),
        });
      });
    };

    if (reduceMotion()) {
      placeItem(items[0], 0);
      items.slice(1).forEach((el) => placeItem(el, 1));
      placeConfetti(0);
      return;
    }

    gsap.matchMedia().add(
      { isDesktop: '(min-width: 768px)', isMobile: '(max-width: 767px)' },
      (context) => {
        const { isDesktop } = context.conditions;

        if (isDesktop) {
          items.forEach((el, i) => placeItem(el, i));
          placeConfetti(1);

          ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: '+=' + (cfg.vh - 100) + '%',
            pin: true,
            scrub: cfg.scrub,
            onUpdate: (self) => {
              const p = self.progress;
              const continuous = p * (N - 1);
              items.forEach((el, i) => placeItem(el, i - continuous));

              const distToNearest = Math.abs(continuous - Math.round(continuous));
              placeConfetti(gsap.utils.clamp(0, 1, 1 - distToNearest / 0.35));
            },
          });
        } else {
          gsap.set(items, { opacity: 0, y: 40, x: 0, xPercent: 0, yPercent: 0, scale: 1, rotate: 0 });
          items.forEach((el) => gsap.set(el.querySelector('.showcase__shadow'), { opacity: 1 }));
          placeConfetti(0);

          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: CONFIG.easing.entrance,
            scrollTrigger: { trigger: section, start: 'top 70%' },
          });
        }
      }
    );
  }

  // ---------------------------------------------------------------- S4
  function initSceneCoffee() {
    const section = document.getElementById('scene-coffee');
    if (!section) return;
    const cfg = CONFIG.scenes.coffee;
    const texture = section.querySelector('.beans-texture-bg');
    const cards = section.querySelectorAll('.coffee-card');

    gsap.set(cards, { opacity: 0, y: 40 });

    if (reduceMotion()) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }

    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: cfg.cardStagger,
      ease: CONFIG.easing.entrance,
      scrollTrigger: { trigger: section, start: 'top 75%' },
    });

    if (texture) {
      gsap.to(texture, {
        yPercent: 15,
        ease: CONFIG.easing.linear,
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }

  // ---------------------------------------------------------------- S5
  function initSceneHours() {
    const section = document.getElementById('scene-hours');
    if (!section) return;
    const cfg = CONFIG.scenes.hours;
    const overlay = section.querySelector('.scene-hours__overlay');
    const content = section.querySelector('.scene-hours__content');

    updateOpenStatus();
    setInterval(updateOpenStatus, 60 * 1000);

    if (reduceMotion()) {
      gsap.set(overlay, { opacity: 1 });
      gsap.set(content, { opacity: 1 });
      section.classList.add('is-light');
      return;
    }

    ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;
        const mid = (cfg.inversionStart + cfg.inversionEnd) / 2;

        const overlayP = gsap.utils.clamp(
          0,
          1,
          (p - cfg.inversionStart) / (cfg.inversionEnd - cfg.inversionStart)
        );
        gsap.set(overlay, { opacity: overlayP });

        let contentOpacity;
        if (p < cfg.inversionStart) contentOpacity = 1;
        else if (p < mid) contentOpacity = 1 - gsap.utils.clamp(0, 1, (p - cfg.inversionStart) / (mid - cfg.inversionStart));
        else if (p < cfg.inversionEnd) contentOpacity = gsap.utils.clamp(0, 1, (p - mid) / (cfg.inversionEnd - mid));
        else contentOpacity = 1;
        gsap.set(content, { opacity: contentOpacity });

        section.classList.toggle('is-light', p >= mid);
      },
    });
  }

  function updateOpenStatus() {
    const el = document.getElementById('open-status');
    if (!el) return;
    const cfg = CONFIG.brand;
    const now = new Date();
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const pktMinutes = (utcMinutes + cfg.timezoneOffsetHours * 60) % (24 * 60);

    const isOpen = pktMinutes >= cfg.openMinute || pktMinutes < cfg.closeMinute;
    el.textContent = isOpen ? 'Open now · until 2:00 AM' : 'Closed · opens 8:00 AM';
    el.classList.toggle('is-open', isOpen);
    el.classList.toggle('is-closed', !isOpen);
  }

  // ---------------------------------------------------------------- S6
  function initSceneHost() {
    const section = document.getElementById('scene-host');
    if (!section) return;
    const cfg = CONFIG.scenes.host;
    const logo = section.querySelector('.scene-host__logo');
    const form = document.getElementById('event-form');
    const successEl = document.getElementById('form-success');
    const submitBtn = form.querySelector('button[type="submit"]');

    const fields = Array.from(form.querySelectorAll('[data-validate]'));

    gsap.set([logo, form], { opacity: 0, y: 30 });
    if (reduceMotion()) {
      gsap.set([logo, form], { opacity: 1, y: 0 });
    } else {
      gsap.to([logo, form], {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: cfg.formStagger,
        ease: CONFIG.easing.entrance,
        scrollTrigger: { trigger: section, start: 'top 75%' },
      });
    }

    function fieldMessage(field) {
      if (field.required && !field.value.trim()) {
        return 'This field is required.';
      }
      if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        return 'Enter a valid email address.';
      }
      if (field.type === 'number' && field.value && Number(field.value) < 1) {
        return 'Guest count must be at least 1.';
      }
      return '';
    }

    function showFieldError(field) {
      const message = fieldMessage(field);
      const errorEl = field.closest('.field').querySelector('.field__error');
      errorEl.textContent = message;
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      return !message;
    }

    function clearFieldError(field) {
      field.closest('.field').querySelector('.field__error').textContent = '';
      field.removeAttribute('aria-invalid');
    }

    function validateForm({ silent = true } = {}) {
      const allValid = fields.every((field) => !fieldMessage(field));
      submitBtn.disabled = !allValid;
      if (!silent) {
        fields.forEach(showFieldError);
      }
      return allValid;
    }

    fields.forEach((field) => {
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid')) showFieldError(field);
        else clearFieldError(field);
        validateForm();
      });
      field.addEventListener('blur', () => showFieldError(field));
    });

    validateForm();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm({ silent: false })) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      const endpoint = window.BREWCI_FORM_ENDPOINT || null;
      const payload = Object.fromEntries(new FormData(form).entries());

      try {
        if (endpoint) {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('Request failed');
        } else {
          // Stub: no BREWCI_FORM_ENDPOINT configured yet. See README for
          // where to plug in a real form service.
          console.info('[Brewci form stub] would submit:', payload);
        }
        form.hidden = true;
        successEl.hidden = false;
        successEl.focus();
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send inquiry';
        const errorBanner = form.querySelector('.form-error-banner');
        errorBanner.hidden = false;
        errorBanner.textContent =
          'Something went wrong sending this. Please email us directly at hello@brewci.pk in the meantime.';
      }
    });
  }

  // ---------------------------------------------------------------- boot
  function init() {
    initSceneBlast();
    initScenePour();
    initSceneTable();
    initSceneCoffee();
    initSceneHours();
    initSceneHost();

    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
