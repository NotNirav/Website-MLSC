# MLSC PCCOE Website: Complete Product and Prompt Brief

This document explains the existing MLSC PCCOE website in a form that can be given to another LLM, designer, developer, or product team. It describes the product purpose, information architecture, visual language, page layouts, interaction flows, content data, technical behavior, and design constraints.

Use this document as the source of truth when proposing a redesign, generating UI screens, writing copy, or extending the site. Preserve the existing identity and user journeys unless a change is explicitly requested.

## 1. Product Definition

The product is the public website for Microsoft Learn Student Chapter PCCOE, a student-led technology community at Pimpri Chinchwad College of Engineering in Pune, India.

The website should make the visitor feel that MLSC is:

- A creative, technically ambitious student community.
- A place to learn by building with other people.
- A chapter with real events, teams, achievements, and momentum.
- Modern and expressive, but still usable, readable, and trustworthy.

The central message is: **Learn. Build. Belong.** Supporting ideas are curiosity, collaboration, experimentation, innovation, and real-world impact.

The primary audience includes:

- PCCOE students discovering the chapter.
- Students considering joining a technical or non-technical team.
- Participants, speakers, sponsors, and collaborators researching MLSC events.
- Visitors who want to understand the chapter's history and achievements.

## 2. Experience Model

The website is a static, multi-page HTML/CSS/JavaScript site with a shared visual system. It is not a dashboard or an application with authentication. Content is local, mostly compiled into HTML or JavaScript, with team data stored in CSV.

The experience is intentionally cinematic and scroll-led:

1. The visitor enters through a branded loading/reveal moment on the home page.
2. The visitor sees a strong MLSC identity before reading detailed content.
3. Scrolling reveals the chapter story in full-screen sections.
4. The Explore section routes visitors into Events, Teams, Achievements, or Games.
5. Each destination page has one dominant interaction instead of a generic grid.
6. Every page returns to the same global navigation and footer.

The website should feel like one coherent universe, while each major page has its own accent and metaphor:

| Page | Primary metaphor | Accent |
| --- | --- | --- |
| Home | Cinematic chapter introduction and discovery stack | Four-color MLSC palette |
| Events | A road or journey through event milestones | Microsoft blue, green, yellow, red by milestone |
| Teams | A living archive of people and domains | Microsoft blue with team-specific accents |
| Achievements | Progress through time plus a rotating record of wins | Microsoft red and electric blue |
| Games | A retro-futurist arcade cabinet | Microsoft yellow |
| Event details | Editorial event story and photo memory | Event-specific accent |
| 404 | Developer-style route failure screen | Four-color MLSC palette |

## 3. Global Visual System

### 3.1 Theme

- Base background: pure black, approximately `#000000`.
- Primary text: white or near-white, approximately `#f3f4f6`.
- Secondary text: cool gray, approximately `#9ca3af`.
- Supporting dim text: approximately `#6b7280`.
- Surfaces: translucent near-black glass, usually with a thin white border and backdrop blur.
- Avoid white page backgrounds, generic corporate blue layouts, excessive cards, and unrelated decorative textures.

### 3.2 Brand colors

Use the four Microsoft-style MLSC colors as meaningful signals, not as random decoration:

- Red/orange: `#f25022`, energy, events, urgency, active moments.
- Green: `#7fba00`, growth, community, progress.
- Blue: `#00a4ef`, technology, navigation, the main shared accent.
- Yellow: `#ffb900`, ideas, highlights, games, achievement.

The MLSC logo is a four-tile mark. The tiles form a compact asymmetric 2 by 2 composition: orange and green on top, blue and yellow below, with the wordmark often rendered as color-separated M, L, S, and C letters.

### 3.3 Typography

- Main typeface: Plus Jakarta Sans, with weights from regular through extra-bold.
- Technical labels and metadata: JetBrains Mono.
- Some loading-animation code uses Geist, but the main static site should visually prioritize Plus Jakarta Sans and JetBrains Mono.
- Large headings are bold, compact, and confident. Body copy is comfortable and readable.
- Use uppercase monospace labels sparingly for status, metadata, route labels, and scroll hints.

### 3.4 Shape, depth, and motion

- Use restrained glass surfaces: translucent dark fill, subtle border, blur, and a soft shadow.
- Use rounded corners for interface controls and glass cards, but do not turn every section into a floating rounded card.
- Sections should generally be unframed, full-width compositions. Cards are for repeated content, framed tools, or focused interactive objects.
- Motion should explain state or create atmosphere: scroll reveals, parallax, coverflow depth, route progress, mascot flight, marquee belts, and soft floating mascots.
- Use Lenis for smooth scrolling and GSAP ScrollTrigger for scroll synchronization where available.
- Respect reduced-motion preferences in future work. The current implementation is animation-heavy and should be enhanced with a reduced-motion fallback.

### 3.5 Shared navigation

Every major page uses a pinned glass navigation bar with:

- MLSC logo mark and wordmark on the left.
- Links: Home, Events, Teams, Achievements, Games.
- The current route marked active.
- Home links point to `index.html#hero` from inner pages.
- On the home page, the navbar is initially hidden during the first hero viewport and becomes visible from the below-fold content onward.

The navigation must remain readable over black backgrounds and must never cover important hero copy. On small screens, it must either compress responsibly or provide a clear mobile navigation pattern.

### 3.6 Shared footer

The footer is injected by `js/footer.js` and is the single shared footer implementation. It contains:

- MLSC brand lockup.
- Tagline: "Building a community of tech enthusiasts, creators, and innovators."
- Navigation links: Home, About, Explore, Contact.
- LinkedIn and Instagram links.
- Copyright line for Microsoft Learn Student Chapter.

The footer resolves relative paths for nested event detail pages, so future route additions must preserve this behavior.

## 4. Site Map and Routes

### Primary pages

- `index.html`: home, chapter introduction, about, discovery, contact.
- `events.html`: interactive event roadmap.
- `teams.html`: team archive and member carousels.
- `achievements.html`: chapter journey, winners, and leaderboard content.
- `games.html`: arcade lobby and embedded Flappy Dragon game.
- `404.html`: route recovery and keyboard navigation.
- `contact.html`: immediate redirect to `index.html#contact`.

### Event detail pages

- `events/mlsc-inauguration.html`
- `events/tech-room.html`
- `events/praxis.html`
- `events/datathon.html`
- `events/code-sprint.html`
- `events/bluebit-hackathon.html`

Every detail page uses the same editorial structure: back link, event title, typewriter intro, mascot, quote, event description, highlight cards, photo gallery, next-event link, and footer.

## 5. Home Page: Full Flow and Placement

### 5.1 Entry/loading sequence

The home page begins with a fixed, full-viewport cinematic loading screen. It behaves like a small theater:

1. A dark cinema-room image fills the screen.
2. A central projection screen glows softly.
3. The MLSC lettering and four colored tiles appear as a projection.
4. The caption "Learn. Build. Belong." anchors the reveal.
5. The top-left identity reads Microsoft Learn Student Chapter.
6. The top-right location reads PCCOE, PUNE.
7. A progress line runs along the bottom.
8. The screen exits through a slow zoom/dissolve into the black website.

The loading screen is primarily a brand reveal, not a data-loading indicator. It should never trap the visitor. It must have a sensible fallback if JavaScript or an image fails.

There is also a separate `loading-animation/` Next.js package containing the cinematic experience source. It is a design/prototyping implementation with pause, replay, skip, fullscreen, chapter indicator, and reveal controls. The main static page uses the compiled/static equivalent in `css/loading-animation.css` and `js/loading-animation.js`.

### 5.2 Hero viewport

The first visible website viewport is deliberately minimal:

- Full viewport black background.
- Very large MLSC wordmark, centered.
- Individual letters carry the brand colors.
- A Praxis mascot image is positioned near the upper-right edge.
- No dense navigation or explanatory paragraph competes with the wordmark.

On scroll, the wordmark moves downward, scales down, and fades. The hero is an identity statement and visual reset before the visitor enters the story.

### 5.3 About Us viewport

The About section is a full-screen explanatory section placed after the hero.

Placement:

- Section label and four-dot brand indicator near the content header.
- Main title: "About Us".
- A large glass content surface centered in the viewport.
- FluidGlass React content can mount into `#fluid-glass-root`.
- Text fallback remains in the HTML so the message is available if the bundle is unavailable.

Content hierarchy:

1. Explain MLSC as a student-driven technology community.
2. Mention emerging technology, collaboration, and learning beyond the classroom.
3. Reference flagship events such as BlueBit, TechRoom, and Praxis.
4. End with the quote: "Technology is best learned when it is explored together."
5. Close with the promise: "A space to learn, create, collaborate, and make an impact."

The section enters with a gentle elevation/reveal rather than a dramatic page transition.

### 5.4 Explore section

The Explore section is a scroll-stacked discovery menu, not a standard card grid.

It contains five vertically stacked cards:

1. Events: coding, creating, and innovating through BlueBit, Praxis, and TechRoom.
2. Teams: the coders and creators behind MLSC.
3. Achievements: milestones that define the chapter journey.
4. Games: quick mini-games and a playful break.
5. Home: return to the top and explore again.

As the visitor scrolls, cards pin near a common stack position, scale slightly, and layer behind one another. Each card has one arrow action. The interaction should communicate discovery and route choice without overwhelming the visitor.

### 5.5 Contact section

The home page ends with a full-screen Get in Touch section.

Left column:

- Direct inquiries: `mlsc@pccoe.org`.
- Chapter headquarters: PCCOE Campus, Pune, with the full college address.
- Digital community links: LinkedIn, Instagram, GitHub.

Right column:

- Glass form titled "Send a Direct Note".
- Fields: name, email address, message.
- Primary action: Send Message.
- On submit, the current implementation shows a short fake sending state, resets the form, and displays a success toast.

Important implementation truth: this form currently does not send data to a backend or email service. Future prompts must describe it as a client-side prototype unless a real submission service is added.

### 5.6 Home page footer and global motion

The shared footer follows the contact section. `js/script.js` also manages:

- Smooth scrolling.
- Glass card mouse spotlight coordinates.
- Home navbar reveal after the hero/about boundary.
- ScrollTrigger hero, About, and Explore entrance motion.
- Scroll-stack card transforms.

## 6. Events Page: Roadmap Flow

The Events page presents the chapter's events as a journey rather than a chronological list.

### 6.1 Hero

- Full viewport black stage.
- Large heading: "Where Ideas Turn Into Impact".
- "Impact" is highlighted in the green event accent.
- Supporting copy explains that events bring the community together.
- A horizontal marquee belt lists all event names.
- A subtle green glow sits behind the hero composition.

### 6.2 Interactive roadmap

The main section is a tall vertical track containing:

- A winding SVG road path.
- Road foundation, rails, dark core, and animated multicolor energy dash.
- A flying dragon/mascot that moves along the path as the user scrolls.
- Six clickable event stations placed along alternating sides of the road.

Station order and content:

1. MLSC Inauguration, blue, "A new chapter of innovation begins."
2. Techroom, green, "Connect, learn, and explore emerging technology."
3. PRAXIS, yellow, "Challenge your skills. Think. Build. Compete."
4. Datathon, red, "Turn data into insights and ideas into solutions."
5. Codesprint, green, "Code fast. Think sharp. Solve smarter."
6. BlueBit 2.0, blue, "Our flagship celebration of technology and innovation."

