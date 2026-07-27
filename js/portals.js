(() => {
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastTrigger = null;

  const openPortal = (portal, trigger) => {
    lastTrigger = trigger;
    const rect = trigger.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    portal.hidden = false;
    document.body.classList.add('portal-open');
    window.__brewciLenis?.stop();

    if (reduceMotion()) {
      portal.style.clipPath = 'none';
      portal.style.opacity = 1;
    } else {
      const proxy = { r: 0 };
      const maxR = Math.hypot(window.innerWidth, window.innerHeight);
      gsap.set(portal, { opacity: 1 });
      gsap.to(proxy, {
        r: maxR,
        duration: 0.7,
        ease: 'power2.out',
        onUpdate: () => {
          portal.style.clipPath = `circle(${proxy.r}px at ${originX}px ${originY}px)`;
        },
      });
    }

    const panel = portal.querySelector('.portal__panel');
    panel.scrollTop = 0;
    const closeBtn = portal.querySelector('[data-close-portal]');
    closeBtn.focus();
  };

  const closePortal = (portal) => {
    document.body.classList.remove('portal-open');
    window.__brewciLenis?.start();
    if (reduceMotion()) {
      portal.hidden = true;
    } else {
      gsap.to(portal, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          portal.hidden = true;
          portal.style.clipPath = '';
        },
      });
    }
    if (lastTrigger) lastTrigger.focus();
  };

  document.querySelectorAll('[data-portal]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const portal = document.getElementById(trigger.dataset.portal);
      if (portal) openPortal(portal, trigger);
    });
  });

  document.querySelectorAll('.portal').forEach((portal) => {
    portal.querySelector('[data-close-portal]')?.addEventListener('click', () => closePortal(portal));
    portal.addEventListener('click', (e) => {
      if (e.target === portal) closePortal(portal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.portal:not([hidden])').forEach((portal) => closePortal(portal));
  });
})();
