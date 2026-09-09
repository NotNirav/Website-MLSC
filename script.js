/**
 * MLSC Blank Canvas Script
 * Initializes and manages the 1500px height gradient canvas
 * Gradient: #0c0c0c -> #171717
 */

(function () {
  'use strict';

  const COLOR_START = '#0c0c0c';
  const COLOR_END = '#171717';
  const CANVAS_HEIGHT = 1500;

  const canvas = document.getElementById('gradient-canvas');
  const canvasContainer = document.getElementById('canvas-container');
  const ctx = canvas.getContext('2d');

  const btnGrid = document.getElementById('btn-grid');
  const btnRuler = document.getElementById('btn-ruler');
  const btnDirection = document.getElementById('btn-direction');
  const btnCopyCss = document.getElementById('btn-copy-css');
  const btnExport = document.getElementById('btn-export');
  const gridOverlay = document.getElementById('grid-overlay');
  const heightRuler = document.getElementById('height-ruler');
  const toast = document.getElementById('toast');

  let currentDirection = 'vertical'; // 'vertical' | 'diagonal' | 'radial'
  let showGrid = false;
  let showRuler = true;

  function renderCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const width = canvasContainer.clientWidth;
    const height = CANVAS_HEIGHT;

    // Set display dimensions
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    // Set internal resolution scaled by devicePixelRatio for ultra-sharp rendering
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    ctx.save();
    ctx.scale(dpr, dpr);

    let gradient;
    if (currentDirection === 'vertical') {
      // Top to bottom (0 -> 1200)
      gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, COLOR_START);
      gradient.addColorStop(1, COLOR_END);
    } else if (currentDirection === 'diagonal') {
      // Top-left to bottom-right
      gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, COLOR_START);
      gradient.addColorStop(1, COLOR_END);
    } else if (currentDirection === 'radial') {
      // Center outwards
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.max(width, height) / 1.5;
      gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, COLOR_END);
      gradient.addColorStop(1, COLOR_START);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // Toast notification helper
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  // Toggle Grid
  if (btnGrid) {
    btnGrid.addEventListener('click', () => {
      showGrid = !showGrid;
      gridOverlay.classList.toggle('visible', showGrid);
      btnGrid.classList.toggle('active', showGrid);
    });
  }

  // Toggle Ruler
  if (btnRuler) {
    btnRuler.addEventListener('click', () => {
      showRuler = !showRuler;
      heightRuler.style.opacity = showRuler ? '0.7' : '0';
      btnRuler.classList.toggle('active', showRuler);
    });
  }

  // Cycle Gradient Direction
  if (btnDirection) {
    const directions = ['vertical', 'diagonal', 'radial'];
    const labels = {
      vertical: 'Vertical (180°)',
      diagonal: 'Diagonal (135°)',
      radial: 'Radial Center'
    };

    btnDirection.addEventListener('click', () => {
      const nextIndex = (directions.indexOf(currentDirection) + 1) % directions.length;
      currentDirection = directions[nextIndex];
      btnDirection.textContent = labels[currentDirection];
      renderCanvas();
      showToast(`Gradient: ${labels[currentDirection]}`);
    });
  }

  // Copy CSS snippet
  if (btnCopyCss) {
    btnCopyCss.addEventListener('click', () => {
      let cssRule = '';
      if (currentDirection === 'vertical') {
        cssRule = `background: linear-gradient(180deg, ${COLOR_START} 0%, ${COLOR_END} 100%);\nheight: ${CANVAS_HEIGHT}px;`;
      } else if (currentDirection === 'diagonal') {
        cssRule = `background: linear-gradient(135deg, ${COLOR_START} 0%, ${COLOR_END} 100%);\nheight: ${CANVAS_HEIGHT}px;`;
      } else {
        cssRule = `background: radial-gradient(circle at center, ${COLOR_END} 0%, ${COLOR_START} 100%);\nheight: ${CANVAS_HEIGHT}px;`;
      }

      navigator.clipboard.writeText(cssRule).then(() => {
        showToast('CSS copied to clipboard!');
      }).catch(() => {
        showToast('Press Ctrl+C: ' + cssRule.replace('\n', ' '));
      });
    });
  }

  // Export 1500px PNG
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      // Create clean offline canvas for 1920x1500 export
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 1920;
      exportCanvas.height = CANVAS_HEIGHT;
      const exportCtx = exportCanvas.getContext('2d');

      let grad;
      if (currentDirection === 'vertical') {
        grad = exportCtx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        grad.addColorStop(0, COLOR_START);
        grad.addColorStop(1, COLOR_END);
      } else if (currentDirection === 'diagonal') {
        grad = exportCtx.createLinearGradient(0, 0, 1920, CANVAS_HEIGHT);
        grad.addColorStop(0, COLOR_START);
        grad.addColorStop(1, COLOR_END);
      } else {
        grad = exportCtx.createRadialGradient(960, 750, 0, 960, 750, 1200);
        grad.addColorStop(0, COLOR_END);
        grad.addColorStop(1, COLOR_START);
      }

      exportCtx.fillStyle = grad;
      exportCtx.fillRect(0, 0, 1920, CANVAS_HEIGHT);

      const link = document.createElement('a');
      link.download = `mlsc-canvas-1500px-${currentDirection}.png`;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();

      showToast('1500px Canvas downloaded as PNG!');
    });
  }

  // Initial draw & resize listener
  window.addEventListener('resize', renderCanvas);
  window.addEventListener('DOMContentLoaded', renderCanvas);
  renderCanvas();
})();
