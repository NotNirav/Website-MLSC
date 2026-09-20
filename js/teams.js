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
    // =========================================================
    // 1. CORE LEADERSHIP
    // =========================================================
    {
      id: 'core-team',
      name: 'Core Team',
      category: 'Core',
      categoryLabel: 'Core Leadership',
      tag: 'Core Leadership',
      title: 'Executive Board & Core Leadership',
      desc: 'Steering chapter vision, campus initiatives, and institutional collaborations.',
      accentColor: '#ffb900'
    },

    // =========================================================
    // 2. TECHNICAL WING
    // =========================================================
    {
      id: 'web-development',
      name: 'Web Development',
      category: 'Tech',
      categoryLabel: 'Technical Wing',
      tag: 'Web Development',
      title: 'Web & Platform Engineering',
      desc: 'Developing responsive web portals, interactive applications, and chapter digital tools.',
      accentColor: '#38bdf8'
    },
    {
      id: 'devops',
      name: 'DevOps',
      category: 'Tech',
      categoryLabel: 'Technical Wing',
      tag: 'DevOps & Cloud',
      title: 'DevOps & Cloud Infrastructure',
      desc: 'Containerizing workloads, orchestrating CI/CD pipelines, and maintaining resilient cloud infrastructure.',
      accentColor: '#0ea5e9'
    },
    {
      id: 'ai-ml',
      name: 'AI / ML',
      category: 'Tech',
      categoryLabel: 'Technical Wing',
      tag: 'Artificial Intelligence',
      title: 'Artificial Intelligence & Machine Learning',
      desc: 'Exploring machine learning models, computer vision, natural language processing, and data projects.',
      accentColor: '#34d399'
    },
    {
      id: 'cyber-security',
      name: 'Cyber Security',
      category: 'Tech',
      categoryLabel: 'Technical Wing',
      tag: 'Cyber Security',
      title: 'Cyber Security & Systems',
      desc: 'Securing cloud services, vulnerability testing, authentication security, and defense protocols.',
      accentColor: '#ef4444'
    },
    {
      id: 'cp',
      name: 'CP',
      category: 'Tech',
      categoryLabel: 'Technical Wing',
      tag: 'Competitive Programming',
      title: 'Competitive Programming & DSA',
      desc: 'Fostering algorithmic problem solving, data structures, and competitive coding contests.',
      accentColor: '#a855f7'
    },

    // =========================================================
    // 3. NON-TECHNICAL & CREATIVE WING
    // =========================================================
    {
      id: 'event-management',
      name: 'Event Management',
      category: 'Non-Tech',
      categoryLabel: 'Non-Technical Wing',
      tag: 'Event Management',
      title: 'Event Management & Operations',
      desc: 'Organizing hackathons, technical workshops, operations, logistics, and speaker sessions.',
      accentColor: '#f97316'
    },
    {
      id: 'sponsorship-marketing',
      name: 'Sponsorship & Marketing',
      category: 'Non-Tech',
      categoryLabel: 'Non-Technical Wing',
      tag: 'Sponsorship & Marketing',
      title: 'Sponsorship, Marketing & Outreach',
      desc: 'Securing corporate sponsorships, managing partnerships, and driving community outreach.',
      accentColor: '#06b6d4'
    },
    {
      id: 'accounts-finance',
      name: 'Accounts & Finance',
      category: 'Non-Tech',
      categoryLabel: 'Non-Technical Wing',
      tag: 'Accounts & Finance',
      title: 'Accounts & Financial Management',
      desc: 'Managing financial planning, budget allocations, event logistics funding, and accounts.',
      accentColor: '#10b981'
    },
    {
      id: 'ui-ux-design',
      name: 'UI / UX & Design',
      category: 'Non-Tech',
      categoryLabel: 'Non-Technical Wing',
      tag: 'UI / UX Design',
      title: 'UI / UX & Creative Design',
      desc: 'Designing intuitive user interfaces, visual design systems, brand identities, and graphics.',
      accentColor: '#ec4899'
    },
    {
      id: 'videography-media',
      name: 'Videography & Media',
      category: 'Non-Tech',
      categoryLabel: 'Non-Technical Wing',
      tag: 'Videography & Media',
      title: 'Videography & Media Production',
      desc: 'Capturing event photography, producing aftermovies, recap videos, and managing chapter social media.',
      accentColor: '#8b5cf6'
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
      stage.setAttribute('tabindex', '0');
      stage.setAttribute('aria-label', `${this.domainInfo.name} carousel, use left and right arrow keys to navigate`);

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
          }
        });
        this.trackEl.appendChild(card);
        this.cardElements.push(card);
      });

      stage.appendChild(prevBtn);
      stage.appendChild(nextBtn);
      stage.appendChild(this.trackEl);
      this.containerEl.appendChild(stage);

      // Interactive Navigation Listeners
      prevBtn.addEventListener('click', () => this.prev());
      nextBtn.addEventListener('click', () => this.next());

      // Keyboard arrow key navigation when focused
      stage.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.next();
        }
      });

      this.setupGestures(stage);
      this.updatePositions();
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
        <img class="team-card-image" src="${initialSrc}" ${dataSrcAttr} alt="${escapeHTML(member.name)}" width="280" height="215" loading="lazy" decoding="async">
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
  let currentTenure = 'Current Year (2025–26)';

  function detectInitialTenure() {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('2023') || hash.includes('23')) return '2023–24';
    if (hash.includes('2024') || hash.includes('24')) return '2024–25';
    if (hash.includes('current') || hash.includes('2025') || hash.includes('25') || hash.includes('26')) return 'Current Year (2025–26)';

    const urlParams = new URLSearchParams(window.location.search);
    const tenureParam = urlParams.get('tenure') || urlParams.get('year');
    if (tenureParam) {
      const p = tenureParam.toLowerCase();
      if (p.includes('2023') || p.includes('23')) return '2023–24';
      if (p.includes('2024') || p.includes('24')) return '2024–25';
      if (p.includes('current') || p.includes('2025') || p.includes('25') || p.includes('26')) return 'Current Year (2025–26)';
    }
    return 'Current Year (2025–26)';
  }

  function setupTenureSwitcher() {
    const switchContainer = document.getElementById('teams-tenure-switch');
    if (!switchContainer) return;

    const buttons = switchContainer.querySelectorAll('.teams-tenure-btn');
    buttons.forEach(btn => {
      const bTenure = btn.getAttribute('data-tenure');
      const isActive = isTenureMatch(bTenure, currentTenure);
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedTenure = btn.getAttribute('data-tenure');
        if (isTenureMatch(selectedTenure, currentTenure)) return;

        currentTenure = selectedTenure;
        buttons.forEach(b => {
          const active = isTenureMatch(b.getAttribute('data-tenure'), currentTenure);
          b.classList.toggle('active', active);
          b.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        // Update URL hash smoothly
        if (window.history && window.history.replaceState) {
          const slug = selectedTenure.includes('23') ? '2023' : (selectedTenure.includes('24') ? '2024' : 'current');
          window.history.replaceState(null, '', '#tenure=' + slug);
        }

        renderAllDomainSections();
      });
    });
  }

  function isTenureMatch(a, b) {
    if (!a || !b) return false;
    const la = a.toLowerCase();
    const lb = b.toLowerCase();
    if (la === lb) return true;
    if (la.includes('2023') && lb.includes('2023')) return true;
    if (la.includes('2024') && lb.includes('2024')) return true;
    if ((la.includes('current') || la.includes('2025') || la.includes('2026')) &&
        (lb.includes('current') || lb.includes('2025') || lb.includes('2026'))) return true;
    return false;
  }

      function normalizeTeamName(teamStr) {
    if (!teamStr) return 'Core Team';
    const clean = teamStr.trim();
    if (/^(core|president|general secretary)/i.test(clean)) return 'Core Team';
    if (/^(ai|ml|ais*\/s*ml)/i.test(clean)) return 'AI / ML';
    if (/^web/i.test(clean)) return 'Web Development';
    if (/^(devops|cloud)/i.test(clean)) return 'DevOps';
    if (/^(cyber|security)/i.test(clean)) return 'Cyber Security';
    if (/^(ui|ux|uis*\/s*ux|design)/i.test(clean)) return 'UI / UX & Design';
    if (/^(video|photo|media|social)/i.test(clean)) return 'Videography & Media';
    if (/^(sponsor|market)/i.test(clean)) return 'Sponsorship & Marketing';
    if (/^(account|finance)/i.test(clean)) return 'Accounts & Finance';
    if (/^(event|operation|logistics|management)/i.test(clean)) return 'Event Management';
    if (/^(cp|competitive)/i.test(clean)) return 'CP';
    return clean;
  }

  async function initTeamsPage() {
    jumpNavContainer = document.getElementById('teams-jump-container');
    sectionsWrapper = document.getElementById('teams-sections-wrapper');

    if (!sectionsWrapper) return;

    currentTenure = detectInitialTenure();
    setupTenureSwitcher();
    setupLenisScroll();
    setupHeroAnimations();

    // Fetch static CSV data dynamically (cached in memory)
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
      if (globalLenis || window.lenis) {
        (globalLenis || window.lenis).resize();
      }
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 100));
  }

  // =========================================================
  // 6. RENDER ALL DOMAIN SECTIONS SEQUENTIALLY
  // =========================================================
    // Helper: Rank members by role authority so that Domain Heads are at index 0 (front & center),
  // with Leads following and Executives/Members flanking them on the sides.
  function getRoleRank(role) {
    const r = (role || '').toLowerCase();
    if (r.includes('president') && !r.includes('vice')) return 1;
    if (r.includes('vice president') || r.includes('vp')) return 2;
    if (r.includes('secretary')) return 3;
    if (/\bhead\b/.test(r)) return 4;
    if (/co-head|deputy/.test(r)) return 5;
    if (/\blead\b/.test(r)) return 6;
    if (/architect|strategist|coordinator/.test(r)) return 7;
    if (/specialist|researcher|engineer|developer|designer/.test(r)) return 8;
    if (/executive/.test(r)) return 9;
    return 10; // member, other
  }

  function renderAllDomainSections() {
    if (!sectionsWrapper) return;

    carouselInstances = [];

    sectionsWrapper.innerHTML = '';
    if (jumpNavContainer) jumpNavContainer.innerHTML = '';

    // Filter members matching the active selected year
    const activeMembers = allMembers.filter(m => isTenureMatch(m.tenure, currentTenure));

    // Group members by normalized domain
    const membersByDomain = {};
    const domainsToRender = [...DOMAIN_ORDER];

    activeMembers.forEach(m => {
      const normTeam = normalizeTeamName(m.team);
      if (!membersByDomain[normTeam]) {
        membersByDomain[normTeam] = [];
      }
      membersByDomain[normTeam].push(m);

      // If custom domain isn't in DOMAIN_ORDER, add it dynamically
      if (!domainsToRender.some(d => d.name.toLowerCase() === normTeam.toLowerCase())) {
        const slug = normTeam.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        domainsToRender.push({
          id: slug,
          name: normTeam,
          category: 'Non-Tech',
          categoryLabel: 'Other Domains',
          tag: normTeam,
          title: normTeam,
          desc: `Members and contributors in ${normTeam}.`,
          accentColor: m.accentColor || '#38bdf8'
        });
      }
    });

    // Track when we transition into Tech or Non-Tech wings to render sleek Wing Dividers
    let hasRenderedTechDivider = false;
    let hasRenderedNonTechDivider = false;

    // Render Jump Pills & Team Blocks
    domainsToRender.forEach(domain => {
      const domainMembers = membersByDomain[domain.name] || [];
      if (domainMembers.length === 0) return;

      // CRITICAL: Sort domain members so that Domain Head (or President) is FRONT FIRST (index 0),
      // followed by Leads, and Executives on the sides!
      domainMembers.sort((a, b) => getRoleRank(a.role) - getRoleRank(b.role));

      const cat = domain.category || 'Non-Tech';
      const catClass = cat === 'Core' ? 'core' : (cat === 'Tech' ? 'tech' : 'nontech');
      const catShort = cat === 'Core' ? 'Core' : (cat === 'Tech' ? 'Tech' : 'Non-Tech');

      // 1. Create Jump Nav Pill with distinct Tech / Non-Tech visual indicator
      if (jumpNavContainer) {
        const pill = document.createElement('a');
        pill.className = `teams-jump-btn ${catClass}-pill`;
        pill.href = `#domain-${domain.id}`;
        pill.setAttribute('data-domain', domain.name);
        pill.setAttribute('data-category', cat);
        pill.innerHTML = `
          <span class="teams-jump-cat-tag ${catClass}">${catShort}</span>
          <span class="teams-jump-label">${escapeHTML(domain.name)}</span>
          <span class="teams-jump-count">${domainMembers.length}</span>
        `;
        pill.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.getElementById(`domain-${domain.id}`);
          if (target) {
            const activeLenis = globalLenis || window.lenis;
            if (activeLenis) {
              activeLenis.scrollTo(target, {
                offset: -20,
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
              });
            } else {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        });
        jumpNavContainer.appendChild(pill);
      }

      // 2. Render Category Wing Divider Header before first Tech domain
      if (cat === 'Tech' && !hasRenderedTechDivider) {
        hasRenderedTechDivider = true;
        const divider = document.createElement('div');
        divider.className = 'team-wing-divider tech-wing';
        divider.innerHTML = `
          <div class="team-wing-badge">
            <span class="wing-text">Technical Domains</span>
          </div>
          <div class="team-wing-line"></div>
        `;
        sectionsWrapper.appendChild(divider);
      }

      // 3. Render Category Wing Divider Header before first Non-Tech domain
      if (cat === 'Non-Tech' && !hasRenderedNonTechDivider) {
        hasRenderedNonTechDivider = true;
        const divider = document.createElement('div');
        divider.className = 'team-wing-divider nontech-wing';
        divider.innerHTML = `
          <div class="team-wing-badge nontech">
            <span class="wing-text">Non-Technical & Creative Domains</span>
          </div>
          <div class="team-wing-line"></div>
        `;
        sectionsWrapper.appendChild(divider);
      }

      // 4. Create Domain Section Block
      const block = document.createElement('section');
      block.className = `team-domain-block domain-${catClass}`;
      block.id = `domain-${domain.id}`;
      block.setAttribute('data-domain', domain.name);
      block.setAttribute('data-category', cat);

      // Domain Header
      const header = document.createElement('div');
      header.className = 'team-domain-header';
      header.innerHTML = `
        <div class="team-domain-badge" style="color: ${domain.accentColor}; background: ${domain.accentColor}12; border-color: ${domain.accentColor}33;">
          <span>${escapeHTML(domain.tag)}</span>
        </div>
        <h2 class="team-domain-title">${escapeHTML(domain.title)}</h2>
        <p class="team-domain-desc">${escapeHTML(domain.desc)}</p>
      `;
      block.appendChild(header);

      // Carousel / Showcase Container
      sectionsWrapper.appendChild(block);

      // Instantiate Carousel (at index 0, Domain Head will be FRONT AND CENTER!)
      const instance = new TeamCarousel(domain, domainMembers, block);
      carouselInstances.push(instance);
    });

    setupScrollSpy();

    // Immediate resize & refresh of Lenis and GSAP ScrollTrigger after dynamic DOM insertion
    const activeLenis = globalLenis || window.lenis;
    if (activeLenis) {
      activeLenis.resize();
    }
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }

    // Single debounced refresh once all initial layout calculations are settled
    setTimeout(() => {
      if (activeLenis) activeLenis.resize();
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }, 200);

    // Synchronize ScrollTrigger and apply smooth reveal animations (respects reduced motion)
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();

      gsap.utils.toArray('.team-domain-block').forEach((block) => {
        gsap.fromTo(block,
          { opacity: 0.25, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    }
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
  const FALLBACK_TEAMS_CSV = `id,name,tenure,team,category,role,subtext,bio,image,bgVideo,accentColor,github,linkedin
1,Mohit Patil,2024–25,Core Team,Core,President,2024–25 Tenure,"Driving chapter vision, strategic initiatives, partnerships, and high-impact student tech programs.",assets/images/members/old_2025_mohit_patil.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ffb900,https://github.com/MohitPatil0965,https://www.linkedin.com/in/mohit-patil-632061289?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
2,Aaditya Deshpande,2024–25,Event Management,Non-Tech,Event Management Head,2024–25 Tenure,"Directing flagship hackathons, technical speaker series, and participant experience.",assets/images/members/old_2025_aaditya_deshpande.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/desh-aaditya,https://www.linkedin.com/in/aaditya-deshpande-b90550292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
3,Smit Sawarkar,2024–25,Event Management,Non-Tech,Event Management Lead,2024–25 Tenure,"Directing flagship hackathons, technical speaker series, and participant experience.",assets/images/members/old_2025_smit_sawarkar.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/smit-585,http://www.linkedin.com/in/smitsawarkar
4,Ananya Gawade,2024–25,Accounts & Finance,Non-Tech,Accounts and Finance Head,2024–25 Tenure,"Managing chapter budget allocations, financial audits, and sponsor fund disbursement.",assets/images/members/old_2025_ananya_gawade.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/AnanyaGawade,http://www.linkedin.com/in/ananya-gawade
5,Bhumika Nehete,2024–25,Sponsorship & Marketing,Non-Tech,Sponsorship and Marketing Head,2024–25 Tenure,"Forging industry partnerships, corporate sponsorships, and campus marketing campaigns.",assets/images/members/old_2025_bhumika_nehete.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com,https://www.linkedin.com/in/bhumikanehete/
6,Arpita Patki,2024–25,Sponsorship & Marketing,Non-Tech,Sponsorship and Marketing Lead,2024–25 Tenure,"Forging industry partnerships, corporate sponsorships, and campus marketing campaigns.",assets/images/members/old_2025_arpita_patki.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/arpitapatki,https://www.linkedin.com/in/arpita-r-patki-3821b2312
7,Sarthak Bagde,2024–25,Sponsorship & Marketing,Non-Tech,Sponsorship and Marketing Lead,2024–25 Tenure,"Forging industry partnerships, corporate sponsorships, and campus marketing campaigns.",assets/images/members/old_2025_sarthak_bagde.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com,http://www.linkedin.com/in/sarthakbagde
8,Nandkishor Vasi,2024–25,Web Development,Tech,Web Development Head,2024–25 Tenure,"Architecting scalable web platforms, responsive portals, and mentoring club web developers.",assets/images/members/old_2025_nandkishor_vasi.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/nandkishor-vasi,https://linkedin.com/in/nandkishor-vasi
9,Aditya Gavali,2024–25,Web Development,Tech,Web Development Lead,2024–25 Tenure,"Architecting scalable web platforms, responsive portals, and mentoring club web developers.",assets/images/members/old_2025_aditya_gavali.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/Aditya2860,http://linkedin.com/in/aditya2860c
10,Rouchi Mahajan,2024–25,AI / ML,Tech,AI/DS Head,2024–25 Tenure,"Spearheading AI/ML research initiatives, neural model architectures, and data-driven systems.",assets/images/members/old_2025_rouchi_mahajan.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/rouchi-11,https://www.linkedin.com/in/rouchi-mahajan-94a4a7292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
11,Adway Aghor,2024–25,AI / ML,Tech,AI/DS Lead,2024–25 Tenure,"Spearheading AI/ML research initiatives, neural model architectures, and data-driven systems.",assets/images/members/old_2025_adway_aghor.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/adwayaghor,https://www.linkedin.com/in/adway-aghor-11060a292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
12,Pruthviraj Desale,2024–25,CP,Tech,Competitive programming Head,2024–25 Tenure,"Directing algorithmic bootcamps, contest strategies, and advanced problem-solving tracks.",assets/images/members/old_2025_pruthviraj_desale.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#a855f7,https://github.com/pruthviraj-desale,https://www.linkedin.com/in/pruthviraj-desale
13,Rushikesh Nakhale,2024–25,CP,Tech,Competitive programming Lead,2024–25 Tenure,"Directing algorithmic bootcamps, contest strategies, and advanced problem-solving tracks.",assets/images/members/old_2025_rushikesh_nakhale.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#a855f7,https://github.com/rushinakhale115,https://www.linkedin.com/in/rushikesh-nakhale
14,Kshitij Hedau,2024–25,UI / UX & Design,Non-Tech,Design and Media Head,2024–25 Tenure,"Crafting unified brand identities, digital design systems, and creative visual guidelines.",assets/images/members/old_2025_kshitij_hedau.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/Herostomo,https://www.linkedin.com/in/kshitij-hedau-8084aa292/
15,Yashraj Rajapure,2024–25,Videography & Media,Non-Tech,Videography and Photography Head,2024–25 Tenure,"Capturing high-energy chapter moments, keynote recaps, and producing cinematic event trailers.",assets/images/members/old_2025_yashraj_rajapure.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/YASHRAJ-81,https://www.linkedin.com/in/yashraj-rajapure-2929a0293/
16,Indranil Kenekar,2024–25,Videography & Media,Non-Tech,Videography Head,2024–25 Tenure,"Capturing high-energy chapter moments, keynote recaps, and producing cinematic event trailers.",assets/images/members/old_2025_indranil_kenekar.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com,https://www.linkedin.com/in/indranil-kenekar-490550292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
17,Rachana Dixit,2024–25,Videography & Media,Non-Tech,Design and media Lead,2024–25 Tenure,"Directing creative media collaterals, visual design, and social branding initiatives.",assets/images/members/old_2025_rachana_dixit.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/rachanadixit,https://www.linkedin.com/in/rachana-dixit-a8906b291
18,Samarth Waghrulkar,2024–25,Web Development,Tech,Web Development Executive,2024–25 Tenure,"Developing performant web applications, modern responsive interfaces, and robust APIs.",assets/images/members/old_2025_samarth_waghrulkar.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/Samarth-06,https://www.linkedin.com/in/samarth-waghrulkar-46b854323
19,Tanvi Jadhav,2024–25,Event Management,Non-Tech,Event Management Executive,2024–25 Tenure,"Coordinating event logistics, participant registration flows, and workshop execution.",assets/images/members/old_2025_tanvi_jadhav.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/Tanvi-J-24,http://www.linkedin.com/in/tanvi-jadhav
20,Apoorv Arora,2024–25,Event Management,Non-Tech,Event Management Executive,2024–25 Tenure,"Coordinating event logistics, participant registration flows, and workshop execution.",assets/images/members/old_2025_apoorv_arora.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/Apoorv0770,https://www.linkedin.com/in/apoorv-arora01?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
21,Narayan Ratnaparkhe,2024–25,CP,Tech,CP Executive,2024–25 Tenure,"Mastering advanced algorithms, data structures, and competitive contest problem solving.",assets/images/members/old_2025_narayan_ratnaparkhe.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#a855f7,https://github.com/Narayan-A-R,https://www.linkedin.com/in/narayan-ratnaparkhe-12a93b30a/
22,Sanjana Biyani,2024–25,CP,Tech,CP Executive,2024–25 Tenure,"Mastering advanced algorithms, data structures, and competitive contest problem solving.",assets/images/members/old_2025_sanjana_biyani.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#a855f7,https://github.com/sanjana-991,http://www.linkedin.com/in/sanjanabiyani
23,Veerbhadra Mahant,2024–25,AI / ML,Tech,AI/DS Executive,2024–25 Tenure,"Building intelligent models, computer vision pipelines, and predictive analytics.",assets/images/members/old_2025_veerbhadra_mahant.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/VeerbhadraMahant,https://www.linkedin.com/in/veerbhadra-mahant-9550672b1/
24,Trijal Khade,2024–25,AI / ML,Tech,AI/DS Executive,2024–25 Tenure,"Building intelligent models, computer vision pipelines, and predictive analytics.",assets/images/members/old_2025_trijal_khade.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/Trijalkhade,https://www.linkedin.com/in/trijalkhade
25,Ved Jadhav,2024–25,UI / UX & Design,Non-Tech,Design and Media Executive,2024–25 Tenure,"Designing intuitive UI layouts, visual illustrations, and promotional creative assets.",assets/images/members/old_2025_ved_jadhav.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/ved-jadhav-10,https://www.linkedin.com/in/vedjadhav
26,Sumaira Mulla,2024–25,UI / UX & Design,Non-Tech,Design and Media Executive,2024–25 Tenure,"Designing intuitive UI layouts, visual illustrations, and promotional creative assets.",assets/images/members/old_2025_sumaira_mulla.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/sumairamulla07,https://www.linkedin.com/in/sumaira-m-523588313/
27,Ninad Ashok Mande,2024–25,Event Management,Non-Tech,Management and Logistics Executive,2024–25 Tenure,"Orchestrating hardware resources, venue infrastructure, and smooth event operations.",assets/images/members/old_2025_ninad_ashok_mande.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/ninad-byte,http://www.linkedin.com/in/ninad-mande-36737b251
28,Omkar Nikam,2024–25,Sponsorship & Marketing,Non-Tech,Sponsorship and Marketing Executive,2024–25 Tenure,"Driving sponsor outreach, promotional media strategy, and community engagement.",assets/images/members/old_2025_omkar_nikam.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/OMKAR-PSN,https://www.linkedin.com/in/omkar-nikam-436b27370/
29,Sharvil Patil,2024–25,Sponsorship & Marketing,Non-Tech,Sponsorship and Marketing Executive,2024–25 Tenure,"Driving sponsor outreach, promotional media strategy, and community engagement.",assets/images/members/old_2025_sharvil_patil.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/sharv18,http://www.linkedin.com/in/sharvil-patil-337ab1316
30,Madhav Khobare,2024–25,Sponsorship & Marketing,Non-Tech,Sponsorship and Marketing Executive,2024–25 Tenure,"Driving sponsor outreach, promotional media strategy, and community engagement.",assets/images/members/old_2025_madhav_khobare.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/MadhavK3,https://in.linkedin.com/in/madhav-khobare-782a0432a
31,Isha Thakur,2024–25,Sponsorship & Marketing,Non-Tech,Sponsorship and Marketing Executive,2024–25 Tenure,"Driving sponsor outreach, promotional media strategy, and community engagement.",assets/images/members/old_2025_isha_thakur.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/isha1296,https://www.linkedin.com/in/isha-thakur-80229a2a0/
32,Aryan Patel,2024–25,Accounts & Finance,Non-Tech,Accounts & Finance Executive,2024–25 Tenure,"Managing chapter budget allocations, financial audits, and sponsor fund disbursement.",assets/images/members/old_2025_aryan_patel.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/aryan051106,https://www.linkedin.com/in/aryan-patel-a26a0632a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
33,Tejal Jadhav,2024–25,Accounts & Finance,Non-Tech,Accounts and Finance Executive,2024–25 Tenure,"Managing chapter budget allocations, financial audits, and sponsor fund disbursement.",assets/images/members/old_2025_tejal_jadhav.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/TejalJ357,http://www.linkedin.com/in/tejal-j
34,Harsh Gulhane,2023–24,Core Team,Core,President,2023–24 Tenure,"Driving chapter vision, strategic initiatives, partnerships, and high-impact student tech programs.",assets/images/members/old_2024_harsh_gulhane.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ffb900,https://github.com,https://www.linkedin.com/in/harsh-gulhane-78a484259/
35,Payal Pawar,2023–24,Event Management,Non-Tech,Event Management Head,2023–24 Tenure,"Directing flagship hackathons, technical speaker series, and participant experience.",assets/images/members/old_2024_payal_pawar.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/payalpawar9579/payalpawar9579,http://www.linkedin.com/in/payal-pawar-357243288
36,Revati Keskar,2023–24,Sponsorship & Marketing,Non-Tech,Sponsorship and Marketing Head,2023–24 Tenure,"Forging industry partnerships, corporate sponsorships, and campus marketing campaigns.",assets/images/members/old_2024_revati_keskar.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/RevatiKeskar,https://www.linkedin.com/in/revatikeskar
37,Pawan Patil,2023–24,Web Development,Tech,Web Development Lead,2023–24 Tenure,"Architecting scalable web platforms, responsive portals, and mentoring club web developers.",assets/images/members/old_2024_pawan_patil.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/pawanp51,https://www.linkedin.com/in/pawan-patil51
38,Sarthak Joshi,2023–24,Web Development,Tech,Web Development Head,2023–24 Tenure,"Architecting scalable web platforms, responsive portals, and mentoring club web developers.",assets/images/members/old_2024_sarthak_joshi.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/Joshi-Sarthak,https://www.linkedin.com/in/sarthak-joshi-a98840259/
39,Adinath Yadav,2023–24,CP,Tech,Competitive Programming Head,2023–24 Tenure,"Directing algorithmic bootcamps, contest strategies, and advanced problem-solving tracks.",assets/images/members/old_2024_adinath_yadav.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#a855f7,https://github.com/adinathyadav2002,https://www.linkedin.com/in/adinath-yadav-50a294251/
40,Siddhesh Patil,2023–24,CP,Tech,Competitive Programming Lead,2023–24 Tenure,"Directing algorithmic bootcamps, contest strategies, and advanced problem-solving tracks.",assets/images/members/old_2024_siddhesh_patil.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#a855f7,https://github.com/siddhesh-patil,https://www.linkedin.com/in/siddhesh-patil
41,Tushar Badlani,2023–24,AI / ML,Tech,AI/DS Head,2023–24 Tenure,"Spearheading AI/ML research initiatives, neural model architectures, and data-driven systems.",assets/images/members/old_2024_tushar_badlani.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/tushar-badlani,https://www.linkedin.com/in/tushar-badlanii/
42,Anish Patade,2023–24,AI / ML,Tech,AI/DS Lead,2023–24 Tenure,"Spearheading AI/ML research initiatives, neural model architectures, and data-driven systems.",assets/images/members/old_2024_anish_patade.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/sensational03,https://www.linkedin.com/in/anish-patade-197967242/
43,Kunal Pawara,2023–24,Videography & Media,Non-Tech,Media Lead,2023–24 Tenure,"Directing creative media collaterals, visual design, and social branding initiatives.",assets/images/members/old_2024_kunal_pawara.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/KunalPawara,https://www.linkedin.com/in/kunal-pawara2004/
44,Aaditya Deshpande,2023–24,Event Management,Non-Tech,Event Management Team,2023–24 Tenure,"Coordinating event logistics, participant registration flows, and workshop execution.",assets/images/members/old_2024_aaditya_deshpande.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com,https://www.linkedin.com/in/aaditya-deshpande-b90550292
45,Smit Sawarkar,2023–24,Event Management,Non-Tech,Event Management Team,2023–24 Tenure,"Coordinating event logistics, participant registration flows, and workshop execution.",assets/images/members/old_2024_smit_sawarkar.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com,https://www.linkedin.com/in/smit-sawarkar-016006324?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
46,Apoorv Arora,2023–24,Event Management,Non-Tech,Event Management Team,2023–24 Tenure,"Coordinating event logistics, participant registration flows, and workshop execution.",assets/images/members/old_2024_apoorv_arora.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com,https://www.linkedin.com/in/apoorv-arora-77886727b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
47,Ananya Gawade,2023–24,Event Management,Non-Tech,Event Management Team,2023–24 Tenure,"Coordinating event logistics, participant registration flows, and workshop execution.",assets/images/members/old_2024_ananya_gawade.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com/AnanyaGawade,https://www.linkedin.com/in/ananya-gawade-613b46292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
48,Nishaad Gangal,2023–24,CP,Tech,Competitive Programming Team,2023–24 Tenure,"Mastering advanced algorithms, data structures, and competitive contest problem solving.",assets/images/members/old_2024_nishaad_gangal.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#a855f7,https://github.com/NishaadG,https://www.linkedin.com/in/nishaad-gangal-943210290?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
49,Rohan Adkine,2023–24,CP,Tech,Competitive Programming Team,2023–24 Tenure,"Mastering advanced algorithms, data structures, and competitive contest problem solving.",assets/images/members/old_2024_rohan_adkine.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#a855f7,https://github.com/RohanAdkine,https://www.linkedin.com/in/rohan-adkine-401630214/
50,Piyush Badgujar,2023–24,Web Development,Tech,Web Development Team,2023–24 Tenure,"Developing performant web applications, modern responsive interfaces, and robust APIs.",assets/images/members/old_2024_piyush_badgujar.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com/piyushbagujar,http://www.linkedin.com/in/piyush-badgujar-jalgaon
51,Mohit Patil,2023–24,Web Development,Tech,Web Development Team,2023–24 Tenure,"Developing performant web applications, modern responsive interfaces, and robust APIs.",assets/images/members/old_2024_mohit_patil.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#38bdf8,https://github.com,https://www.linkedin.com/in/mohit-patil-632061289?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
52,Keyura Motegaonkar,2023–24,AI / ML,Tech,AI/DS Team,2023–24 Tenure,"Building intelligent models, computer vision pipelines, and predictive analytics.",assets/images/members/old_2024_keyura_motegaonkar.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com,https://linkedin.com/in/keyura-motegaonkar-50043a25a
53,Varad Rane,2023–24,AI / ML,Tech,AI/DS Team,2023–24 Tenure,"Building intelligent models, computer vision pipelines, and predictive analytics.",assets/images/members/old_2024_varad_rane.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/VaradRane12,https://www.linkedin.com/in/varad-rane1244/
54,Kshitij Hedau,2023–24,UI / UX & Design,Non-Tech,Design Team,2023–24 Tenure,"Designing intuitive UI layouts, visual illustrations, and promotional creative assets.",assets/images/members/old_2024_kshitij_hedau.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/Herostomo,https://www.linkedin.com/in/kshitij-hedau-8084aa292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
55,Sparsh Gandhi,2023–24,UI / UX & Design,Non-Tech,Design Team,2023–24 Tenure,"Designing intuitive UI layouts, visual illustrations, and promotional creative assets.",assets/images/members/old_2024_sparsh_gandhi.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/sparsh3104,https://www.linkedin.com/in/sparsh-gandhi-224b84312
56,Rachana Dixit,2023–24,UI / UX & Design,Non-Tech,Design Team,2023–24 Tenure,"Designing intuitive UI layouts, visual illustrations, and promotional creative assets.",assets/images/members/old_2024_rachana_dixit.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/rachanadixit,https://www.linkedin.com/in/rachana-dixit-a8906b291?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
57,Aniket Damedhar,2023–24,UI / UX & Design,Non-Tech,Design and media Team,2023–24 Tenure,"Designing intuitive UI layouts, visual illustrations, and promotional creative assets.",assets/images/members/old_2024_aniket_damedhar.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/Aniket93227,https://www.linkedin.com/in/aniketd1604/
58,Shubhang Gandhi,2023–24,UI / UX & Design,Non-Tech,Design Team,2023–24 Tenure,"Designing intuitive UI layouts, visual illustrations, and promotional creative assets.",assets/images/members/old_2024_shubhang_gandhi.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com,https://www.linkedin.com/in/shubhang-gandhi-634553292
59,Sarthak Bagde,2023–24,Sponsorship & Marketing,Non-Tech,Sponsorship and Marketing Team,2023–24 Tenure,"Driving sponsor outreach, promotional media strategy, and community engagement.",assets/images/members/old_2024_sarthak_bagde.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com,https://www.linkedin.com/in/sarthakbagde?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
60,Bhumika Nehete,2023–24,Sponsorship & Marketing,Non-Tech,Sponsorship and Marketing Team,2023–24 Tenure,"Driving sponsor outreach, promotional media strategy, and community engagement.",assets/images/members/old_2024_bhumika_nehete.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com,https://in.linkedin.com/in/bhumika-nehete-8023922bb
61,Amrita Iyer,2023–24,Sponsorship & Marketing,Non-Tech,Sponsorship and Marketing Team,2023–24 Tenure,"Driving sponsor outreach, promotional media strategy, and community engagement.",assets/images/members/old_2024_amrita_iyer.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f25022,https://github.com,https://linkedin.com
62,Indranil Kenekar,2023–24,Videography & Media,Non-Tech,Video editing and photography Team,2023–24 Tenure,"Capturing high-energy chapter moments, keynote recaps, and producing cinematic event trailers.",assets/images/members/old_2024_indranil_kenekar.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com,https://www.linkedin.com/in/indranil-kenekar-490550292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
63,Yash Somwanshi,2023–24,Videography & Media,Non-Tech,Video editing and photography Team,2023–24 Tenure,"Capturing high-energy chapter moments, keynote recaps, and producing cinematic event trailers.",assets/images/members/old_2024_yash_somwanshi.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/YashSomwanshi,https://www.linkedin.com/in/yash-somwanshi-3670b2292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
64,Ved Jadhav,Current Year (2025–26),Core Team,Core,President,TY CSE,"Driving strategic club vision, partnerships, developer community building, and high-impact campus tech initiatives.",assets/images/members/Ved_Jadhav.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ffb900,https://github.com/ved-jadhav-10,https://www.linkedin.com/in/vedjadhav
65,Isha Thakur,Current Year (2025–26),Core Team,Core,General Secretary,TY CSE,"Managing club operations, internal communication, and event execution to ensure impactful tech initiatives across campus.",assets/images/members/isha_.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ffb900,https://github.com/isha1296,https://www.linkedin.com/in/isha-thakur12/
66,Chinmay Ahire,Current Year (2025–26),DevOps,Tech,DevOps Head,TY CSE,"Designing scalable cloud architectures, CI/CD automation pipelines, and maintaining robust infrastructure for chapter projects.",assets/images/members/Chinmay_Ahire.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#0ea5e9,https://github.com/THE-DEDUCTER,https://www.linkedin.com/in/chinmay-ahire
67,Nirav Neve,Current Year (2025–26),DevOps,Tech,DevOps Engineer,SY CSE,"Engineering containerized deployment workflows, low-latency database queries, and scalable system infrastructure.",assets/images/members/Nirav_Neve.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#0ea5e9,https://github.com/NotNirav,https://www.linkedin.com/in/nirav-neve-b452183a1/
68,Khushi Kolhe,Current Year (2025–26),DevOps,Tech,DevOps Engineer,SY IT,"SY BTech IT student with a keen interest in programming, cloud tooling, and building practical projects through hands-on learning.",assets/images/members/Khushi Kolhe.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#0ea5e9,https://github.com/khushikolhe,https://www.linkedin.com/in/khushi-kolhe-809a77379/
69,Sanika Shinde,Current Year (2025–26),DevOps,Tech,DevOps Engineer,SY IT,"SY B.Tech IT student at PCCOE with strong interest in programming, DSA, development, and building reliable software systems.",assets/images/members/Sanika Shinde.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#0ea5e9,https://github.com/sanika2506,https://www.linkedin.com/in/sanika-shinde-472757386/
70,Badal Dadwani,Current Year (2025–26),AI / ML,Tech,AI / ML Lead,TY IT,"Third-year B.Tech IT student focused on building practical, scalable applications, exploring AI/ML, and solving real problems.",assets/images/members/Badal Dadwani.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/Badal023,https://www.linkedin.com/in/badaldadwani
71,Parth Popli,Current Year (2025–26),AI / ML,Tech,AI / ML Developer,SY CSE,"SY Computer Science student exploring machine learning pipelines, deep learning models, and modern AI application development.",assets/images/members/Parth_Popli.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/Parth19102006,https://www.linkedin.com/in/parth-popli-5012b3386
72,Aryan Patil,Current Year (2025–26),AI / ML,Tech,AI / ML Developer,SY CSE,"Building deep neural networks, computer vision models, and automated evaluation frameworks for machine learning systems.",assets/images/members/Aryan Patel.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#34d399,https://github.com/aryanpatel,https://linkedin.com/in/aryanpatel
73,Prem Thakur,Current Year (2025–26),Cyber Security,Tech,Cyber Security Head,SY IT,"Securing cloud services, vulnerability testing, authentication security, and leading student cyber defense initiatives.",assets/images/members/prem thakur.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ef4444,https://github.com/prem-thakur00,https://www.linkedin.com/in/prem--thakur/
74,Srushti Gaikwad,Current Year (2025–26),Cyber Security,Tech,Cybersecurity Analyst,SY CSE,"Exploring network defense, threat modeling, security compliance, and organizing hands-on cyber defense bootcamps.",assets/images/members/Srushti Gaikwad.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ef4444,https://github.com/srushtigaikwad,https://linkedin.com/in/srushtigaikwad
75,Anjali Borse,Current Year (2025–26),CP,Tech,Competitive Programming Lead,SY IT,"Second-year IT student passionate about C programming, data structures, algorithms, and consistent daily problem solving.",assets/images/members/Anjali Borse.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#a855f7,https://github.com/anjaliborse27-ops,https://www.linkedin.com/in/anjali-borse-5936a93a1/
76,Madhav Khobare,Current Year (2025–26),Event Management,Non-Tech,Operations Head,TY IT,"Third-year IT student at PCCOE. Passionate about building practical solutions, multi-hackathon winner, and executing impactful tech initiatives.",assets/images/members/old_2025_madhav_khobare.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f97316,https://github.com/MadhavK3,https://www.linkedin.com/in/madhav-khobare
77,Aditya Rajput,Current Year (2025–26),Event Management,Non-Tech,Management Head,TY CSE,Third-year Computer Engineering student at PCCOE. 6× national hackathon finalist focused on rapid building and workflow automation.,assets/images/members/Aditya_Rajput.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f97316,https://github.com/adityarajput,https://linkedin.com/in/adityarajput
78,Sharvari Deshmukh,Current Year (2025–26),Event Management,Non-Tech,Operations Lead,SY IT,"Coordinating event logistics, venue infrastructure, participant workflows, and operational execution for club hackathons.",assets/images/members/Sharvari_Deshmukh.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f97316,https://github.com/sharvarid035,https://www.linkedin.com/in/deshmukhsharvari/
79,Kashvi Patki,Current Year (2025–26),Event Management,Non-Tech,Management Lead,SY CSE AIML,"Orchestrating community initiatives, event operations, participant communications, and inter-chapter collaborations.",assets/images/members/Kashvi_Patki .jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#f97316,https://github.com/kashvipatki,https://linkedin.com/in/kashvipatki
80,Pranav Narkhede,Current Year (2025–26),Sponsorship & Marketing,Non-Tech,Marketing Head,SY IT,"Second-year IT student focused on community outreach, developer engagement, and driving club initiatives through creative marketing.",assets/images/members/Pranav_Narkhede.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#06b6d4,https://github.com/PranavN145,https://www.linkedin.com/in/pranavnarkhede31/
81,Apurv Sagare,Current Year (2025–26),Sponsorship & Marketing,Non-Tech,Sponsorship Head,TY CSE,"Passionate about exploring new opportunities, driving industry partnerships, corporate sponsorships, and collaborative team growth.",assets/images/members/APURV SAGARE.jpeg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#06b6d4,https://github.com/apurvsagare,https://linkedin.com/in/apurvsagare
82,Rishabh Prabhu,Current Year (2025–26),Sponsorship & Marketing,Non-Tech,Marketing Lead,SY IT,"SY B.Tech IT student at PCCOE. Passionate about community building, creative marketing campaigns, and hackathon promotions.",assets/images/members/Rishabh Prabhu.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#06b6d4,https://github.com/Cassiopeia111,http://www.linkedin.com/in/rishabh-prabhu-o7
83,Shivanshi Bakshi,Current Year (2025–26),Sponsorship & Marketing,Non-Tech,Marketing Executive,SY IT,"Fostering inter-collegiate outreach, technical media PR, speaker relations, and promotional campaigns across colleges.",assets/images/members/shivanshi.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#06b6d4,https://github.com/shivanshi,https://linkedin.com/in/shivanshi
84,Akshay Pote,Current Year (2025–26),Sponsorship & Marketing,Non-Tech,Sponsorship Executive,SY,"Connecting with corporate sponsors, developer grants, and securing logistical funding for flagship chapter events.",assets/images/members/Akshay Pote.svg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#06b6d4,https://github.com,https://linkedin.com
85,Yash Bhagodia,Current Year (2025–26),Accounts & Finance,Non-Tech,Finance Lead,SY CSE AIML,"SY B.Tech student exploring financial planning, budget allocations, telemetry, and collaborative team resource management.",assets/images/members/Yash Bhagodia_.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#10b981,https://github.com/yashbhagodia,https://linkedin.com/in/yashbhagodia
86,Saksham Jagtap,Current Year (2025–26),UI / UX & Design,Non-Tech,Design Head,SY CSE AIML,"B.Tech CSE (AIML) student driven by creativity and problem-solving, crafting intuitive UI layouts, visual designs, and brand identities.",assets/images/members/Saksham Jagtap.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/SakshamJagtap,https://www.linkedin.com/in/saksham-jagtap-513780320
87,Radnyee Jagtap,Current Year (2025–26),UI / UX & Design,Non-Tech,UI / UX Designer,SY IT,"Second-year IT student at PCCOE Akurdi passionate about modern UI/UX design, interactive wireframing, and user journeys.",assets/images/members/Radnyee Jagtap.svg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/radnyeesjagtap,https://www.linkedin.com/in/radnyee-jagtap-679b02423/
88,Gaurav Dhurve,Current Year (2025–26),UI / UX & Design,Non-Tech,Graphic & Visual Designer,SY,"Designing digital assets, aesthetic event posters, visual design systems, and creative media collaterals for the chapter.",assets/images/members/Gaurav Dhurve.svg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#ec4899,https://github.com/rayflixx,https://linkedin.com
89,Mahesh Shirame,Current Year (2025–26),Videography & Media,Non-Tech,Social Media Head,SY CSE,"Driving chapter digital engagement, social media branding, content creation, and creative visual storytelling for events.",assets/images/members/Mahesh_Shirame.jpg,assets/videos/10405281-hd_3840_2160_30fps.mp4,#8b5cf6,https://github.com/maheshshirame,https://linkedin.com/in/maheshshirame
90,Chaitanya Jadhav,Current Year (2025–26),Videography & Media,Non-Tech,Social Media Lead,SY CSE AIML,"Second-year tech enthusiast interested in programming, videography, and video editing, bringing creative ideas to life through visuals.",assets/images/members/Chaitanya Jadhav.png,assets/videos/10405281-hd_3840_2160_30fps.mp4,#8b5cf6,https://github.com/chaitanyajadhav-07,https://www.linkedin.com/in/chaitanya-jadhav-416424377`;

  let cachedParsedMembers = null;

  async function loadMembersCSV() {
    if (cachedParsedMembers && cachedParsedMembers.length > 0) {
      return cachedParsedMembers;
    }
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
              cachedParsedMembers = parsed;
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
              cachedParsedMembers = parsed;
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
          cachedParsedMembers = parsed;
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
        else if (team === 'CP') defaultAccent = '#a855f7';
        else if (team === 'Event Management') defaultAccent = '#f97316';
        else if (team === 'Sponsorship & Marketing') defaultAccent = '#06b6d4';
        else if (team === 'Accounts & Finance') defaultAccent = '#10b981';
        else if (team === 'UI / UX & Design') defaultAccent = '#ec4899';
        else if (team === 'Videography & Media') defaultAccent = '#8b5cf6';

        result.push({
          id: entry.id || String(i),
          name: entry.name,
          tenure: entry.tenure || 'Current Year (2025–26)',
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
  function setupLenisScroll() {
    if (typeof Lenis === 'undefined' || window.__teamsLenisInitialized) return;
    window.__teamsLenisInitialized = true;

    if (window.lenis) {
      globalLenis = window.lenis;
    } else if (!globalLenis) {
      try {
        globalLenis = new Lenis({
          lerp: 0.08,
          wheelMultiplier: 0.85,
          touchMultiplier: 1.2,
          smoothWheel: true,
          infinite: false,
          orientation: 'vertical',
          gestureOrientation: 'vertical'
        });
        window.lenis = globalLenis;
      } catch (e) {
        console.warn('Teams Lenis scroll init error:', e);
        return;
      }
    }

    // Synchronize Lenis with GSAP ScrollTrigger & Ticker for buttery smooth scrolling
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
  }

  function setupHeroAnimations() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo('.teams-tag',
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.05 }
    );

    tl.fromTo('.teams-title',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.3'
    );

    tl.fromTo('.teams-desc',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.35'
    );

    tl.fromTo('.teams-jump-nav',
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.3'
    );
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
