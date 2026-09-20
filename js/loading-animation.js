/**
 * MLSC Cinematic Loading Screen Controller
 * Controls loading progress, tile animation timing, skip action,
 * and seamless cinematic transition into the main page.
 */
(function () {
  'use strict';

  const loadingScreen = document.getElementById('mlsc-loading-screen');
  if (!loadingScreen) return;

  const skipBtn = document.getElementById('loading-skip-btn');
  let isDismissed = false;
  const MIN_DISPLAY_TIME_MS = 2800; // Complete tile-assemble (2.4s) and lettering-reveal (2.8s)
  const startTime = Date.now();

  // 1. Lock scrolling during loading
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  // 2. Smooth simulated progress tracking
  let progress = 0;
  let pageLoaded = false;
  let progressInterval = null;

  function updateProgress(val) {
    progress = Math.min(1, Math.max(0, val));
    loadingScreen.style.setProperty('--progress', progress.toString());
  }

  // Smoothly advance progress bar
  progressInterval = setInterval(() => {
    if (progress < 0.85) {
      updateProgress(progress + 0.035);
    } else if (pageLoaded && progress < 1) {
      updateProgress(progress + 0.05);
    }
  }, 50);

  function dismissLoadingScreen() {
    if (isDismissed) return;
    isDismissed = true;

    clearInterval(progressInterval);
    updateProgress(1);

    // Trigger cinematic zoom & fade exit
    loadingScreen.classList.add('loading-exit');

    // Unlock scrolling
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    // Awaken global smooth scroll & refresh GSAP triggers
    setTimeout(() => {
      if (window.lenis) {
        try {
          window.lenis.start();
          window.lenis.resize();
        } catch (e) {}
      }
      if (typeof ScrollTrigger !== 'undefined') {
        try {
          ScrollTrigger.refresh();
        } catch (e) {}
      }
      window.dispatchEvent(new Event('resize'));
    }, 400);

    // Completely hide after animation completes
    setTimeout(() => {
      loadingScreen.classList.add('loading-hidden');
      loadingScreen.setAttribute('aria-hidden', 'true');
    }, 1200);
  }

  // Check when both natural display duration and page load are satisfied
  function tryDismiss() {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY_TIME_MS - elapsed);
    setTimeout(() => {
      dismissLoadingScreen();
    }, remaining);
  }

  window.addEventListener('load', () => {
    pageLoaded = true;
    tryDismiss();
  });

  // Fallback timer in case load event takes too long or already passed
  if (document.readyState === 'complete') {
    pageLoaded = true;
    tryDismiss();
  } else {
    setTimeout(() => {
      if (!isDismissed) {
        pageLoaded = true;
        tryDismiss();
      }
    }, 4500);
  }

  // Skip button click
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissLoadingScreen();
    });
  }

  // Keyboard shortcut: Escape or Space to skip intro
  window.addEventListener('keydown', (e) => {
    if (!isDismissed && (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter')) {
      dismissLoadingScreen();
    }
  });
})();
