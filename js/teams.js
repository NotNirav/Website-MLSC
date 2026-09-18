/**
 * MLSC — Teams / Members Multi-Section Carousel Engine
 * Vertically Stacked Multi-Team Layout with Independent 3D Coverflow Stages
 * Features:
 *   - Automatic Vertical Stacking of Teams (Core Team -> AI/ML -> Web Dev -> UI/UX -> Events & Ops -> CP)
 *   - Independent 3D Coverflow Arc Carousels per Team with $O(1)$ LUT Matrix
 *   - Sticky Domain Jump Bar with Active Scroll-Spy Tracking
 *   - Predictive Virtual Image Preloader (90%+ Payload Reduction)
 *   - Independent Touch Swipe, Autoplay, and Hardware-Accelerated Transforms
 */

(function () {
  'use strict';

  // =========================================================
  // 1. DOMAIN CONFIGURATION & ORDER
  // =========================================================
  const DOMAIN_ORDER = [
    {
      id: 'core-team',
      name: 'Core Team',
      tag: '01 // LEADERSHIP & STRATEGY',
      title: 'Core Leadership',
      desc: 'Steering the chapter vision, institutional partnerships, and campus initiatives.',
      accentColor: '#ffb900'
    },
    {
      id: 'ai-ml',
      name: 'AI / ML',
      tag: '02 // ARTIFICIAL INTELLIGENCE',
      title: 'AI / ML & Data Intelligence',
      desc: 'Building neural systems, computer vision models, LLMs, and predictive data pipelines.',
      accentColor: '#34d399'
    },
    {
      id: 'web-development',
      name: 'Web Development',
      tag: '03 // WEB & CLOUD SYSTEMS',
      title: 'Web & Platform Engineering',
      desc: 'Architecting high-performance portals, serverless APIs, cloud infrastructure, and Web3 tools.',
      accentColor: '#38bdf8'
    },
    {
      id: 'ui-ux-design',
      name: 'UI / UX & Design',
      tag: '04 // CREATIVE & EXPERIENCE',
      title: 'UI / UX & Brand Design',
      desc: 'Designing intuitive user interfaces, visual design systems, brand identities, and motion graphics.',
      accentColor: '#ec4899'
    },
    {
      id: 'events-operations',
      name: 'Events & Operations',
      tag: '05 // OPERATIONS & OUTREACH',
      title: 'Events & Community Operations',
      desc: 'Managing flagship BlueBit hackathons, speaker series, corporate sponsorships, and campus outreach.',
      accentColor: '#f25022'
    },
    {
      id: 'cp',
      name: 'CP',
      tag: '06 // ALGORITHMIC ENGINEERING',
      title: 'Competitive Programming',
      desc: 'Optimizing algorithmic data structures, problem solving, and competitive coding mastery.',
      accentColor: '#a855f7'
    }
  ];

  // =========================================================
  // 2. DEFAULT MEMBERS DATA (Instant Fallback)
  // =========================================================
  const DEFAULT_MEMBERS = [
    {
      id: 1,
      name: "Ved Jadhav",
      team: "Core Team",
      role: "President",
      subtext: "TY CSE",
      bio: "Driving strategic club vision, partnerships, and high-impact campus tech initiatives.",
      image: "assets/images/members/Ved_Jadhav.png",
      accentColor: "#ffb900",
      github: "https://github.com/vedjadhav",
      linkedin: "https://linkedin.com/in/vedjadhav"
    },
    {
      id: 2,
      name: "Sharvil Patil",
      team: "Core Team",
      role: "Vice President",
      subtext: "SY ENTC",
      bio: "Directing flagship BlueBit hackathons, speaker series, and technical bootcamps.",
      image: "assets/images/members/Sharvil_Patil.jpg",
      accentColor: "#f25022",
      github: "https://github.com/sharvilpatil",
      linkedin: "https://linkedin.com/in/sharvilpatil"
    },
    {
      id: 3,
      name: "Isha",
      team: "Core Team",
      role: "General Secretary",
      subtext: "SY ENTC",
      bio: "Designing sleek wireframes, micro-interactions, and visual assets for club web portals.",
      image: "assets/images/members/isha_.jpg",
      accentColor: "#ec4899",
      github: "https://github.com/isha",
      linkedin: "https://linkedin.com/in/isha"
    },
    {
      id: 4,
      name: "Aryan Verma",
      team: "AI / ML",
      role: "Member",
      subtext: "TY IT",
      bio: "Empowering student innovators, driving technical culture, and leading MLSC to new heights.",
      image: "assets/images/members/aryan.jpg",
      accentColor: "#ffb900",
      github: "https://github.com/aryanverma",
      linkedin: "https://linkedin.com/in/aryanverma"
    },
    {
      id: 5,
      name: "Saksham Jagtap",
      team: "AI / ML",
      role: "Executive Lead",
      subtext: "TY CSE",
      bio: "Spearheading flagship hackathons and community developer engagement programs.",
      image: "assets/images/members/Saksham Jagtap.png",
      accentColor: "#ffb900",
      github: "https://github.com/sakshamjagtap",
      linkedin: "https://linkedin.com/in/sakshamjagtap"
    },
    {
      id: 6,
      name: "Kashvi Patki",
      team: "AI / ML",
      role: "Member",
      subtext: "SY CSE AIML",
      bio: "Orchestrating community initiatives, club operations, and inter-chapter collaborations.",
      image: "assets/images/members/Kashvi_Patki .jpg",
      accentColor: "#ffb900",
      github: "https://github.com/kashvipatki",
      linkedin: "https://linkedin.com/in/kashvipatki"
    },
    {
      id: 7,
      name: "Apurv Sagare",
      team: "AI / ML",
      role: "Computer Vision Specialist",
      subtext: "TY CSE",
      bio: "Developing real-time neural object detection models and visual edge computing pipelines.",
      image: "assets/images/members/APURV SAGARE.jpeg",
      accentColor: "#34d399",
      github: "https://github.com/apurvsagare",
      linkedin: "https://linkedin.com/in/apurvsagare"
    },
    {
      id: 8,
      name: "Arnav Kumar",
      team: "AI / ML",
      role: "NLP & LLM Researcher",
      subtext: "SY CSE AIML",
      bio: "Exploring open-weights language model fine-tuning and retrieval-augmented generation.",
      image: "assets/images/members/Arnav Kumar.png",
      accentColor: "#34d399",
      github: "https://github.com/arnavkumar",
      linkedin: "https://linkedin.com/in/arnavkumar"
    },
    {
      id: 9,
      name: "Aryan Patel",
      team: "AI / ML",
      role: "Deep Learning Engineer",
      subtext: "SY CSE",
      bio: "Building deep neural networks and automated evaluation frameworks for ML systems.",
      image: "assets/images/members/Aryan Patel.png",
      accentColor: "#34d399",
      github: "https://github.com/aryanpatel",
      linkedin: "https://linkedin.com/in/aryanpatel"
    },
    {
      id: 10,
      name: "Atindra Kumeriya",
      team: "AI / ML",
      role: "ML Systems Engineer",
      subtext: "SY IT",
      bio: "Optimizing tensor computation pipelines and building end-to-end predictive models.",
      image: "assets/images/members/Atindra Kumeriya.jpg",
      accentColor: "#34d399",
      github: "https://github.com/atindrakumeriya",
      linkedin: "https://linkedin.com/in/atindrakumeriya"
    },
    {
      id: 11,
      name: "Avadhoot Chavan",
      team: "AI / ML",
      role: "Data Science Specialist",
      subtext: "TY CSE DS",
      bio: "Extracting actionable insights from high-dimensional datasets and statistical modelling.",
      image: "assets/images/members/Avadhoot Chavan.jpg",
      accentColor: "#34d399",
      github: "https://github.com/avadhootchavan",
      linkedin: "https://linkedin.com/in/avadhootchavan"
    },
    {
      id: 12,
      name: "Chaitanya Jadhav",
      team: "AI / ML",
      role: "Intelligent Agents Developer",
      subtext: "SY CSE AIML",
      bio: "Prototyping multi-agent coordination frameworks and automated developer tooling.",
      image: "assets/images/members/Chaitanya Jadhav.png",
      accentColor: "#34d399",
      github: "https://github.com/chaitanyajadhav",
      linkedin: "https://linkedin.com/in/chaitanyajadhav"
    },
    {
      id: 13,
      name: "Chinmay Ahire",
      team: "AI / ML",
      role: "Neural Systems Researcher",
      subtext: "TY CSE",
      bio: "Designing scalable model architectures and training pipelines for competitive hackathons.",
      image: "assets/images/members/Chinmay_Ahire.png",
      accentColor: "#34d399",
      github: "https://github.com/chinmayahire",
      linkedin: "https://linkedin.com/in/chinmayahire"
    },
    {
      id: 14,
      name: "Devendra Adsure",
      team: "AI / ML",
      role: "MLOps Engineer",
      subtext: "SY IT",
      bio: "Containerizing ML workloads and deploying automated inference pipelines on cloud infrastructure.",
      image: "assets/images/members/Devendra Adsure.png",
      accentColor: "#34d399",
      github: "https://github.com/devendraadsure",
      linkedin: "https://linkedin.com/in/devendraadsure"
    },
    {
      id: 15,
      name: "Madhav",
      team: "AI / ML",
      role: "Edge AI Developer",
      subtext: "SY CSE",
      bio: "Building lightweight inference runtimes on microcontrollers and embedded Linux boards.",
      image: "assets/images/members/Madhav.jpg",
      accentColor: "#34d399",
      github: "https://github.com/madhav",
      linkedin: "https://linkedin.com/in/madhav"
    },
    {
      id: 16,
      name: "Rishabh Prabhu",
      team: "AI / ML",
      role: "Generative AI Specialist",
      subtext: "TY CSE AIML",
      bio: "Crafting multimodal pipelines and exploring generative media synthesis applications.",
      image: "assets/images/members/Rishabh Prabhu.png",
      accentColor: "#34d399",
      github: "https://github.com/rishabhprabhu",
      linkedin: "https://linkedin.com/in/rishabhprabhu"
    },
    {
      id: 17,
      name: "Sanish Dalvi",
      team: "CP",
      role: "Competitive Programming Lead",
      subtext: "TY IT",
      bio: "Architecting robust algorithms, competitive problem sets, and engineering scalable ecosystems.",
      image: "assets/images/members/Sanish Dalvi.png",
      accentColor: "#ffb900",
      github: "https://github.com/SanishDalvi",
      linkedin: "https://linkedin.com/in/sanishdalvi"
    },
    {
      id: 18,
      name: "Adii",
      team: "Web Development",
      role: "Logistics Coordinator",
      subtext: "SY CSE",
      bio: "Managing venue logistics, equipment routing, and high-energy hackathon hospitality.",
      image: "assets/images/members/Adii.jpg",
      accentColor: "#f25022",
      github: "https://github.com/adii",
      linkedin: "https://linkedin.com/in/adii"
    },
    {
      id: 19,
      name: "Shivanshi",
      team: "Web Development",
      role: "Public Relations Lead",
      subtext: "SY IT",
      bio: "Fostering inter-collegiate outreach, speaker invitations, and technical media PR.",
      image: "assets/images/members/shivanshi.png",
      accentColor: "#f25022",
      github: "https://github.com/shivanshi",
      linkedin: "https://linkedin.com/in/shivanshi"
    },
    {
      id: 20,
      name: "Srushti Gaikwad",
      team: "Events & Operations",
      role: "Sponsorship & Outreach Lead",
      subtext: "TY CSE",
      bio: "Spearheading partnerships with industry sponsors and community developer grants.",
      image: "assets/images/members/Srushti Gaikwad.png",
      accentColor: "#f25022",
      github: "https://github.com/srushtigaikwad",
      linkedin: "https://linkedin.com/in/srushtigaikwad"
    },
    {
      id: 21,
      name: "Tanvi Jadhav",
      team: "Events & Operations",
      role: "Hackathon Coordinator",
      subtext: "SY ENTC",
      bio: "Directing developer registration flows, mentor scheduling, and project evaluation tracks.",
      image: "assets/images/members/Tanvi Jadhav.jpg",
      accentColor: "#f25022",
      github: "https://github.com/tanvijadhav",
      linkedin: "https://linkedin.com/in/tanvijadhav"
    },
    {
      id: 22,
      name: "Tejal Jadhav",
      team: "Events & Operations",
      role: "Event Strategist",
      subtext: "SY CSE",
      bio: "Curating workshop curriculums, tech talk lineups, and interactive participant engagement.",
      image: "assets/images/members/Tejal Jadhav.jpg",
      accentColor: "#f25022",
      github: "https://github.com/tejaljadhav",
      linkedin: "https://linkedin.com/in/tejaljadhav"
    },
    {
      id: 23,
      name: "Vaidehi Behare",
      team: "Events & Operations",
      role: "Campus Outreach Lead",
      subtext: "SY IT",
      bio: "Connecting student innovators across departments and managing community ambassador tracks.",
      image: "assets/images/members/Vaidehi Behare.jpg",
      accentColor: "#f25022",
      github: "https://github.com/vaidehibehare",
      linkedin: "https://linkedin.com/in/vaidehibehare"
    },
    {
      id: 24,
      name: "Vaishnavi Marne",
      team: "Events & Operations",
      role: "Delegate Relations Coordinator",
      subtext: "SY ENTC",
      bio: "Managing attendee communications, welcome kits, and post-event survey telemetry.",
      image: "assets/images/members/Vaishnavi Marne .jpg",
      accentColor: "#f25022",
      github: "https://github.com/vaishnavimarne",
      linkedin: "https://linkedin.com/in/vaishnavimarne"
    },
    {
      id: 25,
      name: "Sharvari Deshmukh",
      team: "UI / UX & Design",
      role: "Design Head",
      subtext: "SY IT",
      bio: "Crafting intuitive visual design systems, interactive prototypes, and community branding.",
      image: "assets/images/members/Sharvari_Deshmukh.png",
      accentColor: "#ec4899",
      github: "https://github.com/sharvarideshmukh",
      linkedin: "https://linkedin.com/in/sharvarideshmukh"
    },
    {
      id: 26,
      name: "Amrita",
      team: "UI / UX & Design",
      role: "Product Designer",
      subtext: "SY CSE",
      bio: "Mapping user journeys and turning complex software architectures into clean interfaces.",
      image: "assets/images/members/Amrita.jpg",
      accentColor: "#ec4899",
      github: "https://github.com/amrita",
      linkedin: "https://linkedin.com/in/amrita"
    },
    {
      id: 27,
      name: "Amruta Thakare",
      team: "UI / UX & Design",
      role: "Visual & Brand Designer",
      subtext: "SY ENTC",
      bio: "Defining visual design language, event identity kits, and typography guidelines.",
      image: "assets/images/members/Amruta Thakare.png",
      accentColor: "#ec4899",
      github: "https://github.com/amrutathakare",
      linkedin: "https://linkedin.com/in/amrutathakare"
    },
    {
      id: 28,
      name: "Anannya",
      team: "UI / UX & Design",
      role: "UI/UX Researcher",
      subtext: "SY IT",
      bio: "Conducting usability testing, heuristic analysis, and prototyping sleek student workflows.",
      image: "assets/images/members/Anannya.jpg",
      accentColor: "#ec4899",
      github: "https://github.com/anannya",
      linkedin: "https://linkedin.com/in/anannya"
    },
    {
      id: 29,
      name: "Anjali Borse",
      team: "UI / UX & Design",
      role: "Motion & Graphic Designer",
      subtext: "TY CSE",
      bio: "Creating dynamic motion graphics, keynote presentations, and marketing collaterals.",
      image: "assets/images/members/Anjali Borse.png",
      accentColor: "#ec4899",
      github: "https://github.com/anjaliborse",
      linkedin: "https://linkedin.com/in/anjaliborse"
    },
    {
      id: 30,
      name: "Deesha",
      team: "UI / UX & Design",
      role: "Design Systems Specialist",
      subtext: "SY CSE AIML",
      bio: "Building scalable Figma component libraries, auto-layout tokens, and theme palettes.",
      image: "assets/images/members/Deesha.jpg",
      accentColor: "#ec4899",
      github: "https://github.com/deesha",
      linkedin: "https://linkedin.com/in/deesha"
    },
    {
      id: 31,
      name: "Khushi Kolhe",
      team: "UI / UX & Design",
      role: "Experience Designer",
      subtext: "TY IT",
      bio: "Transforming hackathon participant workflows into intuitive, joyful user journeys.",
      image: "assets/images/members/Khushi Kolhe.jpg",
      accentColor: "#ec4899",
      github: "https://github.com/khushikolhe",
      linkedin: "https://linkedin.com/in/khushikolhe"
    },
    {
      id: 32,
      name: "Sanika Shinde",
      team: "UI / UX & Design",
      role: "Creative Lead",
      subtext: "SY IT",
      bio: "Curating aesthetic club social media branding, posters, and digital promotional media.",
      image: "assets/images/members/Sanika Shinde.png",
      accentColor: "#ec4899",
      github: "https://github.com/sanikashinde",
      linkedin: "https://linkedin.com/in/sanikashinde"
    },
    {
      id: 33,
      name: "Samarth Wani",
      team: "Web Development",
      role: "Strategy Lead",
      subtext: "SY IT",
      bio: "Aligning technical programs with student developer needs and industry tech trends.",
      image: "assets/images/members/Samarth_W.png",
      accentColor: "#ffb900",
      github: "https://github.com/samarthwani",
      linkedin: "https://linkedin.com/in/samarthwani"
    },
    {
      id: 34,
      name: "Saumyaa Gupta",
      team: "Web Development",
      role: "Community Lead",
      subtext: "SY CSE",
      bio: "Fostering an inclusive developer ecosystem and empowering first-time hackathon builders.",
      image: "assets/images/members/Saumyaa Gupta.jpg",
      accentColor: "#ffb900",
      github: "https://github.com/saumyaagupta",
      linkedin: "https://linkedin.com/in/saumyaagupta"
    },
    {
      id: 35,
      name: "Badal Dadwani",
      team: "Web Development",
      role: "Finance & Operations Lead",
      subtext: "SY IT",
      bio: "Managing club resources, sponsor allocations, and operational logistical pipelines.",
      image: "assets/images/members/Badal Dadwani.png",
      accentColor: "#ffb900",
      github: "https://github.com/badaldadwani",
      linkedin: "https://linkedin.com/in/badaldadwani"
    },
    {
      id: 36,
      name: "Pranav Narkhede",
      team: "Web Development",
      role: "Web Development Head",
      subtext: "TY IT",
      bio: "Architecting high-performance web platforms and mentoring club web developers.",
      image: "assets/images/members/Pranav_Narkhede.png",
      accentColor: "#38bdf8",
      github: "https://github.com/pranavnarkhede",
      linkedin: "https://linkedin.com/in/pranavnarkhede"
    },
    {
      id: 37,
      name: "Aditya Deore",
      team: "Web Development",
      role: "Full-Stack Developer",
      subtext: "TY CSE",
      bio: "Building reactive web applications with Next.js, Node.js microservices, and serverless stacks.",
      image: "assets/images/members/Aditya Deore.png",
      accentColor: "#38bdf8",
      github: "https://github.com/adityadeore",
      linkedin: "https://linkedin.com/in/adityadeore"
    },
    {
      id: 38,
      name: "Aditya Gurav",
      team: "Web Development",
      role: "Backend Systems Developer",
      subtext: "SY IT",
      bio: "Designing resilient REST and GraphQL APIs backed by distributed caching layers.",
      image: "assets/images/members/AdityaGurav.jpeg",
      accentColor: "#38bdf8",
      github: "https://github.com/adityagurav",
      linkedin: "https://linkedin.com/in/adityagurav"
    },
    {
      id: 39,
      name: "Aditya Rajput",
      team: "Web Development",
      role: "Frontend Architect",
      subtext: "SY CSE",
      bio: "Crafting modern responsive interfaces with sleek micro-interactions and high-FPS animations.",
      image: "assets/images/members/Aditya_Rajput.png",
      accentColor: "#38bdf8",
      github: "https://github.com/adityarajput",
      linkedin: "https://linkedin.com/in/adityarajput"
    },
    {
      id: 40,
      name: "Mahesh Shirame",
      team: "Web Development",
      role: "Cloud & DevOps Engineer",
      subtext: "TY CSE",
      bio: "Automating CI/CD pipelines, Dockerized deployments, and club cloud infrastructure.",
      image: "assets/images/members/Mahesh_Shirame.jpg",
      accentColor: "#38bdf8",
      github: "https://github.com/maheshshirame",
      linkedin: "https://linkedin.com/in/maheshshirame"
    },
    {
      id: 41,
      name: "Mayank Pawar",
      team: "Web Development",
      role: "Full-Stack Developer",
      subtext: "SY IT",
      bio: "Building seamless frontend user flows integrated with real-time WebSocket backend services.",
      image: "assets/images/members/Mayank Pawar.png",
      accentColor: "#38bdf8",
      github: "https://github.com/mayankpawar",
      linkedin: "https://linkedin.com/in/mayankpawar"
    },
    {
      id: 42,
      name: "Nirav Neve",
      team: "Web Development",
      role: "Systems & API Engineer",
      subtext: "SY CSE",
      bio: "Engineering low-latency database queries and scalable authentication mechanisms.",
      image: "assets/images/members/Nirav_Neve.png",
      accentColor: "#38bdf8",
      github: "https://github.com/niravneve",
      linkedin: "https://linkedin.com/in/niravneve"
    },
    {
      id: 43,
      name: "Palash",
      team: "Web Development",
      role: "Frontend Specialist",
      subtext: "SY ENTC",
      bio: "Crafting accessible, pixel-perfect user experiences using modern CSS and TypeScript.",
      image: "assets/images/members/Palash.png",
      accentColor: "#38bdf8",
      github: "https://github.com/palash",
      linkedin: "https://linkedin.com/in/palash"
    },
    {
      id: 44,
      name: "Parth Popli",
      team: "Web Development",
      role: "Next.js Developer",
      subtext: "SY CSE",
      bio: "Developing server-side rendered portals and optimized static web assets for club projects.",
      image: "assets/images/members/Parth_Popli.png",
      accentColor: "#38bdf8",
      github: "https://github.com/parthpopli",
      linkedin: "https://linkedin.com/in/parthpopli"
    },
    {
      id: 45,
      name: "Prem Thakur",
      team: "Web Development",
      role: "Backend Developer",
      subtext: "SY IT",
      bio: "Structuring relational schemas, handling event-driven queues, and securing API endpoints.",
      image: "assets/images/members/prem thakur.jpg",
      accentColor: "#38bdf8",
      github: "https://github.com/premthakur",
      linkedin: "https://linkedin.com/in/premthakur"
    },
    {
      id: 46,
      name: "Yash Bhagodia",
      team: "Web Development",
      role: "Web3 & Full-Stack Developer",
      subtext: "TY IT",
      bio: "Bridging decentralized smart contracts with progressive client-side web applications.",
      image: "assets/images/members/Yash Bhagodia_.jpg",
      accentColor: "#38bdf8",
      github: "https://github.com/yashbhagodia",
      linkedin: "https://linkedin.com/in/yashbhagodia"
    }
  ];

  // SVG Icons
  const GITHUB_SVG = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" style="pointer-events: none;">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>`;

  const LINKEDIN_SVG = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" style="pointer-events: none;">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>`;

  const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 290 215'%3E%3Crect width='100%25' height='100%25' fill='%23131724'/%3E%3C/svg%3E";
  const CSV_CACHE_KEY = 'mlsc_members_csv_cache_v3';

  // =========================================================
  // 3. PRECOMPUTED 3D CAROUSEL TRANSFORMS LOOK-UP TABLE (LUT)
  // =========================================================
  const TRANSFORM_LUT = {
    mobile: {
      0: {
        transform: 'translate3d(-50%, -50%, 0px) scale(1) rotateY(0deg)',
        opacity: '1',
        zIndex: '20',
        pe: 'auto',
        vis: 'visible'
      },
      '+1': {
        transform: 'translate3d(calc(-50% + 75px), -50%, -40px) scale(0.82) rotateY(-10deg)',
        opacity: '0.25',
        zIndex: '4',
        pe: 'auto',
        vis: 'visible'
      },
      '-1': {
        transform: 'translate3d(calc(-50% - 75px), -50%, -40px) scale(0.82) rotateY(10deg)',
        opacity: '0.25',
        zIndex: '4',
        pe: 'auto',
        vis: 'visible'
      },
      dormant: {
        transform: 'translate3d(-50%, -50%, -120px) scale(0.6)',
        opacity: '0',
        zIndex: '1',
        pe: 'none',
        vis: 'hidden'
      }
    },
    tablet: {
      0: {
        transform: 'translate3d(-50%, -50%, 0px) scale(1) rotateY(0deg)',
        opacity: '1',
        zIndex: '20',
        pe: 'auto',
        vis: 'visible'
      },
      '+1': {
        transform: 'translate3d(calc(-50% + 185px), -50%, -40px) scale(0.86) rotateY(-14deg)',
        opacity: '0.92',
        zIndex: '10',
        pe: 'auto',
        vis: 'visible'
      },
      '-1': {
        transform: 'translate3d(calc(-50% - 185px), -50%, -40px) scale(0.86) rotateY(14deg)',
        opacity: '0.92',
        zIndex: '10',
        pe: 'auto',
        vis: 'visible'
      },
      '+2': {
        transform: 'translate3d(calc(-50% + 330px), -50%, -85px) scale(0.74) rotateY(-24deg)',
        opacity: '0.78',
        zIndex: '6',
        pe: 'auto',
        vis: 'visible'
      },
      '-2': {
        transform: 'translate3d(calc(-50% - 330px), -50%, -85px) scale(0.74) rotateY(24deg)',
        opacity: '0.78',
        zIndex: '6',
        pe: 'auto',
        vis: 'visible'
      },
      '+3': {
        transform: 'translate3d(calc(-50% + 440px), -50%, -140px) scale(0.6) rotateY(-34deg)',
        opacity: '0',
        zIndex: '1',
        pe: 'none',
        vis: 'hidden'
      },
      '-3': {
        transform: 'translate3d(calc(-50% - 440px), -50%, -140px) scale(0.6) rotateY(34deg)',
        opacity: '0',
        zIndex: '1',
        pe: 'none',
        vis: 'hidden'
      },
      dormant: {
        transform: 'translate3d(-50%, -50%, -140px) scale(0.6) rotateY(0deg)',
        opacity: '0',
        zIndex: '1',
        pe: 'none',
        vis: 'hidden'
      }
    },
    desktop: {
      0: {
        transform: 'translate3d(-50%, -50%, 0px) scale(1) rotateY(0deg)',
        opacity: '1',
        zIndex: '20',
        pe: 'auto',
        vis: 'visible'
      },
      '+1': {
        transform: 'translate3d(calc(-50% + 225px), -50%, -45px) scale(0.88) rotateY(-16deg)',
        opacity: '0.94',
        zIndex: '12',
        pe: 'auto',
        vis: 'visible'
      },
      '-1': {
        transform: 'translate3d(calc(-50% - 225px), -50%, -45px) scale(0.88) rotateY(16deg)',
        opacity: '0.94',
        zIndex: '12',
        pe: 'auto',
        vis: 'visible'
      },
      '+2': {
        transform: 'translate3d(calc(-50% + 415px), -50%, -90px) scale(0.77) rotateY(-28deg)',
        opacity: '0.84',
        zIndex: '7',
        pe: 'auto',
        vis: 'visible'
      },
      '-2': {
        transform: 'translate3d(calc(-50% - 415px), -50%, -90px) scale(0.77) rotateY(28deg)',
        opacity: '0.84',
        zIndex: '7',
        pe: 'auto',
        vis: 'visible'
      },
      '+3': {
        transform: 'translate3d(calc(-50% + 520px), -50%, -160px) scale(0.62) rotateY(-38deg)',
        opacity: '0',
        zIndex: '1',
        pe: 'none',
        vis: 'hidden'
      },
      '-3': {
        transform: 'translate3d(calc(-50% - 520px), -50%, -160px) scale(0.62) rotateY(38deg)',
        opacity: '0',
        zIndex: '1',
        pe: 'none',
        vis: 'hidden'
      },
      dormant: {
        transform: 'translate3d(-50%, -50%, -160px) scale(0.62) rotateY(0deg)',
        opacity: '0',
        zIndex: '1',
        pe: 'none',
        vis: 'hidden'
      }
    }
  };

  function getDeviceType() {
    const w = window.innerWidth;
    if (w <= 640) return 'mobile';
    if (w <= 1024) return 'tablet';
    return 'desktop';
  }

  function getCardPreset(device, delta) {
    const lut = TRANSFORM_LUT[device];
    if (delta === 0) return lut[0];
    if (delta === 'dormant') return lut.dormant || lut['+3'];
    if (device === 'mobile') {
      if (delta === 1) return lut['+1'];
      if (delta === -1) return lut['-1'];
      return lut.dormant || lut['+3'];
    }
    const key = (delta > 0 ? '+' : '') + delta;
    if (lut[key]) return lut[key];
    return delta > 0 ? (lut['+3'] || lut.dormant) : (lut['-3'] || lut.dormant);
  }

  function computeCardDelta(cardIdx, currentIdx, total) {
    if (total <= 1) return 0;
    let diff = cardIdx - currentIdx;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    if (diff === -total / 2 && total % 2 === 0) diff = total / 2;
    return diff;
  }

  // =========================================================
  // 4. TEAM CAROUSEL INSTANCE CLASS
  // =========================================================
  class TeamCarousel {
    constructor(domainInfo, members, containerEl) {
      this.domainInfo = domainInfo;
      this.members = members;
      this.containerEl = containerEl;
      this.currentIndex = 0;
      this.cardElements = [];
      this.autoPlayTimer = null;
      this.isSwiping = false;
      this.startX = 0;
      this.currentX = 0;
      this.trackEl = null;

      this.init();
    }

    init() {
      const isSingle = this.members.length === 1;

      if (isSingle) {
        this.renderSingleMember();
      } else {
        this.renderCarousel();
      }
    }

    renderSingleMember() {
      const member = this.members[0];
      const stage = document.createElement('div');
      stage.className = 'team-showcase-single';

      const card = createCardElement(member, 0, 0, 1, this.domainInfo.accentColor);
      stage.appendChild(card);
      this.containerEl.appendChild(stage);
    }

    renderCarousel() {
      const stage = document.createElement('div');
      stage.className = 'teams-carousel-stage';

      // Prev Button
      const prevBtn = document.createElement('button');
      prevBtn.className = 'teams-nav-btn prev';
      prevBtn.setAttribute('aria-label', `Previous ${this.domainInfo.name} member`);
      prevBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>`;

      // Next Button
      const nextBtn = document.createElement('button');
      nextBtn.className = 'teams-nav-btn next';
      nextBtn.setAttribute('aria-label', `Next ${this.domainInfo.name} member`);
      nextBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>`;

      // Track
      this.trackEl = document.createElement('div');
      this.trackEl.className = 'teams-cards-track';
      this.trackEl.setAttribute('role', 'region');
      this.trackEl.setAttribute('aria-label', `${this.domainInfo.name} members carousel`);

      const total = this.members.length;
      this.members.forEach((member, idx) => {
        const card = createCardElement(member, idx, this.currentIndex, total, this.domainInfo.accentColor);
        card.addEventListener('click', (e) => {
          if (e.target.closest('.team-social-btn')) return;
          if (this.currentIndex !== idx) {
            this.goToIndex(idx);
            this.resetAutoPlay();
          }
        });
        this.trackEl.appendChild(card);
        this.cardElements.push(card);
      });

      stage.appendChild(prevBtn);
      stage.appendChild(nextBtn);
      stage.appendChild(this.trackEl);
      this.containerEl.appendChild(stage);

      // Event Listeners
      prevBtn.addEventListener('click', () => { this.prev(); this.resetAutoPlay(); });
      nextBtn.addEventListener('click', () => { this.next(); this.resetAutoPlay(); });

      this.setupGestures(stage);

      // Autoplay with hover-pause
      stage.addEventListener('mouseenter', () => this.stopAutoPlay());
      stage.addEventListener('mouseleave', () => this.startAutoPlay());

      this.updatePositions();
      this.startAutoPlay();
    }

    setupGestures(stage) {
      let touchStartX = 0;
      let touchStartY = 0;
      let touchDeltaX = 0;
      let isHorizontalSwipe = null;

      stage.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchDeltaX = 0;
        isHorizontalSwipe = null;
        this.stopAutoPlay();
      }, { passive: true });

      stage.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        touchDeltaX = currentX - touchStartX;
        const deltaY = Math.abs(currentY - touchStartY);

        if (isHorizontalSwipe === null) {
          if (Math.abs(touchDeltaX) > 8 || deltaY > 8) {
            isHorizontalSwipe = Math.abs(touchDeltaX) > deltaY;
          }
        }
      }, { passive: true });

      stage.addEventListener('touchend', () => {
        if (isHorizontalSwipe) {
          if (touchDeltaX < -45) {
            this.next();
          } else if (touchDeltaX > 45) {
            this.prev();
          }
        }
        this.startAutoPlay();
      }, { passive: true });
    }

    goToIndex(targetIdx) {
      const total = this.members.length;
      if (total <= 1) return;
      this.currentIndex = ((targetIdx % total) + total) % total;
      this.updatePositions();
    }

    next() {
      this.goToIndex(this.currentIndex + 1);
    }

    prev() {
      this.goToIndex(this.currentIndex - 1);
    }

    updatePositions() {
      if (!this.cardElements.length) return;
      const total = this.members.length;
      const device = getDeviceType();

      for (let i = 0; i < total; i++) {
        const card = this.cardElements[i];
        const delta = computeCardDelta(i, this.currentIndex, total);
        const preset = getCardPreset(device, delta);

        card.style.transform = preset.transform;
        card.style.opacity = preset.opacity;
        card.style.zIndex = preset.zIndex;
        card.style.pointerEvents = preset.pe;
        card.style.visibility = preset.vis;

        if (delta === 0) {
          card.classList.add('is-active');
          card.style.setProperty('--active-accent', this.domainInfo.accentColor);
        } else {
          card.classList.remove('is-active');
        }

        // Lazy load image if entering visible arc
        if (delta !== 'dormant' && Math.abs(delta) <= 2) {
          const img = card.querySelector('.team-card-image');
          if (img && img.getAttribute('data-src')) {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
          }
        }
      }
    }

    startAutoPlay() {
      if (this.members.length <= 1) return;
      this.stopAutoPlay();
      this.autoPlayTimer = setInterval(() => {
        this.next();
      }, 4200 + Math.random() * 400); // Slight staggering between domain carousels
    }

    stopAutoPlay() {
      if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer);
        this.autoPlayTimer = null;
      }
    }

    resetAutoPlay() {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }

  // =========================================================
  // 5. HELPER: CREATE MEMBER CARD ELEMENT
  // =========================================================
  function createCardElement(member, idx, currentIdx, total, fallbackAccent) {
    const card = document.createElement('div');
    card.className = 'team-card';
    card.setAttribute('data-index', idx);
    card.setAttribute('role', 'group');
    card.setAttribute('aria-label', `${member.name} - ${member.role}`);

    const githubUrl = member.github || 'https://github.com';
    const linkedinUrl = member.linkedin || 'https://linkedin.com';
    const accent = member.accentColor || fallbackAccent || '#38bdf8';

    const delta = computeCardDelta(idx, currentIdx, total);
    const isInitiallyVisible = total === 1 || (delta !== 'dormant' && Math.abs(delta) <= 2);
    const initialSrc = isInitiallyVisible ? member.image : PLACEHOLDER_IMG;
    const dataSrcAttr = isInitiallyVisible ? '' : `data-src="${member.image}"`;

    card.innerHTML = `
      <div class="team-card-photo-box">
        <img class="team-card-image" src="${initialSrc}" ${dataSrcAttr} alt="${escapeHTML(member.name)}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'280\\' height=\\'210\\'><rect fill=\\'%23191c28\\' width=\\'280\\' height=\\'210\\'/><text fill=\\'%237dd3fc\\' x=\\'50%\\' y=\\'50%\\' font-family=\\'sans-serif\\' font-size=\\'18\\' font-weight=\\'bold\\' text-anchor=\\'middle\\'>${encodeURIComponent(member.name)}</text></svg>'">
      </div>
      <div class="team-card-content">
        <div class="team-card-info-top">
          <h3 class="team-card-name">${escapeHTML(member.name)}</h3>
          <div class="team-card-role-row">
            <span class="team-card-role-badge" style="color: ${accent}; border-color: ${accent}55; background: ${accent}18;">
              ${escapeHTML(member.role)}
            </span>
          </div>
          <div class="team-card-academic">
            <span class="academic-cap">🎓</span>
            <span class="academic-text">${escapeHTML(member.subtext)}</span>
          </div>
          <p class="team-card-about">${escapeHTML(member.bio)}</p>
        </div>
        <div class="team-card-footer">
          <div class="team-social-row">
            <a href="${githubUrl}" class="team-social-btn team-social-github" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(member.name)} GitHub" title="View GitHub Profile">
              ${GITHUB_SVG}
            </a>
            <a href="${linkedinUrl}" class="team-social-btn team-social-linkedin" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(member.name)} LinkedIn" title="View LinkedIn Profile">
              ${LINKEDIN_SVG}
            </a>
          </div>
        </div>
      </div>
    `;

    // Prevent clicks on social links from bubbling up
    card.querySelectorAll('.team-social-btn').forEach(btn => {
      btn.addEventListener('pointerdown', (e) => e.stopPropagation());
      btn.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
      btn.addEventListener('mousedown', (e) => e.stopPropagation());
      btn.addEventListener('click', (e) => e.stopPropagation());
    });

    return card;
  }

  // =========================================================
  // 6. MAIN ENGINE & STATE
  // =========================================================
  let allMembers = [...DEFAULT_MEMBERS];
  let carouselInstances = [];
  let jumpNavContainer = null;
  let sectionsWrapper = null;
  let globalLenis = null;

  function normalizeTeamName(teamStr) {
    if (!teamStr) return 'Core Team';
    const clean = teamStr.trim();
    if (/^core/i.test(clean)) return 'Core Team';
    if (/^(ai|ml|ai\s*\/\s*ml)/i.test(clean)) return 'AI / ML';
    if (/^web/i.test(clean)) return 'Web Development';
    if (/^(ui|ux|ui\s*\/\s*ux|design)/i.test(clean)) return 'UI / UX & Design';
    if (/^(event|operation)/i.test(clean)) return 'Events & Operations';
    if (/^(cp|competitive)/i.test(clean)) return 'CP';
    return clean;
  }

  async function initTeamsPage() {
    jumpNavContainer = document.getElementById('teams-jump-container');
    sectionsWrapper = document.getElementById('teams-sections-wrapper');

    if (!sectionsWrapper) return;

    setupBgVideo();
    setupHomeStyleNavbar();
    setupLenisScroll();

    // Check cached data for fast initial paint
    try {
      const cached = sessionStorage.getItem(CSV_CACHE_KEY);
      if (cached) {
        const parsed = parseCSV(cached);
        if (parsed && parsed.length > 0) {
          allMembers = parsed;
        }
      }
    } catch (e) {}

    // Fetch freshest members.csv immediately
    const loaded = await loadMembersCSV();
    
    // Render with the freshest data (or fallback if fetch fails)
    renderAllDomainSections();

    // Resize listener to re-align carousel items
    window.addEventListener('resize', debounce(() => {
      carouselInstances.forEach(c => c.updatePositions());
    }, 60));

    // Page visibility listener
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        carouselInstances.forEach(c => c.stopAutoPlay());
      } else {
        carouselInstances.forEach(c => c.startAutoPlay());
      }
    });
  }

  // =========================================================
  // 7. RENDER ALL DOMAIN SECTIONS SEQUENTIALLY
  // =========================================================
  function renderAllDomainSections() {
    if (!sectionsWrapper) return;

    // Clean up existing carousels
    carouselInstances.forEach(c => c.stopAutoPlay());
    carouselInstances = [];

    sectionsWrapper.innerHTML = '';
    if (jumpNavContainer) jumpNavContainer.innerHTML = '';

    // Group members by normalized domain
    const membersByDomain = {};
    const domainsToRender = [...DOMAIN_ORDER];

    // Check for any custom domain names present in CSV
    allMembers.forEach(m => {
      const normTeam = normalizeTeamName(m.team);
      if (!membersByDomain[normTeam]) {
        membersByDomain[normTeam] = [];
      }
      membersByDomain[normTeam].push(m);

      // If this domain isn't in DOMAIN_ORDER, add it dynamically
      if (!domainsToRender.some(d => d.name.toLowerCase() === normTeam.toLowerCase())) {
        const slug = normTeam.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        domainsToRender.push({
          id: slug,
          name: normTeam,
          tag: `// ${normTeam.toUpperCase()}`,
          title: normTeam,
          desc: `Members and contributors in ${normTeam}.`,
          accentColor: m.accentColor || '#38bdf8'
        });
      }
    });

    // Render Jump Pills & Team Blocks
    domainsToRender.forEach(domain => {
      const domainMembers = membersByDomain[domain.name] || [];
      if (domainMembers.length === 0) return;

      // 1. Create Jump Nav Pill
      if (jumpNavContainer) {
        const pill = document.createElement('a');
        pill.className = 'teams-jump-btn';
        pill.href = `#domain-${domain.id}`;
        pill.setAttribute('data-domain', domain.name);
        pill.innerHTML = `
          <span>${escapeHTML(domain.name)}</span>
          <span class="teams-jump-count">${domainMembers.length}</span>
        `;
        pill.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.getElementById(`domain-${domain.id}`);
          if (target) {
            const activeLenis = globalLenis || window.lenis;
            if (activeLenis) {
              activeLenis.scrollTo(target, { offset: -95 });
            } else {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        });
        jumpNavContainer.appendChild(pill);
      }

      // 2. Create Domain Section Block
      const block = document.createElement('section');
      block.className = 'team-domain-block';
      block.id = `domain-${domain.id}`;
      block.setAttribute('data-domain', domain.name);

      // Domain Header
      const header = document.createElement('div');
      header.className = 'team-domain-header';
      header.innerHTML = `
        <div class="team-domain-badge" style="color: ${domain.accentColor}; background: ${domain.accentColor}18; border-color: ${domain.accentColor}55;">
          <span class="team-domain-badge-dot" style="background: ${domain.accentColor}; box-shadow: 0 0 8px ${domain.accentColor};"></span>
          <span>${escapeHTML(domain.tag)}</span>
        </div>
        <h2 class="team-domain-title">${escapeHTML(domain.title)}</h2>
        <p class="team-domain-desc">${escapeHTML(domain.desc)}</p>
      `;
      block.appendChild(header);

      // Carousel / Showcase Container
      sectionsWrapper.appendChild(block);

      // Instantiate Carousel
      const instance = new TeamCarousel(domain, domainMembers, block);
      carouselInstances.push(instance);
    });

    setupScrollSpy();
  }

  // =========================================================
  // 8. SCROLL-SPY FOR STICKY JUMP NAV PILLS
  // =========================================================
  function setupScrollSpy() {
    if (!jumpNavContainer) return;
    const blocks = document.querySelectorAll('.team-domain-block');
    const pills = jumpNavContainer.querySelectorAll('.teams-jump-btn');

    if (!blocks.length || !pills.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const domain = entry.target.getAttribute('data-domain');
          pills.forEach(pill => {
            pill.classList.toggle('active', pill.getAttribute('data-domain') === domain);
          });
        }
      });
    }, {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    blocks.forEach(block => observer.observe(block));

    // Activate first pill by default
    if (pills[0]) pills[0].classList.add('active');
  }

  // =========================================================
  // 9. CSV PARSER WITH CACHE-BUSTED FETCH & SESSION CACHING
  // =========================================================
  async function loadMembersCSV() {
    try {
      const timestamp = Date.now();
      const response = await fetch(`data/members.csv?_=${timestamp}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!response.ok) return false;
      const csvText = await response.text();

      const parsed = parseCSV(csvText);
      if (parsed && parsed.length > 0) {
        allMembers = parsed;
        try {
          sessionStorage.setItem(CSV_CACHE_KEY, csvText);
        } catch (e) {}
        return true;
      }
    } catch (err) {
      console.warn('Live fetch for members.csv was not available (using cached or fallback members):', err);
      if (!allMembers || allMembers.length === 0) {
        allMembers = [...DEFAULT_MEMBERS];
      }
    }
    return false;
  }

  function parseCSV(text) {
    if (!text || typeof text !== 'string') return null;
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return null;

    const rawHeaders = parseCSVRow(lines[0]);
    const headers = rawHeaders.map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = parseCSVRow(line);
      const entry = {};

      for (let j = 0; j < headers.length; j++) {
        entry[headers[j]] = values[j] !== undefined ? values[j] : '';
      }

      if (entry.name) {
        const team = normalizeTeamName(entry.team || entry.teamtype || 'Core Team');
        const role = entry.role || 'Team Member';

        let defaultAccent = '#38bdf8';
        if (team === 'Core Team') defaultAccent = '#ffb900';
        else if (team === 'AI / ML') defaultAccent = '#34d399';
        else if (team === 'Web Development') defaultAccent = '#38bdf8';
        else if (team === 'UI / UX & Design') defaultAccent = '#ec4899';
        else if (team === 'Events & Operations') defaultAccent = '#f25022';
        else if (team === 'CP') defaultAccent = '#a855f7';

        result.push({
          id: entry.id || String(i),
          name: entry.name,
          team: team,
          role: role,
          subtext: entry.subtext || '',
          bio: entry.bio || '',
          image: entry.image || 'assets/images/members/diya.jpg',
          bgVideo: entry.bgvideo || 'assets/videos/10405281-hd_3840_2160_30fps.mp4',
          accentColor: entry.accentcolor || defaultAccent,
          github: entry.github || 'https://github.com',
          linkedin: entry.linkedin || 'https://linkedin.com'
        });
      }
    }
    return result.length > 0 ? result : null;
  }

  function parseCSVRow(row) {
    const values = [];
    let insideQuote = false;
    let current = '';

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        if (insideQuote && row[i + 1] === '"') {
          current += '"';
          i++; // Skip escaped quote
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  }

  // =========================================================
  // 10. BACKGROUND VIDEO CONTROLLER (PING-PONG LOOP)
  // =========================================================
  function setupBgVideo() {
    const bgVideo = document.getElementById('teams-bg-video');
    if (!bgVideo) return;

    bgVideo.loop = true;

    const startPlayback = () => {
      if (bgVideo.paused) {
        const promise = bgVideo.play();
        if (promise !== undefined) {
          promise.catch(() => {
            const resumeOnInteract = () => {
              bgVideo.play().catch(() => {});
              window.removeEventListener('click', resumeOnInteract);
              window.removeEventListener('touchstart', resumeOnInteract);
            };
            window.addEventListener('click', resumeOnInteract, { once: true });
            window.addEventListener('touchstart', resumeOnInteract, { once: true });
          });
        }
      }
    };

    // Tab visibility handling: pause during inactive tabs to save CPU/GPU cycles
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        bgVideo.pause();
      } else {
        startPlayback();
      }
    });

    requestAnimationFrame(() => startPlayback());
  }

  function setupHomeStyleNavbar() {
    const hamburgerBtn = document.getElementById('nav-hamburger');
    const sidebarDrawer = document.getElementById('sidebar-drawer');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const sidebarClose = document.getElementById('sidebar-close');

    if (!hamburgerBtn || !sidebarDrawer) return;

    const openSidebar = () => {
      sidebarDrawer.classList.add('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.add('open');
      hamburgerBtn.classList.add('hidden');
      document.body.classList.add('sidebar-open');
    };

    const closeSidebar = () => {
      sidebarDrawer.classList.remove('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.remove('open');
      hamburgerBtn.classList.remove('hidden');
      document.body.classList.remove('sidebar-open');
    };

    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openSidebar();
    });

    if (sidebarClose) {
      sidebarClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSidebar();
      });
    }

    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', () => closeSidebar());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebarDrawer.classList.contains('open')) {
        closeSidebar();
      }
    });
  }

  function setupLenisScroll() {
    if (typeof Lenis === 'undefined' || globalLenis) return;
    try {
      globalLenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        infinite: false
      });

      function raf(time) {
        globalLenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (e) {}
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // Auto-boot on DOM readiness
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTeamsPage);
  } else {
    initTeamsPage();
  }

})();
