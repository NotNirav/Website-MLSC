/**
 * MLSC — Teams / Members Multi-Section Carousel Engine
 * Dynamically loads static team dataset from data/teams.csv
 */

(function () {
  'use strict';

  // =========================================================
  // 1. DOMAIN CONFIGURATION & ORDER
  // =========================================================
  const DOMAIN_ORDER = [
    {
      id: 'core-team',
      name: 'Core Team',
      tag: '01 // LEADERSHIP & STRATEGY',
      title: 'Core Leadership',
      desc: 'Steering the chapter vision, institutional partnerships, and campus initiatives.',
      accentColor: '#ffb900'
    },
    {
      id: 'ai-ml',
      name: 'AI / ML',
      tag: '02 // ARTIFICIAL INTELLIGENCE',
      title: 'AI / ML & Data Intelligence',
      desc: 'Building neural systems, computer vision models, LLMs, and predictive data pipelines.',
      accentColor: '#34d399'
    },
    {
      id: 'web-development',
      name: 'Web Development',
      tag: '03 // WEB & CLOUD SYSTEMS',
      title: 'Web & Platform Engineering',
      desc: 'Architecting high-performance portals, serverless APIs, cloud infrastructure, and Web3 tools.',
      accentColor: '#38bdf8'
    },
    {
      id: 'ui-ux-design',
      name: 'UI / UX & Design',
      tag: '04 // CREATIVE & EXPERIENCE',
      title: 'UI / UX & Brand Design',
      desc: 'Designing intuitive user interfaces, visual design systems, brand identities, and motion graphics.',
      accentColor: '#ec4899'
    },
    {
      id: 'events-operations',
      name: 'Events & Operations',
      tag: '05 // OPERATIONS & OUTREACH',
      title: 'Events & Community Operations',
      desc: 'Managing flagship BlueBit hackathons, speaker series, corporate sponsorships, and campus outreach.',
      accentColor: '#f25022'
    },
    {
      id: 'cp',
      name: 'CP',
      tag: '06 // ALGORITHMIC ENGINEERING',
      title: 'Competitive Programming',
      desc: 'Optimizing algorithmic data structures, problem solving, and competitive coding mastery.',
      accentColor: '#a855f7'
    }
  ];

  // SVG Icons
  const GITHUB_SVG = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" style="pointer-events: none;">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>`;

  const LINKEDIN_SVG = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" style="pointer-events: none;">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>`;

  const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 290 215'%3E%3Crect width='100%25' height='100%25' fill='%23131724'/%3E%3C/svg%3E";

  // =========================================================
  // 2. PRECOMPUTED 3D CAROUSEL TRANSFORMS LOOK-UP TABLE (LUT)
  // =========================================================
  const TRANSFORM_LUT = {
    mobile: {
      0: { transform: 'translate3d(-50%, -50%, 0px) scale(1) rotateY(0deg)', opacity: '1', zIndex: '20', pe: 'auto', vis: 'visible' },
      '+1': { transform: 'translate3d(calc(-50% + 75px), -50%, -40px) scale(0.82) rotateY(-10deg)', opacity: '0.25', zIndex: '4', pe: 'auto', vis: 'visible' },
      '-1': { transform: 'translate3d(calc(-50% - 75px), -50%, -40px) scale(0.82) rotateY(10deg)', opacity: '0.25', zIndex: '4', pe: 'auto', vis: 'visible' },
      dormant: { transform: 'translate3d(-50%, -50%, -120px) scale(0.6)', opacity: '0', zIndex: '1', pe: 'none', vis: 'hidden' }
    },
    tablet: {
      0: { transform: 'translate3d(-50%, -50%, 0px) scale(1) rotateY(0deg)', opacity: '1', zIndex: '20', pe: 'auto', vis: 'visible' },
      '+1': { transform: 'translate3d(calc(-50% + 185px), -50%, -40px) scale(0.86) rotateY(-14deg)', opacity: '0.92', zIndex: '10', pe: 'auto', vis: 'visible' },
      '-1': { transform: 'translate3d(calc(-50% - 185px), -50%, -40px) scale(0.86) rotateY(14deg)', opacity: '0.92', zIndex: '10', pe: 'auto', vis: 'visible' },
      '+2': { transform: 'translate3d(calc(-50% + 330px), -50%, -85px) scale(0.74) rotateY(-24deg)', opacity: '0.78', zIndex: '6', pe: 'auto', vis: 'visible' },
      '-2': { transform: 'translate3d(calc(-50% - 330px), -50%, -85px) scale(0.74) rotateY(24deg)', opacity: '0.78', zIndex: '6', pe: 'auto', vis: 'visible' },
      '+3': { transform: 'translate3d(calc(-50% + 440px), -50%, -140px) scale(0.6) rotateY(-34deg)', opacity: '0', zIndex: '1', pe: 'none', vis: 'hidden' },
      '-3': { transform: 'translate3d(calc(-50% - 440px), -50%, -140px) scale(0.6) rotateY(34deg)', opacity: '0', zIndex: '1', pe: 'none', vis: 'hidden' },
      dormant: { transform: 'translate3d(-50%, -50%, -140px) scale(0.6) rotateY(0deg)', opacity: '0', zIndex: '1', pe: 'none', vis: 'hidden' }
    },
    desktop: {
      0: { transform: 'translate3d(-50%, -50%, 0px) scale(1) rotateY(0deg)', opacity: '1', zIndex: '20', pe: 'auto', vis: 'visible' },
      '+1': { transform: 'translate3d(calc(-50% + 225px), -50%, -45px) scale(0.88) rotateY(-16deg)', opacity: '0.94', zIndex: '12', pe: 'auto', vis: 'visible' },
      '-1': { transform: 'translate3d(calc(-50% - 225px), -50%, -45px) scale(0.88) rotateY(16deg)', opacity: '0.94', zIndex: '12', pe: 'auto', vis: 'visible' },
      '+2': { transform: 'translate3d(calc(-50% + 415px), -50%, -90px) scale(0.77) rotateY(-28deg)', opacity: '0.84', zIndex: '7', pe: 'auto', vis: 'visible' },
      '-2': { transform: 'translate3d(calc(-50% - 415px), -50%, -90px) scale(0.77) rotateY(28deg)', opacity: '0.84', zIndex: '7', pe: 'auto', vis: 'visible' },
      '+3': { transform: 'translate3d(calc(-50% + 520px), -50%, -160px) scale(0.62) rotateY(-38deg)', opacity: '0', zIndex: '1', pe: 'none', vis: 'hidden' },
      '-3': { transform: 'translate3d(calc(-50% - 520px), -50%, -160px) scale(0.62) rotateY(38deg)', opacity: '0', zIndex: '1', pe: 'none', vis: 'hidden' },
      dormant: { transform: 'translate3d(-50%, -50%, -160px) scale(0.62) rotateY(0deg)', opacity: '0', zIndex: '1', pe: 'none', vis: 'hidden' }
    }
  };

  function getDeviceType() {
    const w = window.innerWidth;
    if (w <= 640) return 'mobile';
    if (w <= 1024) return 'tablet';
    return 'desktop';
  }

  function getCardPreset(device, delta) {
    const lut = TRANSFORM_LUT[device];
    if (delta === 0) return lut[0];
    if (delta === 'dormant') return lut.dormant || lut['+3'];
    if (device === 'mobile') {
      if (delta === 1) return lut['+1'];
      if (delta === -1) return lut['-1'];
      return lut.dormant || lut['+3'];
    }
    const key = (delta > 0 ? '+' : '') + delta;
    if (lut[key]) return lut[key];
    return delta > 0 ? (lut['+3'] || lut.dormant) : (lut['-3'] || lut.dormant);
  }

  function computeCardDelta(cardIdx, currentIdx, total) {
    if (total <= 1) return 0;
    let diff = cardIdx - currentIdx;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    if (diff === -total / 2 && total % 2 === 0) diff = total / 2;
    return diff;
  }

  // =========================================================
  // 3. TEAM CAROUSEL INSTANCE CLASS
  // =========================================================
  class TeamCarousel {
    constructor(domainInfo, members, containerEl) {
      this.domainInfo = domainInfo;
      this.members = members;
      this.containerEl = containerEl;
      this.currentIndex = 0;
      this.cardElements = [];
      this.autoPlayTimer = null;
      this.trackEl = null;

      this.init();
    }

    init() {
      const isSingle = this.members.length === 1;

      if (isSingle) {
        this.renderSingleMember();
      } else {
        this.renderCarousel();
      }
    }

    renderSingleMember() {
      const member = this.members[0];
      const stage = document.createElement('div');
      stage.className = 'team-showcase-single';

      const card = createCardElement(member, 0, 0, 1, this.domainInfo.accentColor);
      stage.appendChild(card);
      this.containerEl.appendChild(stage);
    }

    renderCarousel() {
      const stage = document.createElement('div');
      stage.className = 'teams-carousel-stage';

      // Prev Button
      const prevBtn = document.createElement('button');
      prevBtn.className = 'teams-nav-btn prev';
      prevBtn.setAttribute('aria-label', `Previous ${this.domainInfo.name} member`);
      prevBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>`;

      // Next Button
      const nextBtn = document.createElement('button');
      nextBtn.className = 'teams-nav-btn next';
      nextBtn.setAttribute('aria-label', `Next ${this.domainInfo.name} member`);
      nextBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>`;

      // Track
      this.trackEl = document.createElement('div');
      this.trackEl.className = 'teams-cards-track';
      this.trackEl.setAttribute('role', 'region');
      this.trackEl.setAttribute('aria-label', `${this.domainInfo.name} members carousel`);

      const total = this.members.length;
      this.members.forEach((member, idx) => {
        const card = createCardElement(member, idx, this.currentIndex, total, this.domainInfo.accentColor);
        card.addEventListener('click', (e) => {
          if (e.target.closest('.team-social-btn')) return;
          if (this.currentIndex !== idx) {
            this.goToIndex(idx);
            this.resetAutoPlay();
          }
        });
        this.trackEl.appendChild(card);
        this.cardElements.push(card);
      });

      stage.appendChild(prevBtn);
      stage.appendChild(nextBtn);
      stage.appendChild(this.trackEl);
      this.containerEl.appendChild(stage);

      // Event Listeners
      prevBtn.addEventListener('click', () => { this.prev(); this.resetAutoPlay(); });
      nextBtn.addEventListener('click', () => { this.next(); this.resetAutoPlay(); });

      this.setupGestures(stage);

      // Autoplay with hover-pause
      stage.addEventListener('mouseenter', () => this.stopAutoPlay());
      stage.addEventListener('mouseleave', () => this.startAutoPlay());

      this.updatePositions();
      this.startAutoPlay();
    }

    setupGestures(stage) {
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
        this.stopAutoPlay();
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
            this.next();
          } else if (touchDeltaX > 45) {
            this.prev();
          }
        }
        this.startAutoPlay();
      }, { passive: true });
    }

    goToIndex(targetIdx) {
      const total = this.members.length;
      if (total <= 1) return;
      this.currentIndex = ((targetIdx % total) + total) % total;
      this.updatePositions();
    }

    next() {
      this.goToIndex(this.currentIndex + 1);
    }

    prev() {
      this.goToIndex(this.currentIndex - 1);
    }

    updatePositions() {
      if (!this.cardElements.length) return;
      const total = this.members.length;
      const device = getDeviceType();

      for (let i = 0; i < total; i++) {
        const card = this.cardElements[i];
        const delta = computeCardDelta(i, this.currentIndex, total);
        const preset = getCardPreset(device, delta);

        card.style.transform = preset.transform;
        card.style.opacity = preset.opacity;
        card.style.zIndex = preset.zIndex;
        card.style.pointerEvents = preset.pe;
        card.style.visibility = preset.vis;

        if (delta === 0) {
          card.classList.add('is-active');
          card.style.setProperty('--active-accent', this.domainInfo.accentColor);
        } else {
          card.classList.remove('is-active');
        }

        // Lazy load image if entering visible arc
        if (delta !== 'dormant' && Math.abs(delta) <= 2) {
          const img = card.querySelector('.team-card-image');
          if (img && img.getAttribute('data-src')) {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
          }
        }
      }
    }

    startAutoPlay() {
      if (this.members.length <= 1) return;
      this.stopAutoPlay();
      this.autoPlayTimer = setInterval(() => {
        this.next();
      }, 4200 + Math.random() * 400);
    }

    stopAutoPlay() {
      if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer);
        this.autoPlayTimer = null;
      }
    }

    resetAutoPlay() {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }

  // =========================================================
  // 4. HELPER: CREATE MEMBER CARD ELEMENT
  // =========================================================
  function createCardElement(member, idx, currentIdx, total, fallbackAccent) {
    const card = document.createElement('div');
    card.className = 'team-card';
    card.setAttribute('data-index', idx);
    card.setAttribute('role', 'group');
    card.setAttribute('aria-label', `${member.name} - ${member.role}`);

    const githubUrl = member.github || 'https://github.com';
    const linkedinUrl = member.linkedin || 'https://linkedin.com';
    const accent = member.accentColor || fallbackAccent || '#38bdf8';

    const delta = computeCardDelta(idx, currentIdx, total);
    const isInitiallyVisible = total === 1 || (delta !== 'dormant' && Math.abs(delta) <= 2);
    const initialSrc = isInitiallyVisible ? member.image : PLACEHOLDER_IMG;
    const dataSrcAttr = isInitiallyVisible ? '' : `data-src="${member.image}"`;

    card.innerHTML = `
      <div class="team-card-photo-box">
        <img class="team-card-image" src="${initialSrc}" ${dataSrcAttr} alt="${escapeHTML(member.name)}">
      </div>
      <div class="team-card-content">
        <div class="team-card-info-top">
          <h3 class="team-card-name">${escapeHTML(member.name)}</h3>
          <div class="team-card-role-row">
            <span class="team-card-role-badge" style="color: ${accent}; border-color: ${accent}55; background: ${accent}18;">
              ${escapeHTML(member.role)}
            </span>
          </div>
          ${member.subtext ? `
          <div class="team-card-academic">
            <span class="academic-cap">🎓</span>
            <span class="academic-text">${escapeHTML(member.subtext)}</span>
          </div>` : ''}
          <p class="team-card-about">${escapeHTML(member.bio)}</p>
        </div>
        <div class="team-card-footer">
          <div class="team-social-row">
            <a href="${githubUrl}" class="team-social-btn team-social-github" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(member.name)} GitHub" title="View GitHub Profile">
              ${GITHUB_SVG}
            </a>
            <a href="${linkedinUrl}" class="team-social-btn team-social-linkedin" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(member.name)} LinkedIn" title="View LinkedIn Profile">
              ${LINKEDIN_SVG}
            </a>
          </div>
        </div>
      </div>
    `;

    // Safe error handler for images without inline string escaping issues
    const imgEl = card.querySelector('.team-card-image');
    if (imgEl) {
      imgEl.addEventListener('error', function () {
        const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="210"><rect fill="%23191c28" width="280" height="210"/><text fill="%237dd3fc" x="50%" y="50%" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">${encodeURIComponent(member.name)}</text></svg>`;
        this.src = 'data:image/svg+xml;utf8,' + svgStr;
      }, { once: true });
    }

    // Prevent clicks on social links from bubbling up to carousel card rotation
    card.querySelectorAll('.team-social-btn').forEach(btn => {
      btn.addEventListener('pointerdown', (e) => e.stopPropagation());
      btn.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
      btn.addEventListener('mousedown', (e) => e.stopPropagation());
      btn.addEventListener('click', (e) => e.stopPropagation());
    });

    return card;
  }

  // =========================================================
  // 5. MAIN ENGINE & STATE
  // =========================================================
  let allMembers = [];
  let carouselInstances = [];
  let jumpNavContainer = null;
  let sectionsWrapper = null;
  let globalLenis = null;

  function normalizeTeamName(teamStr) {
    if (!teamStr) return 'Core Team';
    const clean = teamStr.trim();
    if (/^core/i.test(clean)) return 'Core Team';
    if (/^(ai|ml|ai\s*\/\s*ml)/i.test(clean)) return 'AI / ML';
    if (/^web/i.test(clean)) return 'Web Development';
    if (/^(ui|ux|ui\s*\/\s*ux|design)/i.test(clean)) return 'UI / UX & Design';
    if (/^(event|operation)/i.test(clean)) return 'Events & Operations';
    if (/^(cp|competitive)/i.test(clean)) return 'CP';
    return clean;
  }

  async function initTeamsPage() {
    jumpNavContainer = document.getElementById('teams-jump-container');
    sectionsWrapper = document.getElementById('teams-sections-wrapper');

    if (!sectionsWrapper) return;

    setupBgVideo();
    setupHomeStyleNavbar();
    setupLenisScroll();

    // Fetch static CSV data dynamically
    const members = await loadMembersCSV();

    if (members && members.length > 0) {
      allMembers = members;
      renderAllDomainSections();
    } else {
      showErrorState('Unable to load team data. Please check your network or try again later.');
    }

    // Resize listener to re-align carousel items
    window.addEventListener('resize', debounce(() => {
      carouselInstances.forEach(c => c.updatePositions());
    }, 60));

    // Page visibility listener
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        carouselInstances.forEach(c => c.stopAutoPlay());
      } else {
        carouselInstances.forEach(c => c.startAutoPlay());
      }
    });
  }

  // =========================================================
  // 6. RENDER ALL DOMAIN SECTIONS SEQUENTIALLY
  // =========================================================
  function renderAllDomainSections() {
    if (!sectionsWrapper) return;

    // Clean up existing carousels
    carouselInstances.forEach(c => c.stopAutoPlay());
    carouselInstances = [];

    sectionsWrapper.innerHTML = '';
    if (jumpNavContainer) jumpNavContainer.innerHTML = '';

    // Group members by normalized domain
    const membersByDomain = {};
    const domainsToRender = [...DOMAIN_ORDER];

    // Check for any custom domain names present in CSV
    allMembers.forEach(m => {
      const normTeam = normalizeTeamName(m.team);
      if (!membersByDomain[normTeam]) {
        membersByDomain[normTeam] = [];
      }
      membersByDomain[normTeam].push(m);

      // If this domain isn't in DOMAIN_ORDER, add it dynamically
      if (!domainsToRender.some(d => d.name.toLowerCase() === normTeam.toLowerCase())) {
        const slug = normTeam.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        domainsToRender.push({
          id: slug,
          name: normTeam,
          tag: `// ${normTeam.toUpperCase()}`,
          title: normTeam,
          desc: `Members and contributors in ${normTeam}.`,
          accentColor: m.accentColor || '#38bdf8'
        });
      }
    });

    // Render Jump Pills & Team Blocks
    domainsToRender.forEach(domain => {
      const domainMembers = membersByDomain[domain.name] || [];
      if (domainMembers.length === 0) return;

      // 1. Create Jump Nav Pill
      if (jumpNavContainer) {
        const pill = document.createElement('a');
        pill.className = 'teams-jump-btn';
        pill.href = `#domain-${domain.id}`;
        pill.setAttribute('data-domain', domain.name);
        pill.innerHTML = `
          <span>${escapeHTML(domain.name)}</span>
          <span class="teams-jump-count">${domainMembers.length}</span>
        `;
        pill.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.getElementById(`domain-${domain.id}`);
          if (target) {
            if (globalLenis) {
              globalLenis.scrollTo(target, { offset: -80 });
            } else {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        });
        jumpNavContainer.appendChild(pill);
      }

      // 2. Create Domain Section Block
      const block = document.createElement('section');
      block.className = 'team-domain-block';
      block.id = `domain-${domain.id}`;
      block.setAttribute('data-domain', domain.name);

      // Domain Header
      const header = document.createElement('div');
      header.className = 'team-domain-header';
      header.innerHTML = `
        <div class="team-domain-badge" style="color: ${domain.accentColor}; background: ${domain.accentColor}18; border-color: ${domain.accentColor}55;">
          <span class="team-domain-badge-dot" style="background: ${domain.accentColor}; box-shadow: 0 0 8px ${domain.accentColor};"></span>
          <span>${escapeHTML(domain.tag)}</span>
        </div>
        <h2 class="team-domain-title">${escapeHTML(domain.title)}</h2>
        <p class="team-domain-desc">${escapeHTML(domain.desc)}</p>
      `;
      block.appendChild(header);

      // Carousel / Showcase Container
      sectionsWrapper.appendChild(block);

      // Instantiate Carousel
      const instance = new TeamCarousel(domain, domainMembers, block);
      carouselInstances.push(instance);
    });

    setupScrollSpy();
  }

  // =========================================================
  // 7. SCROLL-SPY FOR STICKY JUMP NAV PILLS
  // =========================================================
  function setupScrollSpy() {
    if (!jumpNavContainer) return;
    const blocks = document.querySelectorAll('.team-domain-block');
    const pills = jumpNavContainer.querySelectorAll('.teams-jump-btn');

    if (!blocks.length || !pills.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const domain = entry.target.getAttribute('data-domain');
          pills.forEach(pill => {
            pill.classList.toggle('active', pill.getAttribute('data-domain') === domain);
          });
        }
      });
    }, {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    blocks.forEach(block => observer.observe(block));

    if (pills[0]) pills[0].classList.add('active');
  }

  // =========================================================
  // 8. CSV PARSER & FETCH ENGINE
  // =========================================================
  // Embedded fallback CSV dataset from data/teams.csv
  // Ensures seamless display when accessed via file:// protocol where fetch() is blocked by CORS origin null
  const FALLBACK_TEAMS_CSV = `id,name,tenure,team,role,subtext,bio,image,bgVideo,accentColor,github,linkedin
1,Mohit Patil,2025-2026,Core Team,President,2025–2026 Tenure,"Driving chapter vision, strategic initiatives, partnerships, and high-impact student tech programs.",assets/images/members/old_2025_mohit_patil.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ffb900,https://github.com/MohitPatil0965,https://www.linkedin.com/in/mohit-patil-632061289?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
2,Aaditya Deshpande,2025-2026,Events & Operations,Event Management Head,2025–2026 Tenure,"Directing flagship hackathons, technical speaker series, and participant experience.",assets/images/members/old_2025_aaditya_deshpande.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/desh-aaditya,https://www.linkedin.com/in/aaditya-deshpande-b90550292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
3,Smit Sawarkar,2025-2026,Events & Operations,Event Management Lead,2025–2026 Tenure,"Directing flagship hackathons, technical speaker series, and participant experience.",assets/images/members/old_2025_smit_sawarkar.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/smit-585,http://www.linkedin.com/in/smitsawarkar
4,Ananya Gawade,2025-2026,Events & Operations,Accounts and Finance Head,2025–2026 Tenure,"Managing chapter budget allocations, financial audits, and sponsor fund disbursement.",assets/images/members/old_2025_ananya_gawade.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/AnanyaGawade,http://www.linkedin.com/in/ananya-gawade
5,Bhumika Nehete,2025-2026,Events & Operations,Sponsorship and Marketing Head,2025–2026 Tenure,"Forging industry partnerships, corporate sponsorships, and campus marketing campaigns.",assets/images/members/old_2025_bhumika_nehete.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com,https://www.linkedin.com/in/bhumikanehete/
6,Arpita Patki,2025-2026,Events & Operations,Sponsorship and Marketing Lead,2025–2026 Tenure,"Forging industry partnerships, corporate sponsorships, and campus marketing campaigns.",assets/images/members/old_2025_arpita_patki.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/arpitapatki,https://www.linkedin.com/in/arpita-r-patki-3821b2312
7,Sarthak Bagde,2025-2026,Events & Operations,Sponsorship and Marketing Lead,2025–2026 Tenure,"Forging industry partnerships, corporate sponsorships, and campus marketing campaigns.",assets/images/members/old_2025_sarthak_bagde.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com,http://www.linkedin.com/in/sarthakbagde
8,Nandkishor Vasi,2025-2026,Web Development,Web Development Head,2025–2026 Tenure,"Architecting scalable web platforms, responsive portals, and mentoring club web developers.",assets/images/members/old_2025_nandkishor_vasi.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/nandkishor-vasi,https://linkedin.com/in/nandkishor-vasi
9,Aditya Gavali,2025-2026,Web Development,Web Development Lead,2025–2026 Tenure,"Architecting scalable web platforms, responsive portals, and mentoring club web developers.",assets/images/members/old_2025_aditya_gavali.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/Aditya2860,http://linkedin.com/in/aditya2860c
10,Rouchi Mahajan,2025-2026,AI / ML,AI/DS Head,2025–2026 Tenure,"Spearheading AI/ML research initiatives, neural model architectures, and data-driven systems.",assets/images/members/old_2025_rouchi_mahajan.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/rouchi-11,https://www.linkedin.com/in/rouchi-mahajan-94a4a7292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
11,Adway Aghor,2025-2026,AI / ML,AI/DS Lead,2025–2026 Tenure,"Spearheading AI/ML research initiatives, neural model architectures, and data-driven systems.",assets/images/members/old_2025_adway_aghor.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/adwayaghor,https://www.linkedin.com/in/adway-aghor-11060a292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
12,Pruthviraj Desale,2025-2026,CP,Competitive programming Head,2025–2026 Tenure,"Directing algorithmic bootcamps, contest strategies, and advanced problem-solving tracks.",assets/images/members/old_2025_pruthviraj_desale.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#a855f7,https://github.com/pruthviraj-desale,https://www.linkedin.com/in/pruthviraj-desale
13,Rushikesh Nakhale,2025-2026,CP,Competitive programming Lead,2025–2026 Tenure,"Directing algorithmic bootcamps, contest strategies, and advanced problem-solving tracks.",assets/images/members/old_2025_rushikesh_nakhale.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#a855f7,https://github.com/rushinakhale115,https://www.linkedin.com/in/rushikesh-nakhale
14,Kshitij Hedau,2025-2026,UI / UX & Design,Design and Media Head,2025–2026 Tenure,"Crafting unified brand identities, digital design systems, and creative visual guidelines.",assets/images/members/old_2025_kshitij_hedau.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/Herostomo,https://www.linkedin.com/in/kshitij-hedau-8084aa292/
15,Yashraj Rajapure,2025-2026,UI / UX & Design,Videography and Photography Head,2025–2026 Tenure,"Capturing high-energy chapter moments, keynote recaps, and producing cinematic event trailers.",assets/images/members/old_2025_yashraj_rajapure.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/YASHRAJ-81,https://www.linkedin.com/in/yashraj-rajapure-2929a0293/
16,Indranil Kenekar,2025-2026,UI / UX & Design,Videography Head,2025–2026 Tenure,"Capturing high-energy chapter moments, keynote recaps, and producing cinematic event trailers.",assets/images/members/old_2025_indranil_kenekar.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com,https://www.linkedin.com/in/indranil-kenekar-490550292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
17,Rachana Dixit,2025-2026,UI / UX & Design,Design and media Lead,2025–2026 Tenure,"Directing creative media collaterals, visual design, and social branding initiatives.",assets/images/members/old_2025_rachana_dixit.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/rachanadixit,https://www.linkedin.com/in/rachana-dixit-a8906b291
18,Samarth Waghrulkar,2025-2026,Web Development,Web Development Executive,2025–2026 Tenure,"Developing performant web applications, modern responsive interfaces, and robust APIs.",assets/images/members/old_2025_samarth_waghrulkar.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/Samarth-06,https://www.linkedin.com/in/samarth-waghrulkar-46b854323
19,Tanvi Jadhav,2025-2026,Events & Operations,Event Management Executive,2025–2026 Tenure,"Coordinating event logistics, participant registration flows, and workshop execution.",assets/images/members/old_2025_tanvi_jadhav.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/Tanvi-J-24,http://www.linkedin.com/in/tanvi-jadhav
20,Apoorv Arora,2025-2026,Events & Operations,Event Management Executive,2025–2026 Tenure,"Coordinating event logistics, participant registration flows, and workshop execution.",assets/images/members/old_2025_apoorv_arora.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/Apoorv0770,https://www.linkedin.com/in/apoorv-arora01?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
21,Narayan Ratnaparkhe,2025-2026,CP,CP Executive,2025–2026 Tenure,"Mastering advanced algorithms, data structures, and competitive contest problem solving.",assets/images/members/old_2025_narayan_ratnaparkhe.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#a855f7,https://github.com/Narayan-A-R,https://www.linkedin.com/in/narayan-ratnaparkhe-12a93b30a/
22,Sanjana Biyani,2025-2026,CP,CP Executive,2025–2026 Tenure,"Mastering advanced algorithms, data structures, and competitive contest problem solving.",assets/images/members/old_2025_sanjana_biyani.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#a855f7,https://github.com/sanjana-991,http://www.linkedin.com/in/sanjanabiyani
23,Veerbhadra Mahant,2025-2026,AI / ML,AI/DS Executive,2025–2026 Tenure,"Building intelligent models, computer vision pipelines, and predictive analytics.",assets/images/members/old_2025_veerbhadra_mahant.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/VeerbhadraMahant,https://www.linkedin.com/in/veerbhadra-mahant-9550672b1/
24,Trijal Khade,2025-2026,AI / ML,AI/DS Executive,2025–2026 Tenure,"Building intelligent models, computer vision pipelines, and predictive analytics.",assets/images/members/old_2025_trijal_khade.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/Trijalkhade,https://www.linkedin.com/in/trijalkhade
25,Ved Jadhav,2025-2026,UI / UX & Design,Design and Media Executive,2025–2026 Tenure,"Designing intuitive UI layouts, visual illustrations, and promotional creative assets.",assets/images/members/old_2025_ved_jadhav.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/ved-jadhav-10,https://www.linkedin.com/in/vedjadhav
26,Sumaira Mulla,2025-2026,UI / UX & Design,Design and Media Executive,2025–2026 Tenure,"Designing intuitive UI layouts, visual illustrations, and promotional creative assets.",assets/images/members/old_2025_sumaira_mulla.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/sumairamulla07,https://www.linkedin.com/in/sumaira-m-523588313/
27,Ninad Ashok Mande,2025-2026,Events & Operations,Management and Logistics Executive,2025–2026 Tenure,"Orchestrating hardware resources, venue infrastructure, and smooth event operations.",assets/images/members/old_2025_ninad_ashok_mande.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/ninad-byte,http://www.linkedin.com/in/ninad-mande-36737b251
28,Omkar Nikam,2025-2026,Events & Operations,Sponsorship and Marketing Executive,2025–2026 Tenure,"Driving sponsor outreach, promotional media strategy, and community engagement.",assets/images/members/old_2025_omkar_nikam.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/OMKAR-PSN,https://www.linkedin.com/in/omkar-nikam-436b27370/
29,Sharvil Patil,2025-2026,Events & Operations,Sponsorship and Marketing Executive,2025–2026 Tenure,"Driving sponsor outreach, promotional media strategy, and community engagement.",assets/images/members/old_2025_sharvil_patil.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/sharv18,http://www.linkedin.com/in/sharvil-patil-337ab1316
30,Madhav Khobare,2025-2026,Events & Operations,Sponsorship and Marketing Executive,2025–2026 Tenure,"Driving sponsor outreach, promotional media strategy, and community engagement.",assets/images/members/old_2025_madhav_khobare.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/MadhavK3,https://in.linkedin.com/in/madhav-khobare-782a0432a
31,Isha Thakur,2025-2026,Events & Operations,Sponsorship and Marketing Executive,2025–2026 Tenure,"Driving sponsor outreach, promotional media strategy, and community engagement.",assets/images/members/old_2025_isha_thakur.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/isha1296,https://www.linkedin.com/in/isha-thakur-80229a2a0/
32,Aryan Patel,2025-2026,Events & Operations,Accounts & Finance Executive,2025–2026 Tenure,"Managing chapter budget allocations, financial audits, and sponsor fund disbursement.",assets/images/members/old_2025_aryan_patel.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/aryan051106,https://www.linkedin.com/in/aryan-patel-a26a0632a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
33,Tejal Jadhav,2025-2026,Events & Operations,Accounts and Finance Executive,2025–2026 Tenure,"Managing chapter budget allocations, financial audits, and sponsor fund disbursement.",assets/images/members/old_2025_tejal_jadhav.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/TejalJ357,http://www.linkedin.com/in/tejal-j
34,Harsh Gulhane,2024-2025,Core Team,President,2024–2025 Tenure,"Driving chapter vision, strategic initiatives, partnerships, and high-impact student tech programs.",assets/images/members/old_2024_harsh_gulhane.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ffb900,https://github.com,https://www.linkedin.com/in/harsh-gulhane-78a484259/
35,Payal Pawar,2024-2025,Events & Operations,Event Management Head,2024–2025 Tenure,"Directing flagship hackathons, technical speaker series, and participant experience.",assets/images/members/old_2024_payal_pawar.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/payalpawar9579/payalpawar9579,http://www.linkedin.com/in/payal-pawar-357243288
36,Revati Keskar,2024-2025,Events & Operations,Sponsorship and Marketing Head,2024–2025 Tenure,"Forging industry partnerships, corporate sponsorships, and campus marketing campaigns.",assets/images/members/old_2024_revati_keskar.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/RevatiKeskar,https://www.linkedin.com/in/revatikeskar
37,Pawan Patil,2024-2025,Web Development,Web Development Lead,2024–2025 Tenure,"Architecting scalable web platforms, responsive portals, and mentoring club web developers.",assets/images/members/old_2024_pawan_patil.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/pawanp51,https://www.linkedin.com/in/pawan-patil51
38,Sarthak Joshi,2024-2025,Web Development,Web Development Head,2024–2025 Tenure,"Architecting scalable web platforms, responsive portals, and mentoring club web developers.",assets/images/members/old_2024_sarthak_joshi.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/Joshi-Sarthak,https://www.linkedin.com/in/sarthak-joshi-a98840259/
39,Adinath Yadav,2024-2025,CP,Competitive Programming Head,2024–2025 Tenure,"Directing algorithmic bootcamps, contest strategies, and advanced problem-solving tracks.",assets/images/members/old_2024_adinath_yadav.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#a855f7,https://github.com/adinathyadav2002,https://www.linkedin.com/in/adinath-yadav-50a294251/
40,Siddhesh Patil,2024-2025,CP,Competitive Programming Lead,2024–2025 Tenure,"Directing algorithmic bootcamps, contest strategies, and advanced problem-solving tracks.",assets/images/members/old_2024_siddhesh_patil.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#a855f7,https://github.com/siddhesh-patil,https://www.linkedin.com/in/siddhesh-patil
41,Tushar Badlani,2024-2025,AI / ML,AI/DS Head,2024–2025 Tenure,"Spearheading AI/ML research initiatives, neural model architectures, and data-driven systems.",assets/images/members/old_2024_tushar_badlani.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/tushar-badlani,https://www.linkedin.com/in/tushar-badlanii/
42,Anish Patade,2024-2025,AI / ML,AI/DS Lead,2024–2025 Tenure,"Spearheading AI/ML research initiatives, neural model architectures, and data-driven systems.",assets/images/members/old_2024_anish_patade.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/sensational03,https://www.linkedin.com/in/anish-patade-197967242/
43,Kunal Pawara,2024-2025,UI / UX & Design,Media Lead,2024–2025 Tenure,"Directing creative media collaterals, visual design, and social branding initiatives.",assets/images/members/old_2024_kunal_pawara.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/KunalPawara,https://www.linkedin.com/in/kunal-pawara2004/
44,Aaditya Deshpande,2024-2025,Events & Operations,Event Management Team,2024–2025 Tenure,"Coordinating event logistics, participant registration flows, and workshop execution.",assets/images/members/old_2024_aaditya_deshpande.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com,https://www.linkedin.com/in/aaditya-deshpande-b90550292
45,Smit Sawarkar,2024-2025,Events & Operations,Event Management Team,2024–2025 Tenure,"Coordinating event logistics, participant registration flows, and workshop execution.",assets/images/members/old_2024_smit_sawarkar.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com,https://www.linkedin.com/in/smit-sawarkar-016006324?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
46,Apoorv Arora,2024-2025,Events & Operations,Event Management Team,2024–2025 Tenure,"Coordinating event logistics, participant registration flows, and workshop execution.",assets/images/members/old_2024_apoorv_arora.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com,https://www.linkedin.com/in/apoorv-arora-77886727b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
47,Ananya Gawade,2024-2025,Events & Operations,Event Management Team,2024–2025 Tenure,"Coordinating event logistics, participant registration flows, and workshop execution.",assets/images/members/old_2024_ananya_gawade.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/AnanyaGawade,https://www.linkedin.com/in/ananya-gawade-613b46292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
48,Nishaad Gangal,2024-2025,CP,Competitive Programming Team,2024–2025 Tenure,"Mastering advanced algorithms, data structures, and competitive contest problem solving.",assets/images/members/old_2024_nishaad_gangal.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#a855f7,https://github.com/NishaadG,https://www.linkedin.com/in/nishaad-gangal-943210290?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
49,Rohan Adkine,2024-2025,CP,Competitive Programming Team,2024–2025 Tenure,"Mastering advanced algorithms, data structures, and competitive contest problem solving.",assets/images/members/old_2024_rohan_adkine.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#a855f7,https://github.com/RohanAdkine,https://www.linkedin.com/in/rohan-adkine-401630214/
50,Piyush Badgujar,2024-2025,Web Development,Web Development Team,2024–2025 Tenure,"Developing performant web applications, modern responsive interfaces, and robust APIs.",assets/images/members/old_2024_piyush_badgujar.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/piyushbagujar,http://www.linkedin.com/in/piyush-badgujar-jalgaon
51,Mohit Patil,2024-2025,Web Development,Web Development Team,2024–2025 Tenure,"Developing performant web applications, modern responsive interfaces, and robust APIs.",assets/images/members/old_2024_mohit_patil.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com,https://www.linkedin.com/in/mohit-patil-632061289?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
52,Keyura Motegaonkar,2024-2025,AI / ML,AI/DS Team,2024–2025 Tenure,"Building intelligent models, computer vision pipelines, and predictive analytics.",assets/images/members/old_2024_keyura_motegaonkar.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com,https://linkedin.com/in/keyura-motegaonkar-50043a25a
53,Varad Rane,2024-2025,AI / ML,AI/DS Team,2024–2025 Tenure,"Building intelligent models, computer vision pipelines, and predictive analytics.",assets/images/members/old_2024_varad_rane.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/VaradRane12,https://www.linkedin.com/in/varad-rane1244/
54,Kshitij Hedau,2024-2025,UI / UX & Design,Design Team,2024–2025 Tenure,"Designing intuitive UI layouts, visual illustrations, and promotional creative assets.",assets/images/members/old_2024_kshitij_hedau.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/Herostomo,https://www.linkedin.com/in/kshitij-hedau-8084aa292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
55,Sparsh Gandhi,2024-2025,UI / UX & Design,Design Team,2024–2025 Tenure,"Designing intuitive UI layouts, visual illustrations, and promotional creative assets.",assets/images/members/old_2024_sparsh_gandhi.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/sparsh3104,https://www.linkedin.com/in/sparsh-gandhi-224b84312
56,Rachana Dixit,2024-2025,UI / UX & Design,Design Team,2024–2025 Tenure,"Designing intuitive UI layouts, visual illustrations, and promotional creative assets.",assets/images/members/old_2024_rachana_dixit.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/rachanadixit,https://www.linkedin.com/in/rachana-dixit-a8906b291?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
57,Aniket Damedhar,2024-2025,UI / UX & Design,Design and media Team,2024–2025 Tenure,"Designing intuitive UI layouts, visual illustrations, and promotional creative assets.",assets/images/members/old_2024_aniket_damedhar.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/Aniket93227,https://www.linkedin.com/in/aniketd1604/
58,Shubhang Gandhi,2024-2025,UI / UX & Design,Design Team,2024–2025 Tenure,"Designing intuitive UI layouts, visual illustrations, and promotional creative assets.",assets/images/members/old_2024_shubhang_gandhi.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com,https://www.linkedin.com/in/shubhang-gandhi-634553292
59,Sarthak Bagde,2024-2025,Events & Operations,Sponsorship and Marketing Team,2024–2025 Tenure,"Driving sponsor outreach, promotional media strategy, and community engagement.",assets/images/members/old_2024_sarthak_bagde.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com,https://www.linkedin.com/in/sarthakbagde?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
60,Bhumika Nehete,2024-2025,Events & Operations,Sponsorship and Marketing Team,2024–2025 Tenure,"Driving sponsor outreach, promotional media strategy, and community engagement.",assets/images/members/old_2024_bhumika_nehete.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com,https://in.linkedin.com/in/bhumika-nehete-8023922bb
61,Amrita Iyer,2024-2025,Events & Operations,Sponsorship and Marketing Team,2024–2025 Tenure,"Driving sponsor outreach, promotional media strategy, and community engagement.",assets/images/members/old_2024_amrita_iyer.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com,https://linkedin.com
62,Indranil Kenekar,2024-2025,UI / UX & Design,Video editing and photography Team,2024–2025 Tenure,"Capturing high-energy chapter moments, keynote recaps, and producing cinematic event trailers.",assets/images/members/old_2024_indranil_kenekar.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com,https://www.linkedin.com/in/indranil-kenekar-490550292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
63,Yash Somwanshi,2024-2025,UI / UX & Design,Video editing and photography Team,2024–2025 Tenure,"Capturing high-energy chapter moments, keynote recaps, and producing cinematic event trailers.",assets/images/members/old_2024_yash_somwanshi.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/YashSomwanshi,https://www.linkedin.com/in/yash-somwanshi-3670b2292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
64,Ved Jadhav,Current Council,Core Team,President,TY CSE,"Driving strategic club vision, partnerships, and high-impact campus tech initiatives.",assets/images/members/Ved_Jadhav.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ffb900,https://github.com/vedjadhav,https://linkedin.com/in/vedjadhav
65,Sharvil Patil,Current Council,Core Team,Vice President,SY ENTC,"Directing flagship BlueBit hackathons, speaker series, and technical bootcamps.",assets/images/members/Sharvil_Patil.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/sharvilpatil,https://linkedin.com/in/sharvilpatil
66,Isha,Current Council,Core Team,General Secretary,SY ENTC,"Designing sleek wireframes, micro-interactions, and visual assets for club web portals.",assets/images/members/isha_.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/isha,https://linkedin.com/in/isha
67,Aryan Verma,Current Council,Core Team,Member,TY IT,"Empowering student innovators, driving technical culture, and leading MLSC to new heights.",assets/images/members/aryan.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ffb900,https://github.com/aryanverma,https://linkedin.com/in/aryanverma
68,Adii,Current Council,AI / ML,Logistics Coordinator,SY CSE,"Managing venue logistics, equipment routing, and high-energy hackathon hospitality.",assets/images/members/Adii.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/adii,https://linkedin.com/in/adii
69,Saksham Jagtap,Current Council,AI / ML,Executive Lead,TY CSE,Spearheading flagship hackathons and community developer engagement programs.,assets/images/members/Saksham Jagtap.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ffb900,https://github.com/sakshamjagtap,https://linkedin.com/in/sakshamjagtap
70,Kashvi Patki,Current Council,AI / ML,Member,SY CSE AIML,"Orchestrating community initiatives, club operations, and inter-chapter collaborations.",assets/images/members/Kashvi_Patki .jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ffb900,https://github.com/kashvipatki,https://linkedin.com/in/kashvipatki
71,Apurv Sagare,Current Council,AI / ML,Computer Vision Specialist,TY CSE,Developing real-time neural object detection models and visual edge computing pipelines.,assets/images/members/APURV SAGARE.jpeg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/apurvsagare,https://linkedin.com/in/apurvsagare
72,Arnav Kumar,Current Council,AI / ML,NLP & LLM Researcher,SY CSE AIML,Exploring open-weights language model fine-tuning and retrieval-augmented generation.,assets/images/members/Arnav Kumar.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/arnavkumar,https://linkedin.com/in/arnavkumar
73,Aryan Patel,Current Council,AI / ML,Deep Learning Engineer,SY CSE,Building deep neural networks and automated evaluation frameworks for ML systems.,assets/images/members/Aryan Patel.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/aryanpatel,https://linkedin.com/in/aryanpatel
74,Atindra Kumeriya,Current Council,AI / ML,ML Systems Engineer,SY IT,Optimizing tensor computation pipelines and building end-to-end predictive models.,assets/images/members/Atindra Kumeriya.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/atindrakumeriya,https://linkedin.com/in/atindrakumeriya
75,Avadhoot Chavan,Current Council,AI / ML,Data Science Specialist,TY CSE DS,Extracting actionable insights from high-dimensional datasets and statistical modelling.,assets/images/members/Avadhoot Chavan.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/avadhootchavan,https://linkedin.com/in/avadhootchavan
76,Chaitanya Jadhav,Current Council,AI / ML,Intelligent Agents Developer,SY CSE AIML,Prototyping multi-agent coordination frameworks and automated developer tooling.,assets/images/members/Chaitanya Jadhav.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/chaitanyajadhav,https://linkedin.com/in/chaitanyajadhav
77,Chinmay Ahire,Current Council,AI / ML,Neural Systems Researcher,TY CSE,Designing scalable model architectures and training pipelines for competitive hackathons.,assets/images/members/Chinmay_Ahire.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/chinmayahire,https://linkedin.com/in/chinmayahire
78,Devendra Adsure,Current Council,AI / ML,MLOps Engineer,SY IT,Containerizing ML workloads and deploying automated inference pipelines on cloud infrastructure.,assets/images/members/Devendra Adsure.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/devendraadsure,https://linkedin.com/in/devendraadsure
79,Madhav,Current Council,AI / ML,Edge AI Developer,SY CSE,Building lightweight inference runtimes on microcontrollers and embedded Linux boards.,assets/images/members/Madhav.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/madhav,https://linkedin.com/in/madhav
80,Rishabh Prabhu,Current Council,AI / ML,Generative AI Specialist,TY CSE AIML,Crafting multimodal pipelines and exploring generative media synthesis applications.,assets/images/members/Rishabh Prabhu.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/rishabhprabhu,https://linkedin.com/in/rishabhprabhu
81,Sanish Dalvi,Current Council,CP,Member,TY IT,Architecting robust systems and engineering scalable developer ecosystems across the chapter.,assets/images/members/Sanish Dalvi.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ffb900,https://github.com/SanishDalvi,https://linkedin.com/in/sanishdalvi
82,Shivanshi,Current Council,Web Development,Public Relations Lead,TY IT,"Fostering inter-collegiate outreach, speaker invitations, and technical media PR.",assets/images/members/shivanshi.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/shivanshi,https://linkedin.com/in/shivanshi
83,Srushti Gaikwad,Current Council,Events & Operations,Sponsorship & Outreach Lead,TY CSE,Spearheading partnerships with industry sponsors and community developer grants.,assets/images/members/Srushti Gaikwad.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/srushtigaikwad,https://linkedin.com/in/srushtigaikwad
84,Tanvi Jadhav,Current Council,Events & Operations,Hackathon Coordinator,SY ENTC,"Directing developer registration flows, mentor scheduling, and project evaluation tracks.",assets/images/members/Tanvi Jadhav.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/tanvijadhav,https://linkedin.com/in/tanvijadhav
85,Tejal Jadhav,Current Council,Events & Operations,Event Strategist,SY CSE,"Curating workshop curriculums, tech talk lineups, and interactive participant engagement.",assets/images/members/Tejal Jadhav.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/tejaljadhav,https://linkedin.com/in/tejaljadhav
86,Vaidehi Behare,Current Council,Events & Operations,Campus Outreach Lead,SY IT,Connecting student innovators across departments and managing community ambassador tracks.,assets/images/members/Vaidehi Behare.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/vaidehibehare,https://linkedin.com/in/vaidehibehare
87,Vaishnavi Marne,Current Council,Events & Operations,Delegate Relations Coordinator,SY ENTC,"Managing attendee communications, welcome kits, and post-event survey telemetry.",assets/images/members/Vaishnavi Marne .jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/vaishnavimarne,https://linkedin.com/in/vaishnavimarne
88,Sharvari Deshmukh,Current Council,UI / UX & Design,Design Head,SY IT,"Crafting intuitive visual design systems, interactive prototypes, and community branding.",assets/images/members/Sharvari_Deshmukh.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/sharvarideshmukh,https://linkedin.com/in/sharvarideshmukh
89,Amrita,Current Council,UI / UX & Design,Product Designer,SY CSE,Mapping user journeys and turning complex software architectures into clean interfaces.,assets/images/members/Amrita.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/amrita,https://linkedin.com/in/amrita
90,Amruta Thakare,Current Council,UI / UX & Design,Visual & Brand Designer,SY ENTC,"Defining visual design language, event identity kits, and typography guidelines.",assets/images/members/Amruta Thakare.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/amrutathakare,https://linkedin.com/in/amrutathakare
91,Anannya,Current Council,UI / UX & Design,UI/UX Researcher,SY IT,"Conducting usability testing, heuristic analysis, and prototyping sleek student workflows.",assets/images/members/Anannya.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/anannya,https://linkedin.com/in/anannya
92,Anjali Borse,Current Council,UI / UX & Design,Motion & Graphic Designer,TY CSE,"Creating dynamic motion graphics, keynote presentations, and marketing collaterals.",assets/images/members/Anjali Borse.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/anjaliborse,https://linkedin.com/in/anjaliborse
93,Deesha,Current Council,UI / UX & Design,Design Systems Specialist,SY CSE AIML,"Building scalable Figma component libraries, auto-layout tokens, and theme palettes.",assets/images/members/Deesha.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/deesha,https://linkedin.com/in/deesha
94,Khushi Kolhe,Current Council,UI / UX & Design,Experience Designer,TY IT,"Transforming hackathon participant workflows into intuitive, joyful user journeys.",assets/images/members/Khushi Kolhe.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/khushikolhe,https://linkedin.com/in/khushikolhe
95,Sanika Shinde,Current Council,UI / UX & Design,Creative Lead,SY IT,"Curating aesthetic club social media branding, posters, and digital promotional media.",assets/images/members/Sanika Shinde.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/sanikashinde,https://linkedin.com/in/sanikashinde
96,Samarth Wani,Current Council,Web Development,Strategy Lead,SY IT,Aligning technical programs with student developer needs and industry tech trends.,assets/images/members/Samarth_W.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ffb900,https://github.com/samarthwani,https://linkedin.com/in/samarthwani
97,Saumyaa Gupta,Current Council,Web Development,Community Lead,SY CSE,Fostering an inclusive developer ecosystem and empowering first-time hackathon builders.,assets/images/members/Saumyaa Gupta.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ffb900,https://github.com/saumyaagupta,https://linkedin.com/in/saumyaagupta
98,Badal Dadwani,Current Council,Web Development,Finance & Operations Lead,SY IT,"Managing club resources, sponsor allocations, and operational logistical pipelines.",assets/images/members/Badal Dadwani.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ffb900,https://github.com/badaldadwani,https://linkedin.com/in/badaldadwani
99,Pranav Narkhede,Current Council,Web Development,Web Development Head,TY IT,Architecting high-performance web platforms and mentoring club web developers.,assets/images/members/Pranav_Narkhede.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/pranavnarkhede,https://linkedin.com/in/pranavnarkhede
100,Aditya Deore,Current Council,Web Development,Full-Stack Developer,TY CSE,"Building reactive web applications with Next.js, Node.js microservices, and serverless stacks.",assets/images/members/Aditya Deore.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/adityadeore,https://linkedin.com/in/adityadeore
101,Aditya Gurav,Current Council,Web Development,Backend Systems Developer,SY IT,Designing resilient REST and GraphQL APIs backed by distributed caching layers.,assets/images/members/AdityaGurav.jpeg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/adityagurav,https://linkedin.com/in/adityagurav
102,Aditya Rajput,Current Council,Web Development,Frontend Architect,SY CSE,Crafting modern responsive interfaces with sleek micro-interactions and high-FPS animations.,assets/images/members/Aditya_Rajput.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/adityarajput,https://linkedin.com/in/adityarajput
103,Mahesh Shirame,Current Council,Web Development,Cloud & DevOps Engineer,TY CSE,"Automating CI/CD pipelines, Dockerized deployments, and club cloud infrastructure.",assets/images/members/Mahesh_Shirame.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/maheshshirame,https://linkedin.com/in/maheshshirame
104,Mayank Pawar,Current Council,Web Development,Full-Stack Developer,SY IT,Building seamless frontend user flows integrated with real-time WebSocket backend services.,assets/images/members/Mayank Pawar.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/mayankpawar,https://linkedin.com/in/mayankpawar
105,Nirav Neve,Current Council,Web Development,Systems & API Engineer,SY CSE,Engineering low-latency database queries and scalable authentication mechanisms.,assets/images/members/Nirav_Neve.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/niravneve,https://linkedin.com/in/niravneve
106,Palash,Current Council,Web Development,Frontend Specialist,SY ENTC,"Crafting accessible, pixel-perfect user experiences using modern CSS and TypeScript.",assets/images/members/Palash.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/palash,https://linkedin.com/in/palash
107,Parth Popli,Current Council,Web Development,Next.js Developer,SY CSE,Developing server-side rendered portals and optimized static web assets for club projects.,assets/images/members/Parth_Popli.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/parthpopli,https://linkedin.com/in/parthpopli
108,Prem Thakur,Current Council,Web Development,Backend Developer,SY IT,"Structuring relational schemas, handling event-driven queues, and securing API endpoints.",assets/images/members/prem thakur.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/premthakur,https://linkedin.com/in/premthakur
109,Yash Bhagodia,Current Council,Web Development,Web3 & Full-Stack Developer,TY IT,Bridging decentralized smart contracts with progressive client-side web applications.,assets/images/members/Yash Bhagodia_.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/yashbhagodia,https://linkedin.com/in/yashbhagodia`;

  async function loadMembersCSV() {
    const candidatePaths = ['./data/teams.csv', './data/members.csv', 'data/teams.csv', 'data/members.csv'];
    const timestamp = Date.now();

    // 1. Dynamic live fetch with cache buster (for HTTP/HTTPS web servers, e.g. http://localhost:3000)
    for (const csvPath of candidatePaths) {
      try {
        const response = await fetch(`${csvPath}?_=${timestamp}`);
        if (response && (response.ok || response.status === 200 || response.status === 0)) {
          const csvText = await response.text();
          if (csvText && csvText.trim().length > 0) {
            const parsed = parseCSV(csvText);
            if (parsed && parsed.length > 0) {
              return parsed;
            }
          }
        }
      } catch (err) {}
    }

    // 2. Secondary fetch without query parameter (for local environments that disallow query parameters on static files)
    for (const csvPath of candidatePaths) {
      try {
        const response = await fetch(csvPath);
        if (response && (response.ok || response.status === 200 || response.status === 0)) {
          const csvText = await response.text();
          if (csvText && csvText.trim().length > 0) {
            const parsed = parseCSV(csvText);
            if (parsed && parsed.length > 0) {
              return parsed;
            }
          }
        }
      } catch (err) {}
    }

    // 3. Fallback dataset (guarantees instant rendering under file:// protocol, network disconnect, or strict CORS)
    try {
      if (typeof FALLBACK_TEAMS_CSV === 'string' && FALLBACK_TEAMS_CSV.trim().length > 0) {
        const parsed = parseCSV(FALLBACK_TEAMS_CSV);
        if (parsed && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Fallback CSV parse error:', e);
    }

    console.error('Error loading team CSV data from all paths and fallback');
    return null;
  }

  function parseCSV(text) {
    if (!text || typeof text !== 'string') return null;
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return null;

    const rawHeaders = parseCSVRow(lines[0]);
    const headers = rawHeaders.map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = parseCSVRow(line);
      const entry = {};

      for (let j = 0; j < headers.length; j++) {
        entry[headers[j]] = values[j] !== undefined ? values[j] : '';
      }

      if (entry.name) {
        const team = normalizeTeamName(entry.team || entry.teamtype || 'Core Team');
        const role = entry.role || 'Team Member';

        let defaultAccent = '#38bdf8';
        if (team === 'Core Team') defaultAccent = '#ffb900';
        else if (team === 'AI / ML') defaultAccent = '#34d399';
        else if (team === 'Web Development') defaultAccent = '#38bdf8';
        else if (team === 'UI / UX & Design') defaultAccent = '#ec4899';
        else if (team === 'Events & Operations') defaultAccent = '#f25022';
        else if (team === 'CP') defaultAccent = '#a855f7';

        result.push({
          id: entry.id || String(i),
          name: entry.name,
          team: team,
          role: role,
          subtext: entry.subtext || '',
          bio: entry.bio || '',
          image: entry.image || 'assets/images/members/diya.jpg',
          bgVideo: entry.bgvideo || 'assets/videos/10405281-hd_3840_2160_30fps.mp4',
          accentColor: entry.accentcolor || defaultAccent,
          github: entry.github || 'https://github.com',
          linkedin: entry.linkedin || 'https://linkedin.com'
        });
      }
    }
    return result.length > 0 ? result : null;
  }

  function parseCSVRow(row) {
    const values = [];
    let insideQuote = false;
    let current = '';

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        if (insideQuote && row[i + 1] === '"') {
          current += '"';
          i++; // Skip escaped quote
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  }

  function showErrorState(msg) {
    if (!sectionsWrapper) return;
    sectionsWrapper.innerHTML = `
      <div class="teams-error-state" style="text-align: center; padding: 60px 20px; color: #f87171; font-family: 'Plus Jakarta Sans', sans-serif;">
        <div style="font-size: 2.2rem; margin-bottom: 12px;">⚠️</div>
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 8px; color: #fca5a5;">${escapeHTML(msg)}</h3>
        <p style="font-size: 0.9rem; color: #9ca3af; margin: 0;">Please ensure you are viewing over a web server (e.g. http://localhost) or refresh the page.</p>
      </div>
    `;
  }

  // =========================================================
  // 9. BACKGROUND VIDEO & NAVIGATION CONTROLLER
  // =========================================================
  function setupBgVideo() {
    const bgVideo = document.getElementById('teams-bg-video');
    if (!bgVideo) return;

    bgVideo.loop = true;

    const startPlayback = () => {
      if (bgVideo.paused) {
        const promise = bgVideo.play();
        if (promise !== undefined) {
          promise.catch(() => {
            const resumeOnInteract = () => {
              bgVideo.play().catch(() => {});
              window.removeEventListener('click', resumeOnInteract);
              window.removeEventListener('touchstart', resumeOnInteract);
            };
            window.addEventListener('click', resumeOnInteract, { once: true });
            window.addEventListener('touchstart', resumeOnInteract, { once: true });
          });
        }
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        bgVideo.pause();
      } else {
        startPlayback();
      }
    });

    requestAnimationFrame(() => startPlayback());
  }

  function setupHomeStyleNavbar() {
    const hamburgerBtn = document.getElementById('nav-hamburger');
    const sidebarDrawer = document.getElementById('sidebar-drawer');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const sidebarClose = document.getElementById('sidebar-close');

    if (!hamburgerBtn || !sidebarDrawer) return;

    const openSidebar = () => {
      sidebarDrawer.classList.add('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.add('open');
      hamburgerBtn.classList.add('hidden');
      document.body.classList.add('sidebar-open');
    };

    const closeSidebar = () => {
      sidebarDrawer.classList.remove('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.remove('open');
      hamburgerBtn.classList.remove('hidden');
      document.body.classList.remove('sidebar-open');
    };

    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openSidebar();
    });

    if (sidebarClose) {
      sidebarClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSidebar();
      });
    }

    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', () => closeSidebar());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebarDrawer.classList.contains('open')) {
        closeSidebar();
      }
    });
  }

  function setupLenisScroll() {
    if (typeof Lenis === 'undefined' || globalLenis) return;
    try {
      globalLenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        infinite: false
      });

      function raf(time) {
        globalLenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (e) {}
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTeamsPage);
  } else {
    initTeamsPage();
  }

})();