Each station contains a numbered mascot hub and a glass information card with an "Explore story" action. As the dragon reaches stations, the station becomes active. Activation uses a small hysteresis buffer so the state does not flicker while scrolling.

### 6.3 Roadmap technical behavior

`js/events.js` calculates the SVG path length, maps scroll progress to an SVG point, converts it to percentage coordinates, and rotates the mascot based on the path tangent. GSAP ScrollTrigger is the preferred driver, with a regular scroll fallback when GSAP is unavailable. Lenis and GSAP should stay synchronized.

The marquee belt duplicates its content in JavaScript so it loops continuously without a visible gap.

## 7. Event Detail Page Flow

Each event detail page is a focused editorial story.

### Layout order

1. Shared pinned navigation with Events active.
2. Back to roadmap link.
3. Event hero with title, typewriter subtitle, mascot, and event-specific accent.
4. Quote in a glass figure, such as "Where Innovation Takes the Lead".
5. Animated horizontal keyword belt.
6. About the event section with readable paragraphs.
7. Three highlight cards, normally an action sequence such as Ideate, Build, Innovate.
8. Moments gallery with lazy-loaded event photographs and staggered rise-in animation.
9. Next-event navigation card.
10. Shared footer.

Event detail content should be celebratory but concrete. It should explain what the event is, who it is for, what participants do, and why it matters. Do not invent registration, dates, prizes, or statistics when the data is not present.

## 8. Teams Page: Archive and Member Discovery

The Teams page is a people-first archive that lets users browse different chapter tenures and explore members by domain.

### 8.1 Hero and tenure selector

- Full viewport black hero.
- Title: "Meet the Minds Behind MLSC".
- Supporting line: "Different roles - Same vision - One club".
- Centered tenure tabs: 2025-26, 2024-25, 2023-24.
- Scroll hint: "SCROLL TO EXPLORE TEAMS".

The default tenure is the current year, 2025-26. The selection is represented in the URL hash as `#tenure=current`, `#tenure=2024`, or `#tenure=2023`, allowing a selected archive view to be shared or restored.

### 8.2 Dynamic team sections

`js/teams.js` loads `data/teams.csv`, filters members by the selected tenure, groups them by domain, and renders a vertical sequence of team sections.

The domain order is intentional:

Core Leadership:

- Core Team.

Technical Wing:

- Web Development.
- DevOps.
- AI / ML.
- Cyber Security.
- CP / Competitive Programming.

Non-Technical Wing:

- Operations.
- Management.
- Event Management.
- Marketing.
- Sponsorship.
- Sponsorship & Marketing.
- Finance.
- Accounts & Finance.
- Design.
- UI / UX & Design.
- Social Media.
- Videography & Media.

Some domains may not have members in every tenure. Empty domains should be hidden unless the design specifically needs a placeholder.

### 8.3 Member card behavior

Each domain gets its own independent 3D coverflow carousel. A member card contains:

- Member portrait.
- Name.
- Role badge.
- Academic year or subtext when available.
- Biography.
- Achievement text when it contains meaningful content.
- GitHub link.
- LinkedIn link.

Behavior:

- Desktop shows the active card centered with adjacent cards offset in depth and rotation.
- Tablet and mobile use tighter offsets and fewer visible cards.
- Previous and next buttons change the active member.
- Left and right arrow keys work when the carousel is focused.
- Horizontal touch swipes move between members.
- Images outside the visible arc are lazy-loaded.
- Broken images receive a generated fallback image.
- Social-link clicks do not rotate the carousel.

The active member uses a strong blue accent in the current implementation. The dataset also includes per-member colors, but the visual system should keep color usage coherent and avoid turning every card into a different theme.

### 8.4 Teams data schema

`data/teams.csv` and `data/members.csv` use the same practical schema:

```text
id,name,tenure,team,teamType,role,subtext,bio,achievements,image,bgVideo,accentColor,github,linkedin
```

Meaning of fields:

