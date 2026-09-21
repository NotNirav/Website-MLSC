/**
 * MLSC Cinematic Loading Screen Controller
 * Controls loading progress, pacing, and seamless cinematic transition into the main page.
 */
(function () {
  'use strict';

  const loadingScreen = document.getElementById('mlsc-loading-screen');
  if (!loadingScreen) return;

  let isDismissed = false;
  // Balanced "just right" pacing: snappy assembly (~1.5s) with ~0.7s settled visibility before zoom
  const MIN_DISPLAY_TIME_MS = 2200;
  const startTime = Date.now();

  // 1. Lock scrolling during loading
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  // 2. Smooth simulated progress tracking calibrated to the ~3.8s duration
  let progress = 0;
  let pageLoaded = false;
  let progressInterval = null;

  function updateProgress(val) {
    progress = Math.min(1, Math.max(0, val));
    loadingScreen.style.setProperty('--progress', progress.toString());
  }

  // Smoothly increment progress bar over the display duration
  progressInterval = setInterval(() => {
    if (progress < 0.88) {
      updateProgress(progress + 0.026);
    } else if (pageLoaded && progress < 1) {
      updateProgress(progress + 0.05);
    }
  }, 50);

  function dismissLoadingScreen() {
    if (isDismissed) return;
    isDismissed = true;

    clearInterval(progressInterval);
    updateProgress(1);

    // Trigger smooth, pure-black cinematic fade exit
    loadingScreen.classList.add('loading-exit');

    // Awaken global smooth scroll & refresh GSAP triggers after the screen begins fading
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

    // Unlock scrolling once the zoom transition is comfortably underway
    setTimeout(() => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }, 1100);

    // Completely hide after the 1.6s transition finishes
    setTimeout(() => {
      loadingScreen.classList.add('loading-hidden');
      loadingScreen.setAttribute('aria-hidden', 'true');
    }, 1600);
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
    }, 3500);
  }
})();
