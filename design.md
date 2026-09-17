# MLSC Main Page — Design System & Architectural Specification

## 1. Overview & Architecture Strategy
This document defines the visual design system, technical architecture, and component layout for the **Microsoft Learn Student Chapter (MLSC)** single-page web application (`index.html`).

The website operates strictly as a **Single-Page Application (SPA) / Unified Viewport Experience** anchored on a single main HTML page (`index.html`), eliminating multi-page fragmentation in favor of a cohesive, high-performance scroll experience.

---

## 2. Design System & Palette

### Color System
- **Background App Baseline (`--bg-app`)**: `#080808`
- **Canvas Gradient Top (`--color-start`)**: `#0c0c0c`
- **Canvas Gradient Bottom (`--color-end`)**: `#171717`
- **Primary Text (`--text-main`)**: `#f3f4f6` (Stark off-white)
- **Muted Text (`--text-muted`)**: `#9ca3af`
- **Dim Text (`--text-dim`)**: `#6b7280`

### Brand Accent Palette (Microsoft Chapter Quad)
- **MLSC Red / Orange (`--accent-orange`)**: `#F25022` (Glow: `rgba(242, 80, 34, 0.2)`)
- **MLSC Green (`--accent-green`)**: `#7FBA00`
- **MLSC Blue (`--accent-blue`)**: `#00A4EF` (Glow: `rgba(0, 164, 239, 0.2)`)
- **MLSC Yellow (`--accent-yellow`)**: `#FFB900`
- **Cyan Accent (`--accent`)**: `#38bdf8` (Glow: `rgba(56, 189, 248, 0.2)`)

### Glassmorphism & Materials
- **Glass Border (`--border-glass`)**: `rgba(255, 255, 255, 0.08)`
- **Glass Card Background (`--glass-card`)**: `rgba(22, 22, 22, 0.65)`
- **Glass Blur (`--glass-blur`)**: `backdrop-filter: blur(16px)` / `blur(28px)`
- **Smooth Transition**: `all 0.3s cubic-bezier(0.16, 1, 0.3, 1)`

---

## 3. Background Layer — HTML5 Canvas Gradient

The entire website content sits atop an interactive HTML5 `<canvas id="gradient-canvas">` element.

### Canvas Technical Specifications
- **Render Mode**: High-DPI hardware-scaled rendering using `window.devicePixelRatio`.
- **Canvas Bounds**: Scaled dynamically to match `canvas-container` scroll height (`min-height: 2500px`).
- **Gradient Vector**: Vertical linear gradient `ctx.createLinearGradient(0, 0, 0, containerHeight)`.
- **Stops**: `0%` &rarr; `#0c0c0c`, `100%` &rarr; `#171717`.
- **Positioning**: `position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none;`.

---

## 4. Main Page Structure (`index.html`)

The single main page is structured into 4 sequential vertical zones inside the `.site-content` overlay container (`z-index: 10`):

```
+-------------------------------------------------------+
| 0. Glass Navigation Bar (Sticky after 1st Viewport)   |
+-------------------------------------------------------+
| 1. Hero Section (100vh / Full Viewport)               |
|    - Raw Centered "MLSC" Branding Title               |
+-------------------------------------------------------+
| 2. About Us Section (100vh / Full Viewport)           |
|    - Glassmorphic Container + 3D FluidGlass Root      |
|    - MLSC Mission Statement & Highlights              |
+-------------------------------------------------------+
| 3. Explore Section (ScrollStack Cards)                |
|    - Events Card                                      |
|    - Teams Card                                       |
|    - Achievements Card                                |
|    - Games Card                                       |
|    - Home Return Card                                 |
+-------------------------------------------------------+
| 4. Site Footer (~220px Height Envelope)               |
|    - Brand Mark, Quick Anchors & Social Links         |
+-------------------------------------------------------+
```

### Zone Breakdown

#### 1. Header Navigation (`.glass-navbar`)
- **Trigger**: Appears smoothly as the user scrolls past the Hero fold (`100vh`).
- **Material**: Frosted glassmorphic pill backdrop with brand icon (`MLSC` colored quad logo) and smooth anchor navigation links.

#### 2. Hero Section (`#hero`)
- **Height**: `100vh` (Full Viewport Height / `100dvh` on mobile).
- **Aesthetic**: Minimalist stark typography. Centered hero text `MLSC` with distinct brand color accents per letter.

#### 3. About Us Section (`#about`)
- **Height**: `100vh` (Full Viewport Height).
- **Glass Showcase Box**: `.about-glass-box` with heavy backdrop blur (`backdrop-filter: blur(28px)`).
- **3D Interactive Element**: Mount point `#fluid-glass-root` for WebGL / Three.js fluid glass shader background.

#### 4. Explore Section (`#explore`)
- **Pattern**: Native Window ScrollStack.
- **Cards**:
  1. **Events**: BlueBit, Praxis, Techroom highlights.
  2. **Teams**: Core coders, creators, and chapter leads.
  3. **Achievements**: Milestones and hackathon awards.
  4. **Games**: Interactive mini-games for campus breaks.
  5. **Home**: Quick return anchor back to Hero.

#### 5. Footer (`#footer`)
- **Height Envelope**: `220px` - `250px`.
- **Layout**: Dual-row structure. Top row contains MLSC chapter branding, mission summary, navigation anchors, and social links (LinkedIn, Instagram). Bottom row displays copyright notice.

---

## 5. Animation & Inertia Architecture
- **Smooth Scrolling Engine**: Lenis Smooth Scroll calibrated with weighted liquid inertia (`lerp: 0.06`, `wheelMultiplier: 0.72`).
- **Animation Syncing**: GSAP & ScrollTrigger synced to Lenis ticker for zero-jitter 60fps rendering.
- **Card Spotlight**: Mouse-driven CSS variable tracking (`--mouse-x`, `--mouse-y`) for dynamic radial spotlight highlights on hover.
