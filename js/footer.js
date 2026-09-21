/**
 * Shared Site Footer Component
 * Single source of truth for the MLSC Website footer across all pages and event-detail routes.
 */
(function () {
  'use strict';

  function initFooter() {
    if (window.__mlscFooterRendered && document.getElementById('footer')?.querySelector('.footer-container')) {
      return;
    }

    // 1. Resolve relative prefix for nested routes (e.g. /events/$slug)
    let basePrefix = '';
    const scriptTag =
      document.currentScript ||
      Array.from(document.querySelectorAll('script')).find(
        (s) => s.src && s.src.includes('footer.js')
      );

    if (scriptTag) {
      const srcAttr = scriptTag.getAttribute('src') || '';
      const match = srcAttr.match(/^(\.\.\/)+/);
      if (match) {
        basePrefix = match[0];
      }
    }

    if (!basePrefix) {
      const normalizedPath = window.location.pathname.replace(/\\/g, '/');
      const segments = normalizedPath.split('/').filter(Boolean);
      const eventsIdx = segments.indexOf('events');
      if (eventsIdx !== -1 && eventsIdx < segments.length - 1) {
        basePrefix = '../';
      }
    }

    // 2. Ensure footer stylesheet is present
    if (!document.querySelector('link[href*="footer.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = basePrefix + 'css/footer.css';
      document.head.appendChild(link);
    }

    // 3. Resolve navigation paths based on current page
    const pathname = window.location.pathname.toLowerCase();
    const isHomePage =
      pathname === '' ||
      pathname === '/' ||
      pathname.endsWith('/index.html') ||
      pathname.endsWith('\\index.html');

    const brandHref = isHomePage ? '#hero' : basePrefix + 'index.html#hero';
    const homeHref = isHomePage ? '#hero' : basePrefix + 'index.html#hero';
    const aboutHref = isHomePage ? '#about' : basePrefix + 'index.html#about';
    const exploreHref = isHomePage ? '#explore' : basePrefix + 'index.html#explore';
    const contactHref = isHomePage ? '#contact' : basePrefix + 'index.html#contact';

    // 4. Shared Single-Source Footer Template (exact match with index.html)
    const footerContent = `
      <div class="footer-container">
        <div class="footer-top">
          <div class="footer-brand">
            <a href="${brandHref}" class="footer-brand-header" aria-label="Microsoft Learn Student Chapter Home">
              <svg class="mlsc-logo-icon" width="43" height="28" viewBox="0 0 43 28" fill="none"
                xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <!-- Top row: col 2 (Orange), col 3 (Green) -->
                <rect x="15" y="0" width="13" height="13" rx="1.5" fill="#F25022" class="mlsc-sq mlsc-sq-orange" />
                <rect x="30" y="0" width="13" height="13" rx="1.5" fill="#7FBA00" class="mlsc-sq mlsc-sq-green" />
                <!-- Bottom row: col 1 (Blue), col 2 (Yellow) -->
                <rect x="0" y="15" width="13" height="13" rx="1.5" fill="#00A4EF" class="mlsc-sq mlsc-sq-blue" />
                <rect x="15" y="15" width="13" height="13" rx="1.5" fill="#FFB900" class="mlsc-sq mlsc-sq-yellow" />
              </svg>
              <span class="footer-brand-title">Microsoft Learn Student Chapter</span>
            </a>
            <p class="footer-tagline">Building a community of tech enthusiasts, creators, and innovators.</p>
          </div>

          <div class="footer-links-group">
            <div class="footer-col">
              <span class="footer-heading">Navigation</span>
              <a href="${homeHref}">Home</a>
              <a href="${aboutHref}">About</a>
              <a href="${exploreHref}">Explore</a>
              <a href="${contactHref}">Contact</a>
            </div>
            <div class="footer-col">
              <span class="footer-heading">Connect With Us</span>
              <a href="https://www.linkedin.com/company/mlsc-pccoe-chapter" target="_blank"
                rel="noopener noreferrer" class="footer-social-link" aria-label="Connect on LinkedIn">
                <svg class="footer-social-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
                  aria-hidden="true">
                  <path
                    d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
                </svg>
                <span>LinkedIn</span>
              </a>
              <a href="https://www.instagram.com/mlscpccoe/" target="_blank" rel="noopener noreferrer"
                class="footer-social-link" aria-label="Follow on Instagram">
                <svg class="footer-social-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
                  aria-hidden="true">
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="footer-copy">&copy; 2026 Microsoft Learn Student Chapter. All rights reserved.</p>
        </div>
      </div>
    `;

    // 5. Locate or create mount element
    let mountEl = document.getElementById('footer') || document.querySelector('.site-footer');

    if (!mountEl) {
      // Check if .footer-space placeholder exists (event detail layout)
      const placeholder = document.querySelector('.footer-space');
      if (placeholder) {
        mountEl = document.createElement('footer');
        placeholder.parentNode.replaceChild(mountEl, placeholder);
      }
    }

    if (mountEl) {
      mountEl.className = 'site-footer';
      mountEl.id = 'footer';
      mountEl.setAttribute('aria-label', 'Site Footer');
      mountEl.innerHTML = footerContent;
    } else {
      const newFooter = document.createElement('footer');
      newFooter.className = 'site-footer';
      newFooter.id = 'footer';
      newFooter.setAttribute('aria-label', 'Site Footer');
      newFooter.innerHTML = footerContent;

      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.appendChild(newFooter);
      } else {
        document.body.appendChild(newFooter);
      }
    }

    window.__mlscFooterRendered = true;
  }

  window.initSharedFooter = initFooter;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
  } else {
    initFooter();
  }
})();
