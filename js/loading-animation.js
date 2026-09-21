/**
 * MLSC Cinematic Loading Screen Controller
 * Controls loading progress, pacing, and seamless cinematic transition into the main page.
 */
(function () {
  'use strict';

  const loadingScreen = document.getElementById('mlsc-loading-screen');
  if (!loadingScreen) return;

  let isDismissed = false;
  // Natural pacing: allow the complete 4-tile assembly (2.7s), lettering reveal (2.8s),
  // and settled breathing room (~1.0s) so the user can clearly appreciate the logo.
  const MIN_DISPLAY_TIME_MS = 3800;
  const startTime = Date.now();

  // Disable automatic scroll restoration on page reload
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // 1. Lock scrolling during loading & force scroll position to top (0, 0)
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  window.scrollTo(0, 0);

  function preventScroll(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  window.addEventListener('wheel', preventScroll, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false });

  // Continuously ensure scroll position stays strictly locked at top (0, 0)
  const lockScrollInterval = setInterval(() => {
    if (!isDismissed) {
      window.scrollTo(0, 0);
      if (window.lenis) {
        try {
          window.lenis.stop();
          window.lenis.scrollTo(0, { immediate: true });
        } catch (e) {}
      }
    } else {
      clearInterval(lockScrollInterval);
    }
  }, 50);

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
      updateProgress(progress + 0.018);
    } else if (pageLoaded && progress < 1) {
      updateProgress(progress + 0.035);
    }
  }, 60);

  function dismissLoadingScreen() {
    if (isDismissed) return;
    isDismissed = true;

    clearInterval(progressInterval);
    clearInterval(lockScrollInterval);
    updateProgress(1);

    // Force scroll position to top of Hero page
    window.scrollTo(0, 0);
    if (window.lenis) {
      try {
        window.lenis.scrollTo(0, { immediate: true });
      } catch (e) {}
    }

    // Remove event listeners blocking scroll
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);

    // Trigger smooth, pure-black cinematic fade exit
    loadingScreen.classList.add('loading-exit');

    // Awaken global smooth scroll & refresh GSAP triggers after the screen begins fading
    setTimeout(() => {
      window.scrollTo(0, 0);
      if (window.lenis) {
        try {
          window.lenis.scrollTo(0, { immediate: true });
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
      window.__mlscLandingComplete = true;
      window.dispatchEvent(new Event('mlsc-landing-complete'));
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
    }, 5500);
  }
})();