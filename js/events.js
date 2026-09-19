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

// ===== Roadmap page: guide mascot follows the path on scroll =====

function initRoadmap() {
  const track = document.querySelector("[data-track]");
  const guide = document.querySelector("[data-guide]");
  const path = document.querySelector("#roadmapPath");
  if (!track || !guide) return;

  const nodes = JSON.parse(track.getAttribute("data-nodes") || "[]");
  const viewH = Number(track.getAttribute("data-view-h") || 600);
  const totalLength = path && path.getTotalLength ? path.getTotalLength() : 0;

  function pointOnPath(progress) {
    if (path && totalLength > 0) {
      const len = Math.max(0, Math.min(totalLength, progress * totalLength));
      const pt = path.getPointAtLength(len);
      const aheadLen = Math.min(totalLength, len + 1.5);
      const behindLen = Math.max(0, len - 1.5);
      const ptAhead = path.getPointAtLength(aheadLen);
      const ptBehind = path.getPointAtLength(behindLen);
      const dx = ptAhead.x - ptBehind.x;
      const bank = Math.max(-10, Math.min(10, dx * 1.5));
      return { x: pt.x, y: pt.y, tilt: bank };
    }

    const segment = progress * (nodes.length - 1);
    const index = Math.min(nodes.length - 2, Math.floor(segment));
    const t = Math.min(1, segment - index);
    const from = nodes[index] || nodes[0];
    const to = nodes[index + 1] || from;
    const dy = to.y - from.y;
    const cp1y = from.y + 0.38 * dy;
    const cp2y = to.y - 0.38 * dy;
    const inverse = 1 - t;

    const x =
      inverse ** 3 * from.x +
      3 * inverse ** 2 * t * from.x +
      3 * inverse * t ** 2 * to.x +
      t ** 3 * to.x;
    const y =
      inverse ** 3 * from.y +
      3 * inverse ** 2 * t * cp1y +
      3 * inverse * t ** 2 * cp2y +
      t ** 3 * to.y;

    const dx = to.x - from.x;
    const tilt = Math.max(-10, Math.min(10, dx * 0.25));
    return { x, y, tilt };
  }

  let targetProgress = 0;
  let currentProgress = 0;
  let currentTilt = 0;
  let animationFrame = null;

  function renderGuide(progress, tilt) {
    const pt = pointOnPath(progress);
    guide.style.left = `${pt.x}%`;
    guide.style.top = `${(pt.y / viewH) * 100}%`;
    guide.style.transform = `translate(-50%, -50%) rotate(${tilt.toFixed(2)}deg)`;
  }

  function updateGuide() {
    const ease = 0.08;
    currentProgress += (targetProgress - currentProgress) * ease;
    const targetPt = pointOnPath(currentProgress);
    currentTilt += (targetPt.tilt - currentTilt) * 0.1;

    renderGuide(currentProgress, currentTilt);

    const diff = Math.abs(targetProgress - currentProgress);
    if (diff > 0.0003) {
      animationFrame = requestAnimationFrame(updateGuide);
    } else {
      currentProgress = targetProgress;
      renderGuide(currentProgress, targetPt.tilt);
      animationFrame = null;
    }
  }

  function onScroll() {
    const r = track.getBoundingClientRect();
    const vh = window.innerHeight;
    const firstNode = (nodes[0]?.y ?? 70) / viewH;
    const lastNode = (nodes[nodes.length - 1]?.y ?? 530) / viewH;
    const start = r.top + r.height * firstNode;
    const finish = r.top + r.height * lastNode;
    const triggerY = vh * 0.52;

    const atPageEnd =
      window.scrollY + vh >= document.documentElement.scrollHeight - 10;

    const p = atPageEnd
      ? 1
      : (triggerY - start) / Math.max(1, finish - start);

    targetProgress = Math.min(1, Math.max(0, p));

    if (!animationFrame) {
      animationFrame = requestAnimationFrame(updateGuide);
    }
  }

  onScroll();
  currentProgress = targetProgress;
  const initialPt = pointOnPath(currentProgress);
  renderGuide(currentProgress, initialPt.tilt);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  const pollLenis = () => {
    const l = window.lenis || window.globalLenis;
    if (l && typeof l.on === "function") {
      l.on("scroll", onScroll);
    } else {
      setTimeout(pollLenis, 300);
    }
  };
  pollLenis();
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

document.addEventListener("DOMContentLoaded", () => {
  initTypewriters();
  initLandingParallax();
  initSparkles();
  initBelts();
  initRiseDelays();
  initRoadmap();
});
