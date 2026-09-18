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
  if (!track || !guide) return;

  const nodes = JSON.parse(track.getAttribute("data-nodes"));
  const viewH = Number(track.getAttribute("data-view-h"));

  function pointOnPath(progress) {
    const segment = progress * (nodes.length - 1);
    const index = Math.min(nodes.length - 2, Math.floor(segment));
    const t = Math.min(1, segment - index);
    const from = nodes[index] || nodes[0];
    const to = nodes[index + 1] || from;
    const middleY = (from.y + to.y) / 2;
    const inverse = 1 - t;

    return {
      x:
        inverse ** 3 * from.x +
        3 * inverse ** 2 * t * from.x +
        3 * inverse * t ** 2 * to.x +
        t ** 3 * to.x,
      y:
        inverse ** 3 * from.y +
        3 * inverse ** 2 * t * middleY +
        3 * inverse * t ** 2 * middleY +
        t ** 3 * to.y,
    };
  }

  let targetPoint = pointOnPath(0);
  let currentPoint = { ...targetPoint };
  let animationFrame = null;

  function updateGuide() {
    const ease = 0.12;

    currentPoint.x += (targetPoint.x - currentPoint.x) * ease;
    currentPoint.y += (targetPoint.y - currentPoint.y) * ease;

    guide.style.left = `${currentPoint.x}%`;
    guide.style.top = `${(currentPoint.y / viewH) * 100}%`;

    const distance =
      Math.abs(targetPoint.x - currentPoint.x) +
      Math.abs(targetPoint.y - currentPoint.y);

    if (distance > 0.01) {
      animationFrame = requestAnimationFrame(updateGuide);
    } else {
      animationFrame = null;
    }
  }

  function onScroll() {
    const r = track.getBoundingClientRect();
    const vh = window.innerHeight;
    const firstNode = (nodes[0]?.y ?? 0) / viewH;
    const lastNode = (nodes[nodes.length - 1]?.y ?? viewH) / viewH;
    const start = r.top + r.height * firstNode;
    const finish = r.top + r.height * lastNode;
    const atPageEnd =
      window.scrollY + vh >= document.documentElement.scrollHeight - 2;

    const p = atPageEnd
      ? 1
      : (vh * 0.58 - start) / Math.max(1, finish - start);

    const progress = Math.min(1, Math.max(0, p));

    targetPoint = pointOnPath(progress);

    if (!animationFrame) {
      animationFrame = requestAnimationFrame(updateGuide);
    }
  }

  onScroll();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
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

