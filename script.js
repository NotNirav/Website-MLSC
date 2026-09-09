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

  function updateHamburgerVisibility() {
    if (!hero || !hamburger) return;
    const heroRect = hero.getBoundingClientRect();
    // Hamburger only shows from 2nd viewport and onwards (when hero is scrolled out of view)
    const inSecondViewportOrBeyond = heroRect.bottom <= 120;
    if (inSecondViewportOrBeyond) {
      hamburger.classList.add('visible');
    } else {
      hamburger.classList.remove('visible');
      closeSidebar();
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
    link.addEventListener('click', () => {
      closeSidebar();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarDrawer && sidebarDrawer.classList.contains('open')) {
      closeSidebar();
    }
  });

  window.addEventListener('scroll', updateHamburgerVisibility, { passive: true });
  window.addEventListener('resize', updateHamburgerVisibility);

  // Initial draw & resize listeners
  window.addEventListener('resize', renderCanvas);
  window.addEventListener('DOMContentLoaded', () => {
    renderCanvas();
    updateHamburgerVisibility();
  });
  renderCanvas();
  updateHamburgerVisibility();
})();
