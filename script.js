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
  // Glassmorphism Navbar Visibility (2nd Viewport & Onwards)
  // =========================================================
  const hero = document.getElementById('hero');
  const glassNavbar = document.getElementById('glass-navbar');
  const navLinks = document.querySelectorAll('.glass-nav-link');
  const navBrand = document.querySelector('.glass-nav-brand');

  let cachedHeroHeight = window.innerHeight;
  function measureHero() {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      cachedHeroHeight = aboutSection.offsetTop;
    } else if (hero) {
      cachedHeroHeight = hero.offsetHeight || window.innerHeight;
    }
  }

  function updateNavbarVisibility(scrollTop) {
    if (!hero || !glassNavbar) return;
    const currentY = typeof scrollTop === 'number' ? scrollTop : window.scrollY;
    // Navbar appears right when the below-fold page just appears (at the white reference line)
    const inBelowFold = currentY >= cachedHeroHeight;
    if (inBelowFold) {
      if (!glassNavbar.classList.contains('visible')) {
        glassNavbar.classList.add('visible');
      }
    } else {
      if (glassNavbar.classList.contains('visible')) {
        glassNavbar.classList.remove('visible');
      }
    }
  }

  function handleAnchorSmoothScroll(e, link) {
    const targetHref = link.getAttribute('href');
    if (targetHref && targetHref.startsWith('#')) {
      const targetElement = document.querySelector(targetHref);
      if (targetElement) {
        e.preventDefault();
        if (globalLenis) {
          globalLenis.scrollTo(targetElement, { offset: 0, duration: 1.2 });
        } else {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => handleAnchorSmoothScroll(e, link));
  });

  if (navBrand) {
    navBrand.addEventListener('click', (e) => handleAnchorSmoothScroll(e, navBrand));
  }

  document.querySelectorAll('.scroll-stack-arrow').forEach(arrow => {
    arrow.addEventListener('click', (e) => handleAnchorSmoothScroll(e, arrow));
  });

  // =========================================================
  // Global Lenis Smooth Scroll (Whole Website)
  // Calibrated for ultra-luxurious, weighted liquid inertia
  // =========================================================
  let globalLenis = null;

  function initGlobalLenis() {
    if (globalLenis || typeof Lenis === 'undefined') return globalLenis;
    try {
      globalLenis = new Lenis({
        lerp: 0.06, // Liquid inertia damping — gives that silky, weighty Awwwards-style glide
        wheelMultiplier: 0.72, // Calibrated pace so scrolling doesn't fly through content
        touchMultiplier: 1.2,
        smoothWheel: true,
        infinite: false,
        orientation: 'vertical',
        gestureOrientation: 'vertical'
      });

      // Synchronize Lenis with GSAP Ticker if available for zero-jitter rendering
      if (typeof gsap !== 'undefined') {
        if (typeof ScrollTrigger !== 'undefined') {
          gsap.registerPlugin(ScrollTrigger);
          globalLenis.on('scroll', ScrollTrigger.update);
        }
        gsap.ticker.add((time) => {
          globalLenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          globalLenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    } catch (err) {
      console.warn('Global Lenis init error:', err);
    }
    return globalLenis;
  }

  // =========================================================
  // Cinematic ScrollTrigger Parallax & Depth Animations
  // =========================================================
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // 1. Hero Title: Cinematic Parallax & Scale-down on scroll
    const heroTitle = document.querySelector('.hero-raw-title');
    const heroSection = document.getElementById('hero');
    if (heroTitle && heroSection) {
      gsap.to(heroTitle, {
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
          invalidateOnRefresh: true
        },
        y: 110,
        scale: 0.86,
        opacity: 0.08,
        ease: 'power1.out'
      });
    }

    // 2. About Us Section: Silky Elevation & Reveal
    const aboutContainer = document.querySelector('.about-container');
    const aboutSection = document.getElementById('about');
    if (aboutContainer && aboutSection) {
      gsap.fromTo(
        aboutContainer,
        { opacity: 0.7, y: 40, scale: 0.98 },
        {
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 1.2,
            invalidateOnRefresh: true
          },
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power2.out'
        }
      );
    }

    // 3. Explore Header: Gentle Slide & Focus
    const exploreHeader = document.querySelector('.explore-header-row');
    const exploreSection = document.getElementById('explore');
    if (exploreHeader && exploreSection) {
      gsap.fromTo(
        exploreHeader,
        { opacity: 0.6, y: 30 },
        {
          scrollTrigger: {
            trigger: exploreSection,
            start: 'top 82%',
            end: 'top 48%',
            scrub: 1,
            invalidateOnRefresh: true
          },
          opacity: 1,
          y: 0,
          ease: 'power2.out'
        }
      );
    }
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

        if (typeof gsap !== 'undefined') {
          gsap.set(card, {
            y: translateY,
            scale: scale,
            force3D: true,
            overwrite: 'auto'
          });
        } else {
          card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
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
    updateNavbarVisibility(scrollY);
  }

  function onResizeHandler() {
    renderCanvas();
    measureHero();
    if (globalLenis) {
      globalLenis.resize();
    }
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
    if (scrollStackInstance) {
      scrollStackInstance.measure();
      scrollStackInstance.update(window.scrollY);
    }
    updateNavbarVisibility(window.scrollY);
  }

  let isAppInitialized = false;
  function initApp() {
    if (isAppInitialized) return;
    isAppInitialized = true;

    measureHero();
    renderCanvas();
    const lenis = initGlobalLenis();
    scrollStackInstance = initScrollStack();
    initScrollAnimations();

    if (lenis) {
      lenis.on('scroll', onScrollHandler);
    } else {
      window.addEventListener('scroll', onScrollHandler, { passive: true });
    }

    window.addEventListener('resize', onResizeHandler);
    window.addEventListener('load', () => {
      if (globalLenis) globalLenis.resize();
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      onResizeHandler();
    });

    onScrollHandler({ scroll: window.scrollY });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
