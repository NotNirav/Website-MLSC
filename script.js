/**
 * MLSC Website & Gradient Canvas Script
 * Manages the background canvas render across the full scrollable page
 * and card spotlight interactions.
 */

(function () {
  'use strict';

  const COLOR_START = '#0c0c0c';
  const COLOR_END = '#171717';
  const MIN_CANVAS_HEIGHT = 2500;

  const canvas = document.getElementById('gradient-canvas');
  const canvasContainer = document.getElementById('canvas-container');
  const ctx = canvas ? canvas.getContext('2d') : null;

  // Render high-DPI gradient on canvas
  function renderCanvas() {
    if (!canvas || !canvasContainer || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvasContainer.clientWidth;
    const containerHeight = Math.max(MIN_CANVAS_HEIGHT, canvasContainer.scrollHeight || canvasContainer.clientHeight || MIN_CANVAS_HEIGHT);

    // Set display style dimensions
    canvas.style.width = width + 'px';
    canvas.style.height = containerHeight + 'px';

    // Set internal resolution scaled by devicePixelRatio
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(containerHeight * dpr);

    ctx.save();
    ctx.scale(dpr, dpr);

    // Top to bottom dark gradient: #0c0c0c -> #171717
    const gradient = ctx.createLinearGradient(0, 0, 0, containerHeight);
    gradient.addColorStop(0, COLOR_START);
    gradient.addColorStop(1, COLOR_END);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, containerHeight);
    ctx.restore();
  }

  // Interactive Glass Card Spotlight Effect
  const glassCards = document.querySelectorAll('.glass-card, .explore-card');
  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // =========================================================
  // Hamburger Visibility (2nd Viewport & Onwards) & Sidebar
  // =========================================================
  const hero = document.getElementById('hero');
  const hamburger = document.getElementById('nav-hamburger');
  const sidebarDrawer = document.getElementById('sidebar-drawer');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');

  let cachedHeroHeight = window.innerHeight;
  function measureHero() {
    if (hero) cachedHeroHeight = hero.offsetHeight || window.innerHeight;
  }

  function updateHamburgerVisibility(scrollTop) {
    if (!hero || !hamburger) return;
    const currentY = typeof scrollTop === 'number' ? scrollTop : window.scrollY;
    // Hamburger only shows from 2nd viewport and onwards (when hero is scrolled out of view)
    const inSecondViewportOrBeyond = currentY >= (cachedHeroHeight - 120);
    if (inSecondViewportOrBeyond) {
      if (!hamburger.classList.contains('visible')) {
        hamburger.classList.add('visible');
      }
    } else {
      if (hamburger.classList.contains('visible')) {
        hamburger.classList.remove('visible');
        closeSidebar();
      }
    }
  }

  function openSidebar() {
    if (!sidebarDrawer) return;
    sidebarDrawer.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('open');
    if (hamburger) {
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
    if (globalLenis) globalLenis.stop();
  }

  function closeSidebar() {
    if (!sidebarDrawer) return;
    sidebarDrawer.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('open');
    if (hamburger) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
    if (globalLenis) globalLenis.start();
  }

  function toggleSidebar() {
    if (!sidebarDrawer) return;
    if (sidebarDrawer.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleSidebar);
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      closeSidebar();
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          if (globalLenis) {
            globalLenis.scrollTo(targetEl, { duration: 1.2 });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarDrawer && sidebarDrawer.classList.contains('open')) {
      closeSidebar();
    }
  });

  // =========================================================
  // Global Lenis Smooth Scroll (Whole Website)
  // =========================================================
  let globalLenis = null;

  function initGlobalLenis() {
    if (globalLenis || typeof Lenis === 'undefined') return globalLenis;
    try {
      globalLenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        infinite: false,
        syncTouch: false
      });

      function raf(time) {
        globalLenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (err) {
      console.warn('Global Lenis init error:', err);
    }
    return globalLenis;
  }

  // =========================================================
  // React Bits: ScrollStack Component Logic (Window Scroll)
  // High-performance cached layout to prevent scroll thrashing
  // =========================================================
  function initScrollStack(options = {}) {
    const cards = Array.from(document.querySelectorAll('.scroll-stack-card'));
    if (!cards.length) return null;

    const itemDistance = options.itemDistance !== undefined ? options.itemDistance : 140;
    const itemScale = options.itemScale !== undefined ? options.itemScale : 0.035;
    const itemStackDistance = options.itemStackDistance !== undefined ? options.itemStackDistance : 24;
    const stackPosition = options.stackPosition || '18%';
    const scaleEndPosition = options.scaleEndPosition || '8%';
    const baseScale = options.baseScale !== undefined ? options.baseScale : 0.84;
    const onStackComplete = options.onStackComplete;

    let stackCompleted = false;
    const lastTransforms = new Map();

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      card.style.webkitTransform = 'translateZ(0)';
    });

    const calculateProgress = (scrollTop, start, end) => {
      if (scrollTop < start) return 0;
      if (scrollTop > end) return 1;
      return (scrollTop - start) / (end - start);
    };

    const parsePercentage = (value, containerHeight) => {
      if (typeof value === 'string' && value.includes('%')) {
        return (parseFloat(value) / 100) * containerHeight;
      }
      return parseFloat(value);
    };

    // Calculate un-transformed offset from document top
    const getElementDocumentTop = (element) => {
      let top = 0;
      let curr = element;
      while (curr) {
        top += curr.offsetTop || 0;
        curr = curr.offsetParent;
      }
      return top;
    };

    let cachedCards = [];
    let endElementTop = 0;
    let stackPositionPx = 0;
    let scaleEndPositionPx = 0;
    let containerHeight = 0;

    const measureLayout = () => {
      containerHeight = window.innerHeight;
      stackPositionPx = parsePercentage(stackPosition, containerHeight);
      scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

      const endElement = document.querySelector('.scroll-stack-end');
      endElementTop = endElement ? getElementDocumentTop(endElement) : 0;

      cachedCards = cards.map((card, i) => {
        const cardTop = getElementDocumentTop(card);
        const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
        const triggerEnd = cardTop - scaleEndPositionPx;
        const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
        const pinEnd = endElementTop - containerHeight * 0.7;
        const targetScale = baseScale + i * itemScale;
        const stackOffset = stackPositionPx + itemStackDistance * i;

        return {
          card,
          index: i,
          cardTop,
          triggerStart,
          triggerEnd,
          pinStart,
          pinEnd,
          targetScale,
          stackOffset
        };
      });
    };

    measureLayout();

    const updateCardTransforms = (customScrollTop) => {
      if (!cachedCards.length) return;

      const scrollTop = typeof customScrollTop === 'number' ? customScrollTop : window.scrollY;

      for (let i = 0; i < cachedCards.length; i++) {
        const item = cachedCards[i];
        const { card, cardTop, triggerStart, triggerEnd, pinStart, pinEnd, targetScale, stackOffset } = item;

        const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
        const scale = 1 - scaleProgress * (1 - targetScale);

        let translateY = 0;
        if (scrollTop >= pinStart && scrollTop <= pinEnd) {
          translateY = scrollTop - cardTop + stackOffset;
        } else if (scrollTop > pinEnd) {
          translateY = pinEnd - cardTop + stackOffset;
        }

        const roundedY = Math.round(translateY * 10) / 10;
        const roundedScale = Math.round(scale * 1000) / 1000;

        const last = lastTransforms.get(i);
        if (!last || Math.abs(last.translateY - roundedY) > 0.1 || Math.abs(last.scale - roundedScale) > 0.001) {
          card.style.transform = `translate3d(0, ${roundedY}px, 0) scale(${roundedScale})`;
          lastTransforms.set(i, { translateY: roundedY, scale: roundedScale });
        }

        if (i === cachedCards.length - 1) {
          const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
          if (isInView && !stackCompleted) {
            stackCompleted = true;
            if (typeof onStackComplete === 'function') onStackComplete();
          } else if (!isInView && stackCompleted) {
            stackCompleted = false;
          }
        }
      }
    };

    return {
      update: updateCardTransforms,
      measure: measureLayout
    };
  }

  // =========================================================
  // App Orchestration (Single Global Initialization)
  // =========================================================
  let scrollStackInstance = null;

  function onScrollHandler(e) {
    const scrollY = (e && typeof e.scroll === 'number') ? e.scroll : window.scrollY;
    if (scrollStackInstance) scrollStackInstance.update(scrollY);
    updateHamburgerVisibility(scrollY);
  }

  function onResizeHandler() {
    renderCanvas();
    measureHero();
    if (scrollStackInstance) {
      scrollStackInstance.measure();
      scrollStackInstance.update(window.scrollY);
    }
    updateHamburgerVisibility(window.scrollY);
  }

  let isAppInitialized = false;
  function initApp() {
    if (isAppInitialized) return;
    isAppInitialized = true;

    measureHero();
    renderCanvas();
    const lenis = initGlobalLenis();
    scrollStackInstance = initScrollStack();

    if (lenis) {
      lenis.on('scroll', onScrollHandler);
    } else {
      window.addEventListener('scroll', onScrollHandler, { passive: true });
    }

    window.addEventListener('resize', onResizeHandler);
    onScrollHandler({ scroll: window.scrollY });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