- `id`: stable member identifier.
- `name`: display name.
- `tenure`: archive year, including the current-year label.
- `team`: domain name.
- `teamType`: Core, Tech, or Non-Tech where supplied.
- `role`: leadership or contributor role.
- `subtext`: academic year or short metadata.
- `bio`: member description.
- `achievements`: optional achievement text.
- `image`: relative portrait path.
- `bgVideo`: optional background video path currently shared by many records.
- `accentColor`: source accent color.
- `github`: external profile URL.
- `linkedin`: external profile URL.

For `file://` access, Teams includes an embedded fallback CSV inside `js/teams.js` because browser fetch can be blocked by the null origin. A server-hosted deployment should prefer the external CSV as the canonical source.

## 9. Achievements Page: Time, Proof, and Recognition

The Achievements page combines a historical narrative with evidence of individual and team success.

### 9.1 Hero

- Full viewport black section.
- Heading: "Where Curiosity Turns Into Achievement".
- "Achievement" uses the red accent.
- Supporting copy celebrates milestones, victories, and coding spirit.

### 9.2 Journey timeline

The Journey section is a scroll-driven horizontal timeline in a pinned container. It includes:

- Base line and active progress line.
- Milestone dots.
- Year labels above the line.
- Descriptions below the line.
- Four milestones: 2023 Chapter Inception, 2024 Community Expansion, 2025 Flagship Hackathons, 2026 Innovation Beyond.

The timeline should read as a continuous chapter story. It is not a generic progress bar and should not be reduced to a plain list on desktop. On mobile, it needs a readable vertical or horizontally scrollable fallback.

### 9.3 Hackathon winners coverflow

The winners section contains a single-row 3D coverflow carousel. Cards show:

- Image or a clear Photo Pending placeholder.
- Competition or organization name.
- Achievement title.
- Description.
- Team members or recipient.

Known records include Smart India Hackathon, BMC Software India Hackathon, ICPC Kanpur Regional Contest, Alphabyte 3.0, IEEE R10 ACEI INV.ENT Pitch Competition 2026, IEEE competitions, a La Trobe University innovation grant, AI for Bharat, IT Department topper recognition, Hackswagon, Hacktopia, and NMIET Ideathon.

The carousel supports previous and next controls, active-card state, responsive depth presets, and keyboard-friendly focus. Missing photography must remain an intentional placeholder, never a broken image.

### 9.4 Leaderboard

`js/script.js` contains a leaderboard data set and behavior for pages that include the leaderboard mount points. The implemented flow supports searching/filtering and sort controls when those elements exist. Keep the leaderboard as an optional recognition surface; do not make it the main page hero or imply a live competitive ranking unless the data is actually live.

## 10. Games Page: Arcade Flow

The Games page is a playful destination that deliberately changes the tone while preserving the black/glass MLSC system.

### 10.1 Arcade lobby hero

- Full viewport stage.
- Title: "MLSC Arcade Chamber" with yellow accent on "Chamber".
- Copy introduces Flappy Dragon and browser-native score logging.
- Main CTA: "ENTER ARCADE BAY" with a downward arrow.
- Scroll hint: "SCROLL DOWN TO PLAY".

### 10.2 Arcade cabinet

The second viewport contains a responsive arcade cabinet frame:

- Header badge: FLAPPY DRAGON.
- Reset button reloads the iframe.
- Fullscreen button toggles native fullscreen when supported and uses a CSS fallback class otherwise.
- Iframe loads `games/flappy-dragon/`.
- Bottom deck lists controls: Space/up arrow, click/tap, and Escape.
- Storage note says high scores are logged automatically in the browser.

The page has a `file://` protocol fallback that changes the iframe source to `games/flappy-dragon/index.html` for local opening. The game itself is a separately bundled application under `games/flappy-dragon/assets/`.

The CTA uses Lenis smooth scrolling to move to the cabinet. Reset and fullscreen state must remain understandable on both desktop and mobile.

## 11. 404 and Recovery Flow

