# MLSC Website — Architecture & Content Layout Plan

## 1. Overview & Terminology
This plan outlines the structure and design blueprint for the **MLSC (Microsoft Learn Student Chapter / Club)** single-page website, built atop the existing `#0c0c0c` &rarr; `#171717` dark gradient canvas.

> [!NOTE]
> **Terminology Clarification ("Page" vs "Viewport"):**
> When referring to a "page" that occupies the entire area of the screen, the industry-standard term is **Viewport Height (`100vh` or `100dvh`)**. 
> - **1 Viewport (`100vh`)**: The user sees exactly this section filling 100% of their browser screen before scrolling.
> - **Scroll Interaction**: Scrolling down moves the user smoothly from one full-screen section to the next.

---

## 2. Vertical Structure & Dimension Budget

The total page layout gracefully spans the 2500px gradient canvas, structured into 4 primary zones:

| Section | Height Target | Description | Purpose |
| :--- | :--- | :--- | :--- |
| **0. Navigation** | Floating / Fixed (~64px) | Minimalist glassmorphic navbar | Brand logo, section anchors, CTA |
| **1. Hero Section** | **Full Screen (`100vh`)** (~800–900px) | First visual impression on landing | Tagline, mission statement, primary CTAs, scroll prompt |
| **2. About Now Section** | **Full Screen (`100vh`)** (~800–900px) | Complete second screen revealed on scroll | What MLSC is doing *now*, community pillars, key metrics |
| **3. Explore Section** | **Compact (~300px)** | Low-profile interactive hub | Quick cards to dive into Domains, Events, Projects |
| **4. Footer** | **Appropriate (~220–250px)** | Clean, balanced conclusion | Social links, copyright, newsletter/contact, campus credit |

### Visual Height Flow Diagram

```
+-------------------------------------------------------------+
|  [Navbar: Logo, Links (About, Explore), Join Button]        |
|                                                             |
|  1. HERO SECTION (100vh - Full Screen)                      |
|     • Impactful Typography: "Empowering Next-Gen Innovators"|
|     • Subtitle: MLSC Community & Tech Chapter               |
|     • Action Buttons: [Explore Now] [Join Community]        |
|     • Animated Subtle Down-Scroll Indicator ⌄              |
+-------------------------------------------------------------+
                              ↓ (Scroll)
+-------------------------------------------------------------+
|  2. ABOUT NOW SECTION (100vh - Full Screen)                 |
|     • Section Header: "About Now" / "What Drives Us"        |
|     • Narrative: Current initiatives, workshops & mission   |
|     • 3 or 4 Feature Pillars / Stat Cards (Glassmorphic)    |
|       - 500+ Members | 20+ Workshops | 15+ Live Projects    |
+-------------------------------------------------------------+
                              ↓ (Scroll)
+-------------------------------------------------------------+
|  3. EXPLORE SECTION (~300px Height)                         |
|     • Section Subhead: "Dive Deeper"                        |
|     • Compact 3-Card Carousel / Grid (~220px card height):  |
|       [ AI & Web Domains ] [ Upcoming Hackathons ] [ Repos ]|
+-------------------------------------------------------------+
                              ↓ (Scroll)
+-------------------------------------------------------------+
|  4. FOOTER (~220px Height)                                  |
|     • MLSC Logo & brief closing line                        |
|     • Social Icons (GitHub, LinkedIn, Discord, Instagram)   |
|     • Quick Navigation Links & Copyright © 2026 MLSC        |
+-------------------------------------------------------------+
```

---

## 3. Section-by-Section Detailed Design

### Section 1: Hero Section (`100vh` / Full Viewport)
- **Visual Style**: Minimalist, high-impact raw Black & White aesthetic.
- **Top Tab**: Removed for a completely clean, distraction-free entry.
- **Components**:
  1. **Centered Raw Title (`h1`)**: Pure stark white bold text `"MLSC"` centered in the middle of the viewport (`100vh`).
  2. **No descriptions, no buttons, no extra clutter** — pure raw visual identity on the dark gradient canvas.

---

