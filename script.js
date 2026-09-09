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

  // Initial draw & resize listeners
  window.addEventListener('resize', renderCanvas);
  window.addEventListener('DOMContentLoaded', renderCanvas);
  renderCanvas();
})();