The 404 page stays within the same brand system but uses a developer-console voice:

- Status label: `STATUS: 404_PAGE_NOT_FOUND`.
- Large color-separated 404 digits.
- Headline: "Page not found."
- Copy explains that the route was moved, refactored, or never pushed.
- Primary action: Return to Safety.
- Direct route pills for Events, Teams, Achievements, and Arcade Games.
- Keyboard shortcuts: H, E, T, A, G, Escape, and B.

Recovery should be immediate and friendly. The page must work without relying on the keyboard and must not shame the visitor for reaching an invalid route.

## 12. Technical Architecture

### Files and responsibilities

- `index.html`: home structure and contact form.
- `events.html`: event roadmap structure.
- `teams.html`: teams shell and tenure tabs.
- `achievements.html`: timeline, winners, and recognition content.
- `games.html`: arcade shell and iframe controls.
- `events/*.html`: event detail stories.
- `css/styles.css`: global reset, type, navigation, home system, scroll stack, shared utilities.
- `css/events.css`: event roadmap and event-detail visual language.
- `css/teams.css`: teams archive, hero, domain sections, and coverflow cards.
- `css/achievements.css`: achievement page black theme and timeline foundations.
- `css/games.css`: arcade page and cabinet layout.
- `css/footer.css`: shared footer.
- `css/loading-animation.css`: home cinematic loading screen.
- `js/script.js`: global scroll, animations, navbar, scroll stack, leaderboard, and achievement carousel behavior.
- `js/events.js`: event roadmap, path flight, typewriter, belts, rise-in effects, and footer initialization.
- `js/teams.js`: CSV parsing, tenure state, grouping, member rendering, coverflow, gestures, and fallback data.
- `js/footer.js`: shared footer injection and nested-route path resolution.
- `js/loading-animation.js`: home loading/reveal behavior.
- `src/components/fluid-glass/`: React Three Fiber FluidGlass mount used by the About surface.
- `js/fluid-glass-bundle.js`: compiled browser bundle for FluidGlass.
- `data/teams.csv` and `data/members.csv`: member records.
- `assets/images/`: branding, mascots, event photography, achievements, loading art, and member portraits.
- `assets/videos/`: mascot and member background media.

### External libraries

- Lenis: smooth inertial scrolling.
- GSAP and ScrollTrigger: scroll-driven animation and synchronization.
- React, React DOM, Three.js, React Three Fiber, Drei, and Maath: FluidGlass effect and related compiled component.
- Google Fonts: Plus Jakarta Sans, JetBrains Mono, and supporting loading-animation fonts.

### Runtime model

The main site can run from a static server. `package.json` provides `npm run start` and `npm run dev` using `npx serve -l 3000`. The FluidGlass bundle can be rebuilt with `npm run build:fluid-glass`.

## 13. Responsive and Accessibility Requirements

All future design or code prompts must preserve these requirements:

- Layouts must work at desktop, tablet, and mobile widths.
- Do not allow hero text, nav links, station cards, carousel cards, or cabinet controls to overlap.
- Maintain stable dimensions for carousels, buttons, stations, and the game iframe so content does not shift the layout.
- All meaningful images need descriptive alt text; decorative images need empty alt text.
- Maintain visible keyboard focus for buttons, tabs, carousels, links, and form fields.
- Use semantic headings, sections, landmarks, labels, and live regions for status/toast messages.
- Preserve arrow-key and touch navigation for carousels.
- Provide fallbacks when GSAP, Lenis, React, remote fonts, or image assets fail.
- Add reduced-motion handling for scroll animations, floating mascots, marquees, and loading transitions.
- Never hide essential information exclusively inside hover states.
- Do not use color alone to communicate an active state.

## 14. Content and Data Rules

