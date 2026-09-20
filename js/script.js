/**
 * MLSC Website & Gradient Canvas Script
 * Manages the background canvas render across the full scrollable page
 * and card spotlight interactions.
 */

(function () {
  'use strict';

  const COLOR_START = '#000000';
  const COLOR_END = '#000000';
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
    if (!hero || !glassNavbar || glassNavbar.classList.contains('navbar-fixed')) return;
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
    if (globalLenis) return globalLenis;
    if (typeof window !== 'undefined' && window.lenis) {
      globalLenis = window.lenis;
      return globalLenis;
    }
    if (typeof Lenis === 'undefined') return null;
    try {
      globalLenis = new Lenis({
        lerp: 0.07, // Liquid inertia damping — gives that silky, weighty Awwwards-style glide
        wheelMultiplier: 0.8, // Calibrated pace for buttery smooth scrolling
        touchMultiplier: 1.2,
        smoothWheel: true,
        infinite: false,
        orientation: 'vertical',
        gestureOrientation: 'vertical'
      });
      window.lenis = globalLenis;

      // Synchronize Lenis with GSAP Ticker if available for zero-jitter rendering
      if (typeof gsap !== 'undefined') {
        if (typeof ScrollTrigger !== 'undefined') {
          gsap.registerPlugin(ScrollTrigger);
          globalLenis.on('scroll', ScrollTrigger.update);
        }
        if (!window.__lenisTickerBound) {
          window.__lenisTickerBound = true;
          gsap.ticker.add((time) => {
            globalLenis.raf(time * 1000);
          });
          gsap.ticker.lagSmoothing(0);
        }
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

    // 3. About Us Section: Silky Elevation & Reveal
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

    // 4. Explore Header: Gentle Slide & Focus
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
  // Dual Direction Mascot Scroll Controller (Down & Up + Sleep Mascot)
  // Liquid-smooth LERP inertia, GPU acceleration, direction hysteresis & sleep.webp transition
  // =========================================================
  function initDualMascotScrollController() {
    const heroSection = document.getElementById('hero');
    const exploreSection = document.getElementById('explore');
    const footerSection = document.getElementById('footer') || document.querySelector('.site-footer');
    const downWrapper = document.getElementById('brie-scroll-down-wrapper');
    const upWrapper = document.getElementById('brie-scroll-up-wrapper');
    const sleepWrapper = document.getElementById('brie-sleep-wrapper');
    const heroTitle = document.querySelector('.hero-raw-title');

    if (!heroSection || !exploreSection || !downWrapper || !upWrapper) return;

    let targetY = window.scrollY;
    let smoothY = window.scrollY;
    let lastDirectionY = window.scrollY;
    let scrollDirection = 'down';
    let isTicking = false;

    // Cache section layout metrics to prevent DOM reflows during scroll
    let cachedHeroTop = 0;
    let cachedHeroHeight = 0;
    let cachedExploreTop = 0;
    let cachedFooterTop = 0;

    function getElementDocTop(el) {
      let top = 0;
      let curr = el;
      while (curr) {
        top += curr.offsetTop || 0;
        curr = curr.offsetParent;
      }
      return top;
    }

    function updateMetrics() {
      cachedHeroTop = getElementDocTop(heroSection);
      cachedHeroHeight = heroSection.offsetHeight || window.innerHeight;
      cachedExploreTop = getElementDocTop(exploreSection);
      if (footerSection) {
        cachedFooterTop = getElementDocTop(footerSection);
      }
    }

    updateMetrics();
    window.addEventListener('resize', updateMetrics, { passive: true });

    function renderLoop() {
      // Continuous LERP inertia smoothing to eliminate scroll micro-stutter
      smoothY += (targetY - smoothY) * 0.14;
      if (Math.abs(targetY - smoothY) < 0.05) {
        smoothY = targetY;
      }

      const y = smoothY;

      // Direction hysteresis (minimum 15px threshold to prevent direction flapping)
      const dirDiff = y - lastDirectionY;
      if (Math.abs(dirDiff) > 15) {
        scrollDirection = dirDiff > 0 ? 'down' : 'up';
        lastDirectionY = y;
      }

      const startY = cachedHeroTop + cachedHeroHeight * 0.45;
      const endY = cachedExploreTop + 80;

      if (y <= cachedHeroTop + 10) {
        gsap.set(downWrapper, { opacity: 0, visibility: 'hidden' });
        gsap.set(upWrapper, { opacity: 0, visibility: 'hidden' });
        if (sleepWrapper) gsap.set(sleepWrapper, { opacity: 0, visibility: 'hidden' });
        if (heroTitle) gsap.set(heroTitle, { opacity: 1, scale: 1, y: 0 });
      } else if (y < startY) {
        const heroFadeProgress = (y - cachedHeroTop) / (startY - cachedHeroTop);
        if (heroTitle) {
          const titleOpacity = Math.max(0, 1 - heroFadeProgress * 1.5);
          gsap.set(heroTitle, { opacity: titleOpacity, scale: 1 - heroFadeProgress * 0.1, y: heroFadeProgress * 80 });
        }
        gsap.set(downWrapper, { opacity: 0, visibility: 'hidden' });
        gsap.set(upWrapper, { opacity: 0, visibility: 'hidden' });
        if (sleepWrapper) gsap.set(sleepWrapper, { opacity: 0, visibility: 'hidden' });
      } else if (y < endY) {
        // Transition region between Hero and Stack Cards
        const p = Math.max(0, Math.min(1, (y - startY) / (endY - startY)));

        if (heroTitle) gsap.set(heroTitle, { opacity: 0 });

        // Calculate GPU transform distance in pixels for downward movement
        const maxMovePx = window.innerHeight * 0.62;
        const translateYPx = p * maxMovePx;

        let downOpacity = 0;
        let sleepOpacity = 0;

        if (p < 0.18) {
          downOpacity = p / 0.18;
        } else if (p <= 0.65) {
          downOpacity = 1.0;
        } else if (p < 0.82) {
          // Downward mascot fades out completely until opacity 0 at p = 0.82
          downOpacity = (0.82 - p) / 0.17;
        } else {
          downOpacity = 0;
        }

        // sleep.webp ONLY starts fading in AFTER downward mascot is completely faded out (p >= 0.82)
        if (p >= 0.82) {
          sleepOpacity = (p - 0.82) / 0.18;
        } else {
          sleepOpacity = 0;
        }

        downOpacity = Math.max(0, Math.min(1, downOpacity));
        sleepOpacity = Math.max(0, Math.min(1, sleepOpacity));

        gsap.set(upWrapper, { opacity: 0, visibility: 'hidden' });

        if (downOpacity > 0) {
          gsap.set(downWrapper, {
            visibility: 'visible',
            opacity: downOpacity,
            y: translateYPx,
            force3D: true
          });
        } else {
          gsap.set(downWrapper, { opacity: 0, visibility: 'hidden' });
        }

        if (sleepWrapper) {
          if (sleepOpacity > 0) {
            gsap.set(sleepWrapper, {
              visibility: 'visible',
              opacity: sleepOpacity,
              y: 0,
              force3D: true
            });
          } else {
            gsap.set(sleepWrapper, { opacity: 0, visibility: 'hidden' });
          }
        }
      } else {
        // y >= endY: Inside Stack Cards / Explore Section & Footer
        if (heroTitle) gsap.set(heroTitle, { opacity: 0 });

        gsap.set(downWrapper, { opacity: 0, visibility: 'hidden' });
        gsap.set(upWrapper, { opacity: 0, visibility: 'hidden' });

        // sleep.webp remains continuously visible down through cards & footer, pinned above footer line
        if (sleepWrapper) {
          let sleepPinY = 0;
          if (cachedFooterTop > 0) {
            const sleepHeight = sleepWrapper.offsetHeight || 184;
            const defaultScreenTop = 80 + window.innerHeight * 0.62 - (sleepHeight / 2);
            const defaultDocBottom = y + defaultScreenTop + sleepHeight;
            const maxDocBottom = cachedFooterTop - 12; // 12px gap strictly above footer line
            if (defaultDocBottom > maxDocBottom) {
              sleepPinY = -(defaultDocBottom - maxDocBottom);
            }
          }

          gsap.set(sleepWrapper, {
            visibility: 'visible',
            opacity: 1.0,
            y: sleepPinY,
            force3D: true
          });
        }
      }

      if (Math.abs(targetY - smoothY) > 0.05) {
        requestAnimationFrame(renderLoop);
      } else {
        isTicking = false;
      }
    }

    function onScroll(currentScrollY) {
      targetY = typeof currentScrollY === 'number' ? currentScrollY : window.scrollY;
      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(renderLoop);
      }
    }

    if (window.lenis) {
      window.lenis.on('scroll', (e) => onScroll(e.scroll));
    } else {
      window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
    }

    updateMetrics();
    onScroll(window.scrollY);
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
        const depthDim = 1 - (scaleProgress * 0.12);

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
            filter: `brightness(${depthDim})`,
            force3D: true,
            overwrite: 'auto'
          });
        } else {
          card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
          card.style.filter = `brightness(${depthDim})`;
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
  // Achievements: Scroll-Driven Journey Timeline Logic
  // =========================================================
  function initJourneyTimeline() {
    const journeySection = document.getElementById('our-journey');
    if (!journeySection) return null;

    const stickyContainer = document.getElementById('journey-sticky-container');
    const lineFill = document.getElementById('journey-line-fill');
    const milestoneItems = Array.from(journeySection.querySelectorAll('.journey-milestone-item'));

    if (!lineFill || !milestoneItems.length) return null;

    let isMobile = window.innerWidth <= 820;
    let cachedSectionTop = 0;
    let cachedScrollDistance = 0;

    const getElementDocTop = (element) => {
      let top = 0;
      let curr = element;
      while (curr) {
        top += curr.offsetTop || 0;
        curr = curr.offsetParent;
      }
      return top;
    };

    function measureLayout() {
      isMobile = window.innerWidth <= 820;
      cachedSectionTop = getElementDocTop(journeySection);
      const sectionHeight = journeySection.offsetHeight;
      const viewportHeight = window.innerHeight;
      cachedScrollDistance = Math.max(1, sectionHeight - viewportHeight);
    }

    measureLayout();

    function applyProgress(progress) {
      lineFill.style.transform = `translateY(-50%) scaleX(${progress})`;

      const count = milestoneItems.length;
      milestoneItems.forEach((item, index) => {
        const target = index === 0 ? 0 : (index / (count - 1)) * 0.96;
        if (progress >= target) {
          if (!item.classList.contains('is-active')) item.classList.add('is-active');
        } else {
          if (item.classList.contains('is-active')) item.classList.remove('is-active');
        }
      });
    }

    // GSAP ScrollTrigger Integration for Buttery Smooth Scrubbing
    let scrollTriggerInstance = null;
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !isMobile) {
      gsap.registerPlugin(ScrollTrigger);
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: journeySection,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          applyProgress(self.progress);
        }
      });
    }

    function updateTimeline(customScrollTop) {
      const scrollTop = typeof customScrollTop === 'number' ? customScrollTop : window.scrollY;

      if (!isMobile) {
        // Desktop: If ScrollTrigger is active, it handles progress; otherwise update directly
        if (!scrollTriggerInstance) {
          const relY = scrollTop - cachedSectionTop;
          const progress = Math.min(1, Math.max(0, relY / cachedScrollDistance));
          applyProgress(progress);
        }
      } else {
        // Mobile Vertical Timeline Progress
        if (stickyContainer) stickyContainer.style.transform = 'none';

        const rect = journeySection.getBoundingClientRect();
        const vh = window.innerHeight;
        const totalTravel = journeySection.offsetHeight;
        const currentProgress = Math.min(1, Math.max(0, (vh * 0.65 - rect.top) / (totalTravel * 0.85)));

        lineFill.style.transform = `scaleY(${currentProgress})`;

        // Reveal each milestone as it enters around 75% of viewport
        milestoneItems.forEach(item => {
          const itemRect = item.getBoundingClientRect();
          if (itemRect.top <= vh * 0.75) {
            if (!item.classList.contains('is-active')) item.classList.add('is-active');
          } else {
            if (item.classList.contains('is-active')) item.classList.remove('is-active');
          }
        });
      }
    }

    return {
      update: updateTimeline,
      measure: measureLayout
    };
  }

  // =========================================================
  // LEADERBOARD PAGE FUNCTIONALITY & DATA
  // =========================================================
  const LEADERBOARD_DATA = [
    { rank: 1, name: "Aarav Sharma", handle: "aarav45", points: 4850, solved: 412, tier: "Grandmaster", badge: "🥇", isCurrentUser: false },
    { rank: 2, name: "Riya Kapoor", handle: "riya_code", points: 4520, solved: 385, tier: "Master", badge: "🥈", isCurrentUser: false },
    { rank: 3, name: "Aditya Verma", handle: "aditya_v", points: 4210, solved: 360, tier: "Candidate Master", badge: "🥉", isCurrentUser: false },
    { rank: 4, name: "Sneha Patel", handle: "sneha_dev", points: 3980, solved: 338, tier: "Knight", badge: "⚔️", isCurrentUser: true },
    { rank: 5, name: "Rahul Kulkarni", handle: "rahul_k", points: 3750, solved: 315, tier: "Knight", badge: "⚔️", isCurrentUser: false },
    { rank: 6, name: "Ananya Mehta", handle: "ananya_m", points: 3510, solved: 298, tier: "Specialist", badge: "⚡", isCurrentUser: false },
    { rank: 7, name: "Kunal Joshi", handle: "kunal_t", points: 3290, solved: 280, tier: "Specialist", badge: "⚡", isCurrentUser: false },
    { rank: 8, name: "Meera Singh", handle: "meera_s", points: 3050, solved: 262, tier: "Specialist", badge: "⚡", isCurrentUser: false },
    { rank: 9, name: "Yash Patil", handle: "yash_p", points: 2890, solved: 245, tier: "Pupil", badge: "🌱", isCurrentUser: false },
    { rank: 10, name: "Isha Roy", handle: "isha_r", points: 2720, solved: 230, tier: "Pupil", badge: "🌱", isCurrentUser: false },
    { rank: 11, name: "Devanshu Shah", handle: "devanshu_s", points: 2550, solved: 215, tier: "Pupil", badge: "🌱", isCurrentUser: false },
    { rank: 12, name: "Tanvi Bhat", handle: "tanvi_b", points: 2410, solved: 202, tier: "Newbie", badge: "⭐", isCurrentUser: false }
  ];

  function getAvatarSvg(name, rank) {
    const palette = [
      ['#ffb900', '#f59e0b'], // Gold
      ['#cbd5e1', '#64748b'], // Silver
      ['#f59e0b', '#b45309'], // Bronze
      ['#38bdf8', '#0284c7'], // Sky blue
      ['#c084fc', '#7e22ce'], // Purple
      ['#34d399', '#059669'], // Emerald
      ['#f43f5e', '#be123c'], // Rose
      ['#fb923c', '#c2410c']  // Amber
    ];
    const colorPair = palette[(rank - 1) % palette.length];
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs><linearGradient id="g${rank}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${encodeURIComponent(colorPair[0])}"/><stop offset="100%" stop-color="${encodeURIComponent(colorPair[1])}"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23g${rank})"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="34">${initials}</text></svg>`;
  }

  function renderPodium(topThreeData) {
    const podiumContainer = document.getElementById('podium-container');
    if (!podiumContainer || topThreeData.length < 3) return;

    // Podium layout order: Rank 2 (Left), Rank 1 (Center/Tallest), Rank 3 (Right)
    const rank1 = topThreeData.find(u => u.rank === 1) || topThreeData[0];
    const rank2 = topThreeData.find(u => u.rank === 2) || topThreeData[1];
    const rank3 = topThreeData.find(u => u.rank === 3) || topThreeData[2];

    podiumContainer.innerHTML = `
      <!-- Rank 2 Card (Silver - Left) -->
      <div class="podium-card rank-2 glass-card">
        <div class="podium-avatar-outer">
          <img src="${getAvatarSvg(rank2.name, 2)}" alt="${rank2.name}" class="podium-avatar">
          <div class="podium-rank-badge">2</div>
        </div>
        <div class="podium-user-info">
          <h3 class="podium-name">${rank2.name}</h3>
          <span class="podium-handle">@${rank2.handle}</span>
          <span class="podium-tier-tag">${rank2.tier}</span>
        </div>
        <div class="podium-pedestal-base">
          <div class="podium-stat">
            <span class="podium-stat-val">${rank2.solved}</span>
            <span class="podium-stat-lbl">Solved</span>
          </div>
          <div class="podium-stat">
            <span class="podium-stat-val pts">${rank2.points.toLocaleString()}</span>
            <span class="podium-stat-lbl">Points</span>
          </div>
        </div>
      </div>

      <!-- Rank 1 Card (Gold - Center/Tallest) -->
      <div class="podium-card rank-1 glass-card">
        <div class="podium-crown-wrap">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="#ffb900" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V18H19V19Z" />
          </svg>
        </div>
        <div class="podium-avatar-outer">
          <img src="${getAvatarSvg(rank1.name, 1)}" alt="${rank1.name}" class="podium-avatar">
          <div class="podium-rank-badge">1</div>
        </div>
        <div class="podium-user-info">
          <h3 class="podium-name">${rank1.name}</h3>
          <span class="podium-handle">@${rank1.handle}</span>
          <span class="podium-tier-tag">${rank1.tier}</span>
        </div>
        <div class="podium-pedestal-base">
          <div class="podium-stat">
            <span class="podium-stat-val">${rank1.solved}</span>
            <span class="podium-stat-lbl">Solved</span>
          </div>
          <div class="podium-stat">
            <span class="podium-stat-val pts">${rank1.points.toLocaleString()}</span>
            <span class="podium-stat-lbl">Points</span>
          </div>
        </div>
      </div>

      <!-- Rank 3 Card (Bronze - Right) -->
      <div class="podium-card rank-3 glass-card">
        <div class="podium-avatar-outer">
          <img src="${getAvatarSvg(rank3.name, 3)}" alt="${rank3.name}" class="podium-avatar">
          <div class="podium-rank-badge">3</div>
        </div>
        <div class="podium-user-info">
          <h3 class="podium-name">${rank3.name}</h3>
          <span class="podium-handle">@${rank3.handle}</span>
          <span class="podium-tier-tag">${rank3.tier}</span>
        </div>
        <div class="podium-pedestal-base">
          <div class="podium-stat">
            <span class="podium-stat-val">${rank3.solved}</span>
            <span class="podium-stat-lbl">Solved</span>
          </div>
          <div class="podium-stat">
            <span class="podium-stat-val pts">${rank3.points.toLocaleString()}</span>
            <span class="podium-stat-lbl">Points</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderCurrentUserCard(user) {
    const userCard = document.getElementById('user-highlight-card');
    if (!userCard || !user) return;

    const rankFormatted = String(user.rank).padStart(2, '0');

    userCard.innerHTML = `
      <div class="user-card-left">
        <div class="user-card-avatar-wrap">
          <img src="${getAvatarSvg(user.name, user.rank)}" alt="${user.name}" class="user-card-avatar">
          <span class="user-you-tag">YOU</span>
        </div>
        <div class="user-card-details">
          <div class="user-card-title-row">
            <h3 class="user-card-name">${user.name}</h3>
          </div>
          <span class="user-card-handle">@${user.handle}</span>
        </div>
      </div>

      <div class="user-card-stats-grid">
        <div class="user-stat-box">
          <span class="user-stat-lbl">Position</span>
          <span class="user-stat-val accent">#${rankFormatted}</span>
        </div>
        <div class="user-stat-box">
          <span class="user-stat-lbl">Questions</span>
          <span class="user-stat-val">${user.solved}</span>
        </div>
        <div class="user-stat-box">
          <span class="user-stat-lbl">Points</span>
          <span class="user-stat-val accent">${user.points.toLocaleString()} pts</span>
        </div>
        <div class="user-stat-box">
          <span class="user-stat-lbl">Tier</span>
          <span class="user-stat-val">${user.tier} ${user.badge}</span>
        </div>
      </div>
    `;
  }

  function renderRankingsList(listData) {
    const listContainer = document.getElementById('rankings-list');
    const countBadge = document.getElementById('rankings-count');
    if (!listContainer) return;

    if (countBadge) {
      countBadge.textContent = `${listData.length} Coders`;
    }

    if (listData.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-muted); font-family: 'Plus Jakarta Sans', sans-serif;">
          No rankers found matching your search query.
        </div>
      `;
      return;
    }

    listContainer.innerHTML = listData.map(item => {
      const formattedRank = String(item.rank).padStart(2, '0');
      const tierClass = item.tier.toLowerCase().replace(/\s+/g, '-');
      const currentUserClass = item.isCurrentUser ? 'is-current-user' : '';
      const youBadge = item.isCurrentUser ? `<span class="row-you-badge">YOU</span>` : '';

      return `
        <div class="ranking-row ${currentUserClass} glass-card">
          <div class="col-rank">${formattedRank}</div>
          <div class="col-user">
            <img src="${getAvatarSvg(item.name, item.rank)}" alt="${item.name}" class="row-avatar">
            <div class="row-user-details">
              <span class="row-name">${item.name} ${youBadge}</span>
              <span class="row-handle">@${item.handle}</span>
            </div>
          </div>
          <div class="col-solved">${item.solved} solved</div>
          <div class="col-points">${item.points.toLocaleString()} pts</div>
          <div class="col-badge">
            <span class="tier-badge ${tierClass}">${item.tier} ${item.badge}</span>
          </div>
        </div>
      `;
    }).join('');

    // Re-attach glass spotlight mousemove events for newly rendered rows
    const newGlassCards = listContainer.querySelectorAll('.glass-card');
    newGlassCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  function initLeaderboard() {
    const podiumContainer = document.getElementById('podium-container');
    if (!podiumContainer) return; // Not on page with leaderboard

    let currentDataSet = [...LEADERBOARD_DATA];

    // Initial render
    renderPodium(currentDataSet.slice(0, 3));
    const currentUser = currentDataSet.find(u => u.isCurrentUser) || currentDataSet[3];
    renderCurrentUserCard(currentUser);
    // Display remaining rankings (ranks 4+)
    renderRankingsList(currentDataSet.slice(3));

    // Search Filtering
    const searchInput = document.getElementById('leaderboard-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
          renderRankingsList(currentDataSet.slice(3));
          return;
        }

        const filtered = currentDataSet.filter(item =>
          item.name.toLowerCase().includes(query) ||
          item.handle.toLowerCase().includes(query) ||
          item.tier.toLowerCase().includes(query)
        );
        renderRankingsList(filtered);
      });
    }

    // Timeframe Tabs Filter
    const timeframeBtns = document.querySelectorAll('.timeframe-btn');
    timeframeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        timeframeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const timeframe = btn.getAttribute('data-timeframe');
        let multiplier = 1;
        if (timeframe === 'monthly') multiplier = 0.35;
        if (timeframe === 'weekly') multiplier = 0.12;

        currentDataSet = LEADERBOARD_DATA.map(item => ({
          ...item,
          points: Math.round(item.points * multiplier),
          solved: Math.round(item.solved * multiplier)
        }));

        renderPodium(currentDataSet.slice(0, 3));
        const updatedCurrentUser = currentDataSet.find(u => u.isCurrentUser) || currentDataSet[3];
        renderCurrentUserCard(updatedCurrentUser);
        renderRankingsList(currentDataSet.slice(3));

        if (searchInput && searchInput.value) {
          searchInput.dispatchEvent(new Event('input'));
        }
      });
    });
  }

  // =========================================================
  // Achievements: Hackathon Winners 3D Single-Row Carousel (Parity with Teams Page)
  // =========================================================
  let hackathonCarouselInstance = null;

  function initHackathonWinnersCarousel() {
    const stage = document.getElementById('winner-carousel-stage');
    const track = document.getElementById('winner-cards-track');
    if (!stage || !track) return null;

    const cards = Array.from(track.querySelectorAll('.winner-card'));
    if (!cards.length) return null;

    const prevBtn = document.getElementById('winner-prev-btn');
    const nextBtn = document.getElementById('winner-next-btn');
    const indicatorsWrap = document.getElementById('winner-indicators');
    const counterBadge = document.getElementById('winner-counter');

    let currentIndex = 0;
    const total = cards.length;
    let autoPlayTimer = null;

    const WINNER_LUT = {
      desktop: {
        0: { transform: 'translate3d(-50%, -50%, 0px) scale(1) rotateY(0deg)', opacity: '1', zIndex: '20', pe: 'auto', vis: 'visible' },
        '+1': { transform: 'translate3d(calc(-50% + 245px), -50%, -50px) scale(0.88) rotateY(-16deg)', opacity: '0.92', zIndex: '12', pe: 'auto', vis: 'visible' },
        '-1': { transform: 'translate3d(calc(-50% - 245px), -50%, -50px) scale(0.88) rotateY(16deg)', opacity: '0.92', zIndex: '12', pe: 'auto', vis: 'visible' },
        '+2': { transform: 'translate3d(calc(-50% + 440px), -50%, -100px) scale(0.76) rotateY(-28deg)', opacity: '0.8', zIndex: '7', pe: 'auto', vis: 'visible' },
        '-2': { transform: 'translate3d(calc(-50% - 440px), -50%, -100px) scale(0.76) rotateY(28deg)', opacity: '0.8', zIndex: '7', pe: 'auto', vis: 'visible' },
        '+3': { transform: 'translate3d(calc(-50% + 560px), -50%, -160px) scale(0.62) rotateY(-38deg)', opacity: '0', zIndex: '1', pe: 'none', vis: 'hidden' },
        '-3': { transform: 'translate3d(calc(-50% - 560px), -50%, -160px) scale(0.62) rotateY(38deg)', opacity: '0', zIndex: '1', pe: 'none', vis: 'hidden' },
        dormant: { transform: 'translate3d(-50%, -50%, -180px) scale(0.6) rotateY(0deg)', opacity: '0', zIndex: '1', pe: 'none', vis: 'hidden' }
      },
      tablet: {
        0: { transform: 'translate3d(-50%, -50%, 0px) scale(1) rotateY(0deg)', opacity: '1', zIndex: '20', pe: 'auto', vis: 'visible' },
        '+1': { transform: 'translate3d(calc(-50% + 180px), -50%, -45px) scale(0.88) rotateY(-14deg)', opacity: '0.88', zIndex: '12', pe: 'auto', vis: 'visible' },
        '-1': { transform: 'translate3d(calc(-50% - 180px), -50%, -45px) scale(0.88) rotateY(14deg)', opacity: '0.88', zIndex: '12', pe: 'auto', vis: 'visible' },
        '+2': { transform: 'translate3d(calc(-50% + 310px), -50%, -95px) scale(0.74) rotateY(-24deg)', opacity: '0', zIndex: '1', pe: 'none', vis: 'hidden' },
        '-2': { transform: 'translate3d(calc(-50% - 310px), -50%, -95px) scale(0.74) rotateY(24deg)', opacity: '0', zIndex: '1', pe: 'none', vis: 'hidden' },
        dormant: { transform: 'translate3d(-50%, -50%, -150px) scale(0.6) rotateY(0deg)', opacity: '0', zIndex: '1', pe: 'none', vis: 'hidden' }
      },
      mobile: {
        0: { transform: 'translate3d(-50%, -50%, 0px) scale(1) rotateY(0deg)', opacity: '1', zIndex: '20', pe: 'auto', vis: 'visible' },
        '+1': { transform: 'translate3d(calc(-50% + 95px), -50%, -35px) scale(0.84) rotateY(-12deg)', opacity: '0.55', zIndex: '8', pe: 'auto', vis: 'visible' },
        '-1': { transform: 'translate3d(calc(-50% - 95px), -50%, -35px) scale(0.84) rotateY(12deg)', opacity: '0.55', zIndex: '8', pe: 'auto', vis: 'visible' },
        dormant: { transform: 'translate3d(-50%, -50%, -110px) scale(0.6) rotateY(0deg)', opacity: '0', zIndex: '1', pe: 'none', vis: 'hidden' }
      }
    };

    function getDevice() {
      const w = window.innerWidth;
      if (w <= 640) return 'mobile';
      if (w <= 1024) return 'tablet';
      return 'desktop';
    }

    function computeDelta(cardIdx, currentIdx) {
      if (total <= 1) return 0;
      let diff = cardIdx - currentIdx;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;
      if (diff === -total / 2 && total % 2 === 0) diff = total / 2;
      return diff;
    }

    function getPreset(device, delta) {
      const lut = WINNER_LUT[device];
      if (delta === 0) return lut[0];
      if (delta === 'dormant') return lut.dormant;
      if (device === 'mobile') {
        if (delta === 1) return lut['+1'];
        if (delta === -1) return lut['-1'];
        return lut.dormant;
      }
      const key = (delta > 0 ? '+' : '') + delta;
      if (lut[key]) return lut[key];
      return delta > 0 ? (lut['+3'] || lut.dormant) : (lut['-3'] || lut.dormant);
    }

    // Build indicators
    if (indicatorsWrap) {
      indicatorsWrap.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'winner-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to achievement ${i + 1}`);
        dot.addEventListener('click', () => {
          goTo(i);
          resetAutoPlay();
        });
        indicatorsWrap.appendChild(dot);
      }
    }

    function updatePositions() {
      const device = getDevice();
      const dots = indicatorsWrap ? indicatorsWrap.querySelectorAll('.winner-dot') : [];

      cards.forEach((card, idx) => {
        const delta = computeDelta(idx, currentIndex);
        const preset = getPreset(device, delta);

        card.style.transform = preset.transform;
        card.style.opacity = preset.opacity;
        card.style.zIndex = preset.zIndex;
        card.style.pointerEvents = preset.pe;
        card.style.visibility = preset.vis;

        if (delta === 0) {
          card.classList.add('is-active');
        } else {
          card.classList.remove('is-active');
        }
      });

      if (dots.length) {
        dots.forEach((dot, idx) => {
          if (idx === currentIndex) {
            dot.classList.add('active');
            dot.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          } else {
            dot.classList.remove('active');
          }
        });
      }

      if (counterBadge) {
        counterBadge.textContent = `${currentIndex + 1} / ${total}`;
      }
    }

    function goTo(targetIdx) {
      if (total <= 1) return;
      currentIndex = ((targetIdx % total) + total) % total;
      updatePositions();
    }

    function next() {
      goTo(currentIndex + 1);
    }

    function prev() {
      goTo(currentIndex - 1);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(next, 4800);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        if (currentIndex !== idx) {
          goTo(idx);
          resetAutoPlay();
        }
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prev();
        resetAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        next();
        resetAutoPlay();
      });
    }

    stage.setAttribute('tabindex', '0');
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prev();
        resetAutoPlay();
      } else if (e.key === 'ArrowRight') {
        next();
        resetAutoPlay();
      }
    });

    let touchStartX = 0;
    let touchStartY = 0;
    let touchDeltaX = 0;
    let isHorizontalSwipe = null;

    stage.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchDeltaX = 0;
      isHorizontalSwipe = null;
      stopAutoPlay();
    }, { passive: true });

    stage.addEventListener('touchmove', (e) => {
      if (e.touches.length > 1) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      touchDeltaX = currentX - touchStartX;
      const deltaY = Math.abs(currentY - touchStartY);

      if (isHorizontalSwipe === null) {
        if (Math.abs(touchDeltaX) > 8 || deltaY > 8) {
          isHorizontalSwipe = Math.abs(touchDeltaX) > deltaY;
        }
      }
    }, { passive: true });

    stage.addEventListener('touchend', () => {
      if (isHorizontalSwipe) {
        if (touchDeltaX < -45) {
          next();
        } else if (touchDeltaX > 45) {
          prev();
        }
      }
      startAutoPlay();
    }, { passive: true });

    stage.addEventListener('mouseenter', stopAutoPlay);
    stage.addEventListener('mouseleave', startAutoPlay);

    updatePositions();
    startAutoPlay();

    return {
      updatePositions,
      next,
      prev,
      goTo
    };
  }

  // =========================================================
  // App Orchestration (Single Global Initialization)
  // =========================================================
  let scrollStackInstance = null;
  let journeyTimelineInstance = null;

  function onScrollHandler(e) {
    const scrollY = (e && typeof e.scroll === 'number') ? e.scroll : window.scrollY;
    if (scrollStackInstance) scrollStackInstance.update(scrollY);
    if (journeyTimelineInstance) journeyTimelineInstance.update(scrollY);
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
    if (journeyTimelineInstance) {
      journeyTimelineInstance.measure();
      journeyTimelineInstance.update(window.scrollY);
    }
    if (hackathonCarouselInstance) {
      hackathonCarouselInstance.updatePositions();
    }
    updateNavbarVisibility(window.scrollY);
  }

  // =========================================================
  // Interactive Brie Mascot Navbar Interaction
  // =========================================================
  function initBrieNavbar() {
    const navContainer = document.querySelector('.glass-nav-container');
    const navLinksContainer = document.querySelector('.glass-nav-links');
    if (!navContainer || !navLinksContainer) return;

    let mascot = navContainer.querySelector('.brie-nav-mascot');
    let isNewMascot = false;

    if (!mascot) {
      isNewMascot = true;
      mascot = document.createElement('div');
      mascot.className = 'brie-nav-mascot';
      mascot.setAttribute('aria-hidden', 'true');
      mascot.style.opacity = '0';
      mascot.style.transition = 'none';

      const isSubFolder = window.location.pathname.includes('/events/');
      const mascotPath = isSubFolder ? '../assets/images/mascots/brie-navbar.svg' : 'assets/images/mascots/brie-navbar.svg';

      const img = document.createElement('img');
      img.src = mascotPath;
      img.alt = 'Brie Mascot';
      mascot.appendChild(img);
      navContainer.appendChild(mascot);
    }

    const navLinks = navLinksContainer.querySelectorAll('.glass-nav-link');
    let activeLink = navLinksContainer.querySelector('.glass-nav-link.active') || navLinks[0];
    let currentTargetLink = activeLink;

    function positionMascot(targetLink, animate = true) {
      if (!targetLink || !mascot) return;
      currentTargetLink = targetLink;

      const containerRect = navContainer.getBoundingClientRect();
      const linkRect = targetLink.getBoundingClientRect();

      if (linkRect.width === 0 && linkRect.height === 0) return;

      const mascotWidth = mascot.offsetWidth || 56;
      const mascotHeight = mascot.offsetHeight || 52;

      // Center horizontally over target item's bounding box
      const targetX = (linkRect.left - containerRect.left) + (linkRect.width / 2) - (mascotWidth / 2);

      // Position vertically relative to target item's top edge so paws overlap naturally (~10px overlap)
      const PAW_OVERLAP = 10;
      const targetY = (linkRect.top - containerRect.top) - mascotHeight + PAW_OVERLAP;

      if (!animate) {
        mascot.style.transition = 'none';
      }

      mascot.style.transform = `translate3d(${Math.round(targetX * 10) / 10}px, ${Math.round(targetY * 10) / 10}px, 0)`;

      if (!animate) {
        // Force reflow so transform is applied instantly before transition is enabled
        void mascot.offsetHeight;
        requestAnimationFrame(() => {
          mascot.style.opacity = '1';
          setTimeout(() => {
            mascot.style.transition = '';
          }, 50);
        });
      } else {
        mascot.style.opacity = '1';
      }
    }

    // Immediate non-animated initial positioning above the active link
    positionMascot(activeLink, false);

    const imgElement = mascot.querySelector('img');
    if (imgElement) {
      if (imgElement.complete) {
        positionMascot(activeLink, false);
      } else {
        imgElement.addEventListener('load', () => {
          positionMascot(currentTargetLink || activeLink, false);
        });
      }
    }

    // Hover bindings
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        positionMascot(link, true);
      });
    });

    navContainer.addEventListener('mouseleave', () => {
      activeLink = navLinksContainer.querySelector('.glass-nav-link.active') || navLinks[0];
      positionMascot(activeLink, true);
    });

    window.addEventListener('resize', () => {
      activeLink = navLinksContainer.querySelector('.glass-nav-link.active') || navLinks[0];
      positionMascot(currentTargetLink || activeLink, false);
    });
  }

  // =========================================================
  // Praxis Mascot One-Time Announcement Playback Controller
  // Triggers AFTER the landing loading animation completes & Hero opens.
  // =========================================================
  function initHeroMascotController() {
    const heroMascot = document.querySelector('.hero-mascot-webp');
    if (!heroMascot) return;

    let baseSrc = heroMascot.getAttribute('data-src');
    if (!baseSrc) {
      baseSrc = heroMascot.getAttribute('src').split('?')[0];
      heroMascot.setAttribute('data-src', baseSrc);
    }

    const WEBP_SINGLE_PLAY_DURATION = 10000; // Exact 10.0s WebP sequence
    let isTriggered = false;

    // 1. Initially hidden while landing loading animation plays
    heroMascot.classList.add('hero-mascot-delayed');
    heroMascot.style.visibility = 'hidden';
    heroMascot.style.opacity = '0';
    heroMascot.setAttribute('src', '');

    function startSequence() {
      if (isTriggered) return;
      isTriggered = true;

      // 2. Wait 1 second (1000ms) after Hero page opens
      setTimeout(() => {
        // 3. Attach fresh timestamp URL to play WebP animation from frame 1
        const freshSrc = baseSrc + '?t=' + Date.now();
        heroMascot.setAttribute('src', freshSrc);

        // 4. Mascot comes out
        heroMascot.classList.remove('hero-mascot-delayed');
        heroMascot.style.visibility = 'visible';
        heroMascot.style.opacity = '1';

        // 5. After WebP animation finishes (10 seconds), hide immediately
        setTimeout(() => {
          heroMascot.classList.add('hero-mascot-delayed');
          heroMascot.style.visibility = 'hidden';
          heroMascot.style.opacity = '0';
          heroMascot.setAttribute('src', '');
        }, WEBP_SINGLE_PLAY_DURATION);
      }, 1000);
    }

    const loadingScreen = document.getElementById('mlsc-loading-screen');
    if (loadingScreen && !window.__mlscLandingComplete && !loadingScreen.classList.contains('loading-hidden')) {
      // Wait for landing loading animation to complete and hero page to open
      window.addEventListener('mlsc-landing-complete', startSequence, { once: true });
    } else {
      // If no loading screen or already completed, start sequence
      startSequence();
    }
  }

  // =========================================================
  // Stack Cards Rive Mascot State Controller (brie_animation.riv)
  // Active only during the Stack Cards section & bounded above footer.
  // =========================================================
  let riveInstance = null;
  let isRiveInitialized = false;

  function initStackCardsRiveMascot() {
    const riveCanvas = document.getElementById('brie-rive-canvas');
    const riveWrapper = document.getElementById('brie-rive-wrapper');
    const exploreSection = document.getElementById('explore');
    const footerElement = document.getElementById('footer');

    if (!riveCanvas || !riveWrapper || !exploreSection) return;

    // Load Rive Animation Asset with explicit Artboard & State Machine
    if (typeof rive !== 'undefined' && !isRiveInitialized) {
      isRiveInitialized = true;
      try {
        riveInstance = new rive.Rive({
          src: 'assets/animation/brie_animation.riv',
          canvas: riveCanvas,
          artboard: 'Artboard 1',
          stateMachines: 'State Machine 1',
          autoplay: true,
          layout: new rive.Layout({
            fit: rive.Fit.Contain,
            alignment: rive.Alignment.Center
          }),
          onLoad: () => {
            if (riveInstance) {
              riveInstance.resizeDrawingSurfaceToCanvas();
            }
          },
          onLoadError: (err) => {
            console.error('Rive animation load error:', err);
            try {
              riveInstance = new rive.Rive({
                src: 'assets/animation/brie_animation.riv',
                canvas: riveCanvas,
                artboard: 'Artboard 1',
                animations: 'Timeline 1',
                autoplay: true,
                onLoad: () => {
                  if (riveInstance) riveInstance.resizeDrawingSurfaceToCanvas();
                }
              });
            } catch (fallbackErr) {
              console.error('Rive fallback load error:', fallbackErr);
            }
          }
        });
      } catch (err) {
        console.error('Rive initialization exception:', err);
      }
    }

    // ScrollTrigger Controller for Stack Cards Rive Mascot
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: exploreSection,
        start: 'top 25%',
        endTrigger: footerElement || exploreSection,
        end: 'top 90%',
        onEnter: () => {
          gsap.to(riveWrapper, {
            opacity: 1,
            duration: 0.4,
            overwrite: 'auto',
            onStart: () => gsap.set(riveWrapper, { visibility: 'visible' })
          });
        },
        onLeave: () => {
          gsap.to(riveWrapper, {
            opacity: 0,
            duration: 0.3,
            overwrite: 'auto',
            onComplete: () => gsap.set(riveWrapper, { visibility: 'hidden' })
          });
        },
        onEnterBack: () => {
          gsap.to(riveWrapper, {
            opacity: 1,
            duration: 0.4,
            overwrite: 'auto',
            onStart: () => gsap.set(riveWrapper, { visibility: 'visible' })
          });
        },
        onLeaveBack: () => {
          gsap.to(riveWrapper, {
            opacity: 0,
            duration: 0.3,
            overwrite: 'auto',
            onComplete: () => gsap.set(riveWrapper, { visibility: 'hidden' })
          });
        }
      });
    }
  }

  // =========================================================
  // Achievements Page Mascot (achieve.webp) Entrance & Scroll Controller
  // Triggers smooth entrance from lower-left upon page mount, smooth scroll tracking & fade-out
  // =========================================================
  function initAchievementsMascotController() {
    const achievementsMascot = document.getElementById('achievements-mascot-wrapper');
    if (!achievementsMascot) return;

    // Trigger entrance animation on page mount / load
    requestAnimationFrame(() => {
      achievementsMascot.classList.add('animate-entrance');
    });

    const heroSection = achievementsMascot.closest('.hero-section') || document.getElementById('hero');
    if (!heroSection) return;

    let targetScrollY = window.scrollY;
    let smoothScrollY = window.scrollY;
    let isTicking = false;

    function renderParallax() {
      smoothScrollY += (targetScrollY - smoothScrollY) * 0.12;
      const heroHeight = heroSection.offsetHeight || window.innerHeight;
      const progress = Math.max(0, Math.min(1, smoothScrollY / (heroHeight * 0.65)));

      // Smooth subtle parallax + fade out before hero section ends
      const fadeOutOpacity = Math.max(0, 1 - Math.pow(progress, 1.4));
      const translateY = progress * 40; // Gentle downward drift on scroll

      if (typeof gsap !== 'undefined') {
        gsap.set(achievementsMascot, {
          opacity: fadeOutOpacity,
          y: translateY,
          force3D: true,
          overwrite: 'auto'
        });
      } else {
        achievementsMascot.style.opacity = fadeOutOpacity;
        achievementsMascot.style.transform = `translate3d(0, ${translateY}px, 0)`;
      }

      if (Math.abs(targetScrollY - smoothScrollY) > 0.05) {
        requestAnimationFrame(renderParallax);
      } else {
        isTicking = false;
      }
    }

    function onScroll(currentScrollY) {
      targetScrollY = typeof currentScrollY === 'number' ? currentScrollY : window.scrollY;
      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(renderParallax);
      }
    }

    if (window.lenis) {
      window.lenis.on('scroll', (e) => onScroll(e.scroll));
    } else {
      window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
    }
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
    initDualMascotScrollController();
    journeyTimelineInstance = initJourneyTimeline();
    hackathonCarouselInstance = initHackathonWinnersCarousel();
    initLeaderboard();
    initBrieNavbar();
    initHeroMascotController();
    initStackCardsRiveMascot();
    initAchievementsMascotController();

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
