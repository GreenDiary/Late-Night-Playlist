(() => {
  const heading = document.querySelector('#site-title.hero-kinetic');
  const lines = heading ? [...heading.querySelectorAll('.hero-kinetic__line')] : [];
  const hero = heading?.closest('.hero');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  if (!heading || lines.length !== 2 || motionPreference.matches || !finePointer.matches) return;

  const textSegmenter = typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;
  const glyphs = [];
  const influenceRadius = 132;
  const influenceRadiusSquared = influenceRadius * influenceRadius;
  const baseWeight = 400;
  const weightRange = 165;
  let pointerX = 0;
  let pointerY = 0;
  let pointerActive = false;
  let animationFrame = 0;
  let measurementFrame = 0;
  let freezeWidthsOnMeasure = false;
  let lastFrameTime = 0;
  let attached = false;
  const heroLayoutObserver = hero && typeof MutationObserver === 'function'
    ? new MutationObserver(() => scheduleMeasurement(true))
    : null;

  function appendGlyphs(textNode) {
    const value = textNode.nodeValue;
    const parts = textSegmenter
      ? [...textSegmenter.segment(value)].map((part) => part.segment)
      : Array.from(value);
    const fragment = document.createDocumentFragment();
    let word = null;

    for (const part of parts) {
      if (/^\s+$/u.test(part)) {
        fragment.append(document.createTextNode(part));
        word = null;
        continue;
      }

      if (!word) {
        word = document.createElement('span');
        word.className = 'hero-kinetic__word';
        fragment.append(word);
      }

      const glyph = document.createElement('span');
      glyph.className = 'hero-kinetic__glyph';
      glyph.textContent = part;
      word.append(glyph);
      glyphs.push({
        element: glyph,
        x: 0,
        y: 0,
        weight: baseWeight,
        scaleX: 1,
        scaleY: 1,
        offsetY: 0
      });
    }

    textNode.replaceWith(fragment);
  }

  function wrapText(parent) {
    for (const child of [...parent.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (child.nodeValue) appendGlyphs(child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        wrapText(child);
      }
    }
  }

  for (const line of lines) wrapText(line);
  if (glyphs.length === 0) return;

  function measureGeometry(freezeWidths = false) {
    measurementFrame = 0;
    const widths = freezeWidths ? new Float32Array(glyphs.length) : null;

    if (freezeWidths) {
      for (const glyph of glyphs) glyph.element.style.removeProperty('width');
    }

    for (let i = 0; i < glyphs.length; i += 1) {
      const glyph = glyphs[i];
      const rect = glyph.element.getBoundingClientRect();
      glyph.x = rect.left + rect.width / 2;
      glyph.y = rect.top + rect.height / 2;
      if (widths) widths[i] = rect.width;
    }

    if (widths) {
      for (let i = 0; i < glyphs.length; i += 1) {
        glyphs[i].element.style.width = `${widths[i]}px`;
      }
    }

    if (pointerActive) scheduleAnimation();
  }

  function scheduleMeasurement(freezeWidths = false) {
    freezeWidthsOnMeasure ||= freezeWidths;
    if (measurementFrame) return;
    measurementFrame = requestAnimationFrame(() => {
      const shouldFreezeWidths = freezeWidthsOnMeasure;
      freezeWidthsOnMeasure = false;
      measureGeometry(shouldFreezeWidths);
    });
  }

  function writeGlyph(glyph) {
    glyph.element.style.setProperty('--hero-glyph-weight', glyph.weight.toFixed(1));
    glyph.element.style.setProperty('--hero-glyph-scale-x', glyph.scaleX.toFixed(3));
    glyph.element.style.setProperty('--hero-glyph-scale-y', glyph.scaleY.toFixed(3));
    glyph.element.style.setProperty('--hero-glyph-offset-y', `${glyph.offsetY.toFixed(2)}px`);
  }

  function animate(time) {
    animationFrame = 0;
    const deltaTime = lastFrameTime ? Math.min(64, time - lastFrameTime) : 16.7;
    lastFrameTime = time;
    const blend = 1 - Math.exp(-deltaTime / 68);
    let unsettled = false;

    for (const glyph of glyphs) {
      const dx = glyph.x - pointerX;
      const dy = glyph.y - pointerY;
      const distanceSquared = dx * dx + dy * dy;
      let proximity = 0;
      let normalizedDistance = 1;

      if (pointerActive && distanceSquared < influenceRadiusSquared) {
        normalizedDistance = Math.sqrt(distanceSquared) / influenceRadius;
        const falloff = 1 - normalizedDistance;
        proximity = falloff * falloff * (3 - 2 * falloff);
      }

      const weightWave = Math.cos(normalizedDistance * Math.PI * 0.72);
      const widthWave = Math.sin(dx / influenceRadius * Math.PI);
      const targetWeight = baseWeight + weightRange * proximity * weightWave;
      const targetScaleX = 1 + 0.055 * proximity * widthWave;
      const targetScaleY = 1 + 0.014 * proximity;
      const targetOffsetY = -1.8 * proximity * widthWave;

      glyph.weight += (targetWeight - glyph.weight) * blend;
      glyph.scaleX += (targetScaleX - glyph.scaleX) * blend;
      glyph.scaleY += (targetScaleY - glyph.scaleY) * blend;
      glyph.offsetY += (targetOffsetY - glyph.offsetY) * blend;

      if (
        Math.abs(targetWeight - glyph.weight) > 0.08
        || Math.abs(targetScaleX - glyph.scaleX) > 0.001
        || Math.abs(targetScaleY - glyph.scaleY) > 0.001
        || Math.abs(targetOffsetY - glyph.offsetY) > 0.02
      ) {
        unsettled = true;
      } else {
        glyph.weight = targetWeight;
        glyph.scaleX = targetScaleX;
        glyph.scaleY = targetScaleY;
        glyph.offsetY = targetOffsetY;
      }

      writeGlyph(glyph);
    }

    if (unsettled) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      lastFrameTime = 0;
    }
  }

  function scheduleAnimation() {
    if (!animationFrame) animationFrame = requestAnimationFrame(animate);
  }

  function handlePointerMove(event) {
    if (event.pointerType === 'touch') return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    pointerActive = true;
    scheduleAnimation();
  }

  function clearPointer() {
    pointerActive = false;
    scheduleAnimation();
  }

  function handlePointerOut(event) {
    if (event.relatedTarget === null) clearPointer();
  }

  function handleVisibilityChange() {
    if (document.hidden) clearPointer();
  }

  function resetGlyphs() {
    pointerActive = false;
    lastFrameTime = 0;
    for (const glyph of glyphs) {
      glyph.weight = baseWeight;
      glyph.scaleX = 1;
      glyph.scaleY = 1;
      glyph.offsetY = 0;
      glyph.element.style.removeProperty('--hero-glyph-weight');
      glyph.element.style.removeProperty('--hero-glyph-scale-x');
      glyph.element.style.removeProperty('--hero-glyph-scale-y');
      glyph.element.style.removeProperty('--hero-glyph-offset-y');
    }
  }

  function handleMotionPreferenceChange(event) {
    if (event.matches) {
      detachInteractions();
    } else {
      attachInteractions();
    }
  }

  function detachInteractions() {
    if (!attached) return;
    attached = false;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    if (measurementFrame) cancelAnimationFrame(measurementFrame);
    animationFrame = 0;
    measurementFrame = 0;
    freezeWidthsOnMeasure = false;
    resetGlyphs();
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerout', handlePointerOut);
    window.removeEventListener('blur', clearPointer);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', handleScroll, true);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    document.fonts.removeEventListener?.('loadingdone', handleFontLoad);
    heroLayoutObserver?.disconnect();
  }

  function attachInteractions() {
    if (attached || motionPreference.matches || !finePointer.matches) return;
    attached = true;
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerout', handlePointerOut, { passive: true });
    window.addEventListener('blur', clearPointer);
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.fonts.addEventListener?.('loadingdone', handleFontLoad);
    heroLayoutObserver?.observe(hero, { attributes: true, attributeFilter: ['class'] });
    scheduleMeasurement(true);
  }

  function handlePageHide() {
    detachInteractions();
  }

  function handlePageShow() {
    attachInteractions();
  }

  function handleResize() {
    scheduleMeasurement(true);
  }

  function handleScroll() {
    scheduleMeasurement(false);
  }

  function handleFontLoad() {
    scheduleMeasurement(true);
  }

  window.addEventListener('pagehide', handlePageHide);
  window.addEventListener('pageshow', handlePageShow);
  motionPreference.addEventListener?.('change', handleMotionPreferenceChange);
  attachInteractions();
  document.fonts.ready.then(() => scheduleMeasurement(true));
})();