- Do not invent member achievements, event dates, winners, statistics, or registration details.
- Empty member fields should be omitted gracefully.
- Labels such as `Working`, `Coming soon`, `Photo Pending`, or `Information pending...` represent incomplete source data and should be treated honestly.
- Preserve external GitHub, LinkedIn, Instagram, and chapter links when valid.
- Escape or sanitize CSV values before injecting them into HTML.
- Keep event names consistent across the roadmap, detail pages, footer, and SEO metadata.
- When adding a new event, update the roadmap station, detail page, event asset folder, next-event relationship, and navigation references together.

## 15. LLM Prompt: Build or Redesign This Website

Use the following prompt when asking another LLM to design or implement the website:

> Design and implement a polished public website for Microsoft Learn Student Chapter PCCOE, a student-led technology community at Pimpri Chinchwad College of Engineering, Pune. The experience should communicate curiosity, technical ambition, collaboration, and real-world impact. Use a cinematic black visual system with Plus Jakarta Sans for display/body text and JetBrains Mono for technical labels. Use the MLSC four-color palette: red/orange `#f25022`, green `#7fba00`, blue `#00a4ef`, and yellow `#ffb900`. Use dark translucent glass surfaces sparingly, subtle borders, deep depth, and intentional scroll-driven motion.
>
> Preserve this information architecture: Home, Events, Teams, Achievements, Games, event detail pages, shared footer, and 404 recovery. The home page must begin with a theater-like MLSC loading reveal, then show a minimal full-screen MLSC hero, an About section, a scroll-stacked Explore section, and a contact section with inquiry channels and a note form. Events must be a winding interactive roadmap with six stations and a mascot that travels along an SVG path as the visitor scrolls. Teams must be a tenure-aware archive driven by member data, grouped into Core Leadership, Technical Wing, and Non-Technical Wing, with independent responsive member coverflow carousels. Achievements must combine a scroll timeline from 2023 through 2026 with a hackathon-winner coverflow and optional recognition leaderboard. Games must be an arcade lobby leading to a responsive Flappy Dragon cabinet with reset and fullscreen controls. Event detail pages must be editorial stories with a typewriter intro, mascot, quote, highlights, gallery, and next-event link.
>
> Design each page around one dominant metaphor instead of using generic grids. Keep sections spacious and unframed, use cards only for focused repeated content, keep all text readable, and ensure no elements overlap at mobile or desktop sizes. Add meaningful entrance, scroll, and state animations, but provide reduced-motion and no-JavaScript fallbacks. Use semantic HTML, descriptive alt text, keyboard focus, ARIA labels, arrow-key carousel controls, touch gestures, lazy loading, stable dimensions, and graceful missing-image/data states. Do not fabricate facts. Treat the existing local CSV fields as the content model: id, name, tenure, team, teamType, role, subtext, bio, achievements, image, bgVideo, accentColor, github, linkedin. The contact form is currently a client-side prototype and must not be described as a real submission system unless a backend is added.
>
> The result should feel like an intentional digital chapter experience: bold at entry, clear in navigation, human in its team stories, credible in its achievements, energetic in its events, and playful in its arcade. Keep the MLSC identity visible in every viewport without making the interface noisy.

## 16. Future Improvement Priorities

These are known opportunities for future work, not current product requirements:

1. Connect the contact form to a real backend or clearly label it as a demo.
2. Remove duplicate data sources by making one CSV canonical and generating the embedded fallback.
3. Normalize tenure values so `Current Year (2025-26)` and `2025-26` are represented consistently.
4. Validate and normalize external profile URLs.
5. Add a real content model for events and achievements rather than hardcoding repeated markup.
6. Add reduced-motion support and stronger keyboard testing for every scroll-driven component.
7. Add automated visual checks at mobile, tablet, and desktop breakpoints.
8. Optimize the large member video and image assets, and confirm that every referenced asset exists.
9. Add an explicit mobile navigation pattern if the horizontal navbar becomes crowded.
10. Keep the design expressive, but protect performance by lazy-loading below-fold media and avoiding unnecessary animation work.