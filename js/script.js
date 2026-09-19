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

    function updateTimeline(customScrollTop) {
      const scrollTop = typeof customScrollTop === 'number' ? customScrollTop : window.scrollY;

      if (!isMobile) {
        // Desktop Pinned Horizontal Scroll-Driven Progress
        const relY = scrollTop - cachedSectionTop;

        // Pin the visual viewport container while user scrolls through Our Journey
        let translateY = 0;
        if (relY >= 0 && relY <= cachedScrollDistance) {
          translateY = relY;
        } else if (relY > cachedScrollDistance) {
          translateY = cachedScrollDistance; // Release at the bottom of the section
        } else {
          translateY = 0;
        }

        if (stickyContainer) {
          stickyContainer.style.transform = `translate3d(0, ${Math.round(translateY * 10) / 10}px, 0)`;
        }

        // Progress strictly mapped to the scroll distance inside Our Journey
        const progress = Math.min(1, Math.max(0, relY / cachedScrollDistance));

        // Smoothly fill bright blue line from left to right
        lineFill.style.transform = `translateY(-50%) scaleX(${progress})`;

        // Activate milestones as the line reaches each dot
        const count = milestoneItems.length;
        milestoneItems.forEach((item, index) => {
          const target = index === 0 ? 0 : (index / (count - 1)) * 0.96;
          if (progress >= target) {
            if (!item.classList.contains('is-active')) item.classList.add('is-active');
          } else {
            if (item.classList.contains('is-active')) item.classList.remove('is-active');
          }
        });
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

  let isAppInitialized = false;
  function initApp() {
    if (isAppInitialized) return;
    isAppInitialized = true;

    measureHero();
    renderCanvas();
    const lenis = initGlobalLenis();
    scrollStackInstance = initScrollStack();
    initScrollAnimations();
    journeyTimelineInstance = initJourneyTimeline();
    initLeaderboard();
    initBrieNavbar();

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