### Section 2: About Now Section (`100vh`)
- **Visual Style**: Clean modern layout balancing storytelling and metrics without feeling cluttered.
- **Layout**: Split 2-column layout or structured grid:
  - **Left / Top**:
    - Tag: `[ 01 // ABOUT NOW ]`
    - Header: *"Where passion meets practical technology."*
    - Narrative: Explaining what MLSC is focusing on currently—hands-on open source, AI workshops, collaborative hackathons, and peer mentoring.
  - **Right / Bottom Cards**:
    - **Pillar 1 — Learn & Build**: Hands-on technical sessions covering modern cloud, AI, and web development.
    - **Pillar 2 — Open Collaboration**: Cross-domain project teams turning ideas into deployable software.
    - **Pillar 3 — Community First**: Inclusive networking, mentorship from seniors and industry alumni.
  - **Metrics Strip**: Key milestone badges (e.g., `500+ Active Members`, `12+ Flagship Events`, `100% Student Led`).

---

### Section 3: Explore Section (Strictly ~300px Height)
- **Constraint**: Designed specifically as a compact interactive banner (~300px vertical envelope) rather than a tall scrolling block.
- **Layout**: Horizontal interactive cards / flex row:
  - **Height**: Section wrapper `min-height: 300px; max-height: 340px;` with compact vertical padding (`32px 0`).
  - **Content Items (3 Compact Cards)**:
    1. **Tracks & Domains**: AI/ML, Cloud & DevOps, Web3, App Development.
    2. **Events & Hackathons**: Upcoming code sprints, speaker sessions, bootcamps.
    3. **Student Projects & Showcases**: Open-source repositories and member showcases.
  - **Interactions**: Subtle hover lift (`translateY(-4px)`), neon cyan edge glow, and "Explore &rarr;" arrow links.

---

### Section 4: Footer Section (~200px - 250px)
- **Visual Style**: Grounded, minimalist, and proportional.
- **Layout**:
  - **Top Row**:
    - Left: MLSC brand mark + "Empowering developers to shape tomorrow."
    - Center/Right: Quick links (`Home`, `About Now`, `Explore`, `Contact`, `Guidelines`).
  - **Bottom Row**:
    - Social Media Links: GitHub, LinkedIn, X/Twitter, Instagram, Discord.
    - Copyright notice: `© 2026 MLSC. All rights reserved.`
    - Subtle bottom separator line matching `--border-glass`.

---

## 4. Canvas Integration Strategy

The current codebase features a 2500px background canvas rendered with HTML5 Canvas API (`#0c0c0c` to `#171717`).

### How Content Will Sit on the Canvas:
1. **Canvas as Background Layer**:
   - The canvas element (`#gradient-canvas`) serves as the ultra-smooth background visual layer (fixed or spanning the page height).
2. **Foreground Content Layer**:
   - The DOM elements (`<header>`, `<section id="hero">`, `<section id="about">`, `<section id="explore">`, `<footer>`) sit in a clean `<main class="site-content">` wrapper positioned above the canvas (`z-index: 10`).
3. **Transitioning from Canvas Dev-Tools**:
   - The temporary development toolbar (Grid toggle, Ruler toggle, Height pill, Export PNG) can be gracefully switched off or converted into a standard user-facing Navbar (`MLSC Logo`, `Navigation links`, `Join Us button`).

---

## 5. Mobile & Responsiveness Strategy
- **Desktop (>1024px)**: Crisp full-viewport hero (`100vh`), full-viewport about section (`100vh`), horizontal 3-card explore section (300px), and slim footer.
- **Tablet (768px - 1024px)**: Sections adjust with fluid typography (`clamp()`), cards adapt to 2x2 or scrollable row.
- **Mobile (<768px)**: `100vh` adapts to `100dvh` (dynamic viewport height) to avoid mobile address bar jumps.

---

## 6. Implementation Steps (To Be Executed Upon Approval)
1. **Phase 1: HTML Semantic Skeleton**
   - Replace the developer demo watermark with `<section id="hero">`, `<section id="about">`, `<section id="explore">`, and `<footer id="footer">`.
   - Update the top bar into the main MLSC Navigation Bar.
2. **Phase 2: CSS Layout & Typography**
   - Define section height classes (`.screen-section` with `min-height: 100vh`, `.compact-section` with `height: 300px`, `.site-footer`).
   - Implement glassmorphism cards, modern font hierarchy, and responsive flex/grid layouts.
3. **Phase 3: JavaScript Micro-Interactions & Canvas Sizing**
   - Connect smooth-scrolling between the navbar links and section anchors.
   - Dynamically sync canvas height with the document content or retain the fixed 2500px gradient backdrop.
4. **Phase 4: Visual Polish & Review**
   - Verify alignment, contrast, responsive viewports, and hover states.
