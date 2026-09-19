// MLSC PCCOE — shared interactivity for the plain HTML/CSS/JS site.

function typewriter(el) {
  const text = el.getAttribute("data-text") || "";
  const speed = Number(el.getAttribute("data-speed") || 45);
  const delay = Number(el.getAttribute("data-delay") || 0);

  const visible = document.createElement("span");
  visible.setAttribute("aria-hidden", "true");
  const full = document.createElement("span");
  full.className = "sr-only";
  full.textContent = text;
  const caret = document.createElement("span");
  caret.className = "caret";
  caret.setAttribute("aria-hidden", "true");

  el.textContent = "";
  el.appendChild(visible);
  el.appendChild(full);
  el.appendChild(caret);

  let count = 0;
  function tick() {
    if (count >= text.length) return;
    count += 1;
    visible.textContent = text.slice(0, count);
    setTimeout(tick, speed);
  }
  setTimeout(tick, delay);
}

function initTypewriters() {
  document.querySelectorAll("[data-typewriter]").forEach(typewriter);
}

function initLandingParallax() {
  const stage = document.querySelector("[data-landing]");
  const glow = document.querySelector("[data-landing-glow]");
  const cta = document.querySelector("[data-landing-cta]");
  if (!stage || !glow) return;

  stage.addEventListener("mousemove", (e) => {
    const r = stage.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    glow.style.background = `radial-gradient(520px circle at ${x}% ${y}%, rgba(217, 184, 97, 0.12), transparent 68%)`;
  });

  if (cta) {
    setTimeout(() => cta.classList.add("ready"), 1500);
  }
}

const SPARKS = [
  { x: 12, y: 18, s: 16, d: 0.2 },
  { x: 82, y: 14, s: 22, d: 0.5 },
  { x: 26, y: 72, s: 14, d: 0.9 },
  { x: 70, y: 78, s: 20, d: 1.2 },
  { x: 50, y: 8, s: 26, d: 0.05 },
  { x: 92, y: 52, s: 12, d: 1.5 },
  { x: 6, y: 46, s: 18, d: 1.1 },
  { x: 60, y: 40, s: 12, d: 1.8 },
];

function initSparkles() {
  const container = document.querySelector("[data-sparkles]");
  if (!container) return;
  SPARKS.forEach((s) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", String(s.s));
    svg.setAttribute("height", String(s.s));
    svg.style.left = `${s.x}%`;
    svg.style.top = `${s.y}%`;
    svg.style.animation = `sparkle-burst 2.4s ease-out ${s.d}s infinite`;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M12 0c1.2 7 4.8 10.6 12 12-7.2 1.4-10.8 5-12 12-1.2-7-4.8-10.6-12-12C7.2 10.6 10.8 7 12 0z",
    );
    path.setAttribute("fill", "rgb(255,206,110)");
    svg.appendChild(path);
    container.appendChild(svg);
  });
}

// ===== Interactive Events Roadmap: GSAP ScrollTrigger + SVG Path Flight =====

function initRoadmap() {
  const container = document.querySelector("#roadmap-track-container");
  const path = document.querySelector("#roadmapActivePath");
  const mascot = document.querySelector("#guide-mascot");
  const mascotInner = mascot ? mascot.querySelector(".mascot-flight-inner") : null;
  const stations = document.querySelectorAll(".roadmap-station");

  if (!container || !path || !mascot) return;

  const totalLength = typeof path.getTotalLength === "function" ? path.getTotalLength() : 0;
  if (totalLength === 0) return;

  function updateRoadmap(progress) {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const len = clampedProgress * totalLength;
    const pt = path.getPointAtLength(len);

    // Calculate tangent angle for natural banking tilt into curves
    const aheadLen = Math.min(totalLength, len + 4);
    const behindLen = Math.max(0, len - 4);
    const ptAhead = path.getPointAtLength(aheadLen);
    const ptBehind = path.getPointAtLength(behindLen);
    const dx = ptAhead.x - ptBehind.x;
    const bank = Math.max(-14, Math.min(14, dx * 0.3));

    // Convert SVG viewBox (1000 x 1600) to percentage
    const pctX = (pt.x / 1000) * 100;
    const pctY = (pt.y / 1600) * 100;

    mascot.style.left = `${pctX.toFixed(2)}%`;
    mascot.style.top = `${pctY.toFixed(2)}%`;

    if (mascotInner) {
      mascotInner.style.transform = `rotate(${bank.toFixed(1)}deg)`;
    }

    // Activate stations as dragon arrives near them
    const stationCount = stations.length;
    stations.forEach((station, idx) => {
      const stationProgress = stationCount > 1 ? idx / (stationCount - 1) : 0;
      if (clampedProgress >= stationProgress - 0.05) {
        station.classList.add("is-active");
      } else {
        station.classList.remove("is-active");
      }
    });
  }

  // Initial position
  updateRoadmap(0);

  // GSAP ScrollTrigger synchronization with Lenis
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    const tracker = { progress: 0 };
    gsap.to(tracker, {
      progress: 1,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top 72%",
        end: "bottom 68%",
        scrub: 0.35,
        onUpdate: (self) => {
          updateRoadmap(self.progress);
        },
      },
    });

    window.addEventListener("load", () => {
      ScrollTrigger.refresh();
    });
  } else {
    // Graceful scroll fallback
    const onScrollFallback = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = rect.top - vh * 0.72;
      const totalSpan = rect.height * 0.96;
      const p = Math.max(0, Math.min(1, -start / totalSpan));
      updateRoadmap(p);
    };
    window.addEventListener("scroll", onScrollFallback, { passive: true });
    onScrollFallback();
  }
}
// ===== Duplicate belt items so the marquee loops seamlessly =====

function initBelts() {
  document.querySelectorAll("[data-belt]").forEach((belt) => {
    const track = belt.querySelector(".belt-track, .belt-track-reverse");
    if (!track || track.getAttribute("data-doubled")) return;
    track.innerHTML += track.innerHTML;
    track.setAttribute("data-doubled", "true");
  });
}

// ===== Staggered rise-in animation for gallery photos =====

function initRiseDelays() {
  document.querySelectorAll("[data-rise-index]").forEach((el) => {
    const i = Number(el.getAttribute("data-rise-index"));
    el.style.animationDelay = `${i * 70}ms`;
  });
}

// ===== Mount shared footer on event pages =====

function initEventFooter() {
  if (typeof window.initSharedFooter === "function") {
    window.initSharedFooter();
    return;
  }

  if (!document.querySelector('script[src*="footer.js"]')) {
    const isNested = window.location.pathname.replace(/\\/g, '/').includes('/events/');
    const script = document.createElement("script");
    script.src = isNested ? "../footer.js" : "footer.js";
    document.body.appendChild(script);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTypewriters();
  initLandingParallax();
  initSparkles();
  initBelts();
  initRiseDelays();
  initRoadmap();
  initEventFooter();
});

