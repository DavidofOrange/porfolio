/* ------------------------------------------------------------------
   Site content — edit this file to update the text on the page.
------------------------------------------------------------------ */
window.SITE_DATA = {
    profile: {
        firstName: "David",
        lastName: "Childerhose",
        role: "Front-End Developer",
        location: "Central Tokyo",
        company: "Soft Communications",
        status: "Open to new projects",
        email: "davidoforange@outlook.com",
        linkedin: "https://www.linkedin.com/in/david-childerhose/",
        github: "",
    },

    // Words that rotate in the hero: "I build ___"
    heroRoles: [
        "corporate websites",
        "custom WordPress themes",
        "landing pages that convert",
        "recruitment sites",
        "smooth PHP upgrades",
        "things that just work",
    ],

    about: [
        "I'm a Tokyo-based front-end developer who sweats the details most people never notice — the spacing that feels right, the animation that lands just so, the layout that holds up on every screen.",
        "Since 2022 I've been building and maintaining websites for clients across Japan at Soft Communications — corporate sites, recruitment sites, product pages, landing pages and WordPress builds, plus the PHP upgrades that keep older sites fast and secure.",
        "I trained in advanced full-stack engineering at Code Chrysalis, and in 2026 I became an AWS Certified Cloud Practitioner — so I understand not just how a site looks, but where it lives and how it runs.",
    ],

    stats: [
        { value: "4+", label: "Years building client sites in Tokyo" },
        { value: "AWS", label: "Certified Cloud Practitioner" },
        { value: "Tokyo", label: "Based in the heart of the city" },
    ],

    // What the guide says in each section
    guideLines: {
        hero: "Hi! Scroll down — I'll show you around.",
        about: "That's me in a nutshell.",
        services: "Need a website? This is what I do.",
        skills: "Click a star to see what I use it for.",
        certified: "Certified by AWS. Not bad, right?",
        work: "Here's some of what I've built.",
        journey: "Here's how I got here.",
        contact: "Back to the top? Just click me!",
    },

    services: [
        {
            title: "Websites from scratch",
            text: "Corporate sites, brand sites and portfolios — from your Figma design or a rough idea, built responsive, fast and easy to maintain.",
        },
        {
            title: "WordPress builds",
            text: "Custom themes and page templates your team can update themselves, without calling a developer every time.",
        },
        {
            title: "PHP upgrades",
            text: "Moving older sites to modern PHP safely — finding and fixing what breaks before your visitors ever notice.",
        },
        {
            title: "Recruitment sites",
            text: "Careers pages and hiring sites that show off your company culture and make good candidates want to apply.",
        },
        {
            title: "Product & landing pages",
            text: "High-impact LPs and product pages with clear structure and motion that guides the eye toward the call to action.",
        },
        {
            title: "Anything else",
            text: "Bug fixes, site migrations, AWS hosting questions, a slider that won't behave — if it lives on the web, just ask.",
        },
    ],

    // Each skill group is a real constellation. Star positions are true
    // J2000 coordinates (ra in hours, dec in degrees) and mag is the star's
    // real brightness — lower is brighter, so brighter stars draw bigger.
    // box is the area of the map (100 x 80) the constellation is fitted into.
    // nameAt is where the constellation's name is written on the map.
    constellations: [
        {
            group: "Front-End",
            name: "Orion",
            box: { x: 3, y: 6, w: 28, h: 66 },
            nameAt: { x: 17, y: 77 },
            stars: {
                Betelgeuse: { ra: 5.9195, dec: 7.407, mag: 0.5 },
                Bellatrix: { ra: 5.4189, dec: 6.35, mag: 1.64 },
                Meissa: { ra: 5.5856, dec: 9.934, mag: 3.39 },
                Mintaka: { ra: 5.5334, dec: -0.299, mag: 2.23 },
                Alnilam: { ra: 5.6036, dec: -1.202, mag: 1.69 },
                Alnitak: { ra: 5.6793, dec: -1.943, mag: 1.77 },
                Saiph: { ra: 5.7959, dec: -9.67, mag: 2.09 },
                Rigel: { ra: 5.2423, dec: -8.202, mag: 0.13 },
            },
            lines: [
                ["Meissa", "Betelgeuse"],
                ["Meissa", "Bellatrix"],
                ["Betelgeuse", "Alnitak"],
                ["Bellatrix", "Mintaka"],
                ["Mintaka", "Alnilam"],
                ["Alnilam", "Alnitak"],
                ["Alnitak", "Saiph"],
                ["Mintaka", "Rigel"],
            ],
        },
        {
            group: "Back-End & CMS",
            name: "Cygnus",
            box: { x: 42, y: 40, w: 54, h: 36 },
            nameAt: { x: 44, y: 44 },
            stars: {
                Deneb: { ra: 20.6905, dec: 45.28, mag: 1.25 },
                Sadr: { ra: 20.3705, dec: 40.257, mag: 2.23 },
                Albireo: { ra: 19.512, dec: 27.96, mag: 3.05 },
                Gienah: { ra: 20.7702, dec: 33.97, mag: 2.48 },
                "Zeta Cygni": { ra: 21.2156, dec: 30.227, mag: 3.2 },
                "Delta Cygni": { ra: 19.7496, dec: 45.131, mag: 2.87 },
                "Iota Cygni": { ra: 19.4951, dec: 51.73, mag: 3.79 },
                "Kappa Cygni": { ra: 19.2851, dec: 53.369, mag: 3.8 },
            },
            lines: [
                ["Deneb", "Sadr"],
                ["Sadr", "Albireo"],
                ["Sadr", "Gienah"],
                ["Gienah", "Zeta Cygni"],
                ["Sadr", "Delta Cygni"],
                ["Delta Cygni", "Iota Cygni"],
                ["Iota Cygni", "Kappa Cygni"],
            ],
        },
        {
            group: "Cloud & Toolkit",
            name: "Big Dipper",
            box: { x: 38, y: 4, w: 59, h: 28 },
            nameAt: { x: 60, y: 7 },
            stars: {
                Dubhe: { ra: 11.0621, dec: 61.751, mag: 1.79 },
                Merak: { ra: 11.0307, dec: 56.382, mag: 2.37 },
                Phecda: { ra: 11.8972, dec: 53.695, mag: 2.44 },
                Megrez: { ra: 12.2571, dec: 57.033, mag: 3.31 },
                Alioth: { ra: 12.9005, dec: 55.96, mag: 1.77 },
                Mizar: { ra: 13.3988, dec: 54.925, mag: 2.23 },
                Alkaid: { ra: 13.7923, dec: 49.313, mag: 1.86 },
            },
            lines: [
                ["Dubhe", "Merak"],
                ["Merak", "Phecda"],
                ["Phecda", "Megrez"],
                ["Megrez", "Dubhe"],
                ["Megrez", "Alioth"],
                ["Alioth", "Mizar"],
                ["Mizar", "Alkaid"],
            ],
        },
    ],

    // star: which star in the group's constellation the skill sits on
    // label: where the name sits beside the star — top, bottom, left or right
    // featured: the star selected when the page loads
    skills: [
        // Front-End — Orion
        {
            name: "JavaScript",
            group: "Front-End",
            star: "Rigel",
            label: "bottom",
            note: "Interactive UI, DOM work and the logic that makes a static design feel alive.",
        },
        {
            name: "HTML",
            group: "Front-End",
            star: "Betelgeuse",
            label: "bottom",
            note: "Semantic, accessible markup — header, nav, main, section, footer used for what they mean.",
        },
        {
            name: "CSS",
            group: "Front-End",
            star: "Bellatrix",
            label: "bottom",
            note: "Native CSS nesting, flexbox and grid layouts, and rem-based responsive scales.",
        },
        {
            name: "Vue.js",
            group: "Front-End",
            star: "Alnilam",
            label: "right",
            note: "Reactive components and state — this very site is built with Vue 3.",
        },
        {
            name: "Pinia",
            group: "Front-End",
            star: "Alnitak",
            label: "left",
            note: "Vue's state store — keeping shared data tidy and predictable as an app grows.",
        },
        {
            name: "React",
            group: "Front-End",
            star: "Mintaka",
            label: "top",
            note: "Component-driven UIs with hooks and props — the same way of thinking as Vue, in a different syntax.",
        },
        {
            name: "Sass",
            group: "Front-End",
            star: "Saiph",
            label: "bottom",
            note: "Variables, mixins and partials for large stylesheets — and knowing when native CSS is enough.",
        },
        {
            name: "Responsive",
            group: "Front-End",
            star: "Meissa",
            label: "top",
            note: "Layouts that hold up from a 375px phone to a 1920px desktop.",
        },

        // Back-End & CMS — Cygnus
        {
            name: "WordPress",
            group: "Back-End & CMS",
            star: "Deneb",
            label: "top",
            note: "Custom themes and page templates that clients can actually edit.",
        },
        {
            name: "PHP",
            group: "Back-End & CMS",
            star: "Sadr",
            label: "right",
            note: "Theme templates, shortcodes and version upgrades that keep legacy sites secure.",
        },
        {
            name: "Laravel",
            group: "Back-End & CMS",
            star: "Albireo",
            label: "right",
            note: "PHP's modern framework — routing, Eloquent models and Blade templates.",
        },
        {
            name: "MySQL",
            group: "Back-End & CMS",
            star: "Gienah",
            label: "right",
            note: "The database behind WordPress — queries, migrations and keeping data safe during upgrades.",
        },
        {
            name: "MongoDB",
            group: "Back-End & CMS",
            star: "Zeta Cygni",
            label: "bottom",
            note: "Document databases for flexible, JSON-shaped data.",
        },
        {
            name: "Node.js",
            group: "Back-End & CMS",
            star: "Delta Cygni",
            label: "right",
            note: "Server-side JavaScript — APIs, build scripts and tooling.",
        },
        {
            name: "Python",
            group: "Back-End & CMS",
            star: "Iota Cygni",
            label: "left",
            note: "Scripting and automation — quick tools and data clean-up.",
        },
        {
            name: "Java",
            group: "Back-End & CMS",
            star: "Kappa Cygni",
            label: "right",
            note: "Object-oriented fundamentals and strongly typed, structured code.",
        },

        // Cloud & Toolkit — Big Dipper
        {
            name: "AWS",
            group: "Cloud & Toolkit",
            star: "Alioth",
            label: "bottom",
            featured: true,
            note: "AWS Certified Cloud Practitioner (2026). I understand hosting, storage, security and cost in the cloud — the ground every site stands on.",
        },
        {
            name: "Git",
            group: "Cloud & Toolkit",
            star: "Dubhe",
            label: "right",
            note: "GitHub-based version control and collaboration on every project, big or small.",
        },
        {
            name: "Docker",
            group: "Cloud & Toolkit",
            star: "Alkaid",
            label: "bottom",
            note: "Containerized local environments, so every project runs the same on every machine.",
        },
        {
            name: "Figma",
            group: "Cloud & Toolkit",
            star: "Mizar",
            label: "bottom",
            note: "Reading designs precisely and translating them into pixel-perfect code.",
        },
        {
            name: "AI tools",
            group: "Cloud & Toolkit",
            star: "Merak",
            label: "left",
            note: "Cursor and Claude Code to move faster without cutting corners.",
        },
        {
            name: "Swiper",
            group: "Cloud & Toolkit",
            star: "Phecda",
            label: "bottom",
            note: "Carousels and sliders — coverflow, center focus, the works.",
        },
        {
            name: "jQuery",
            group: "Cloud & Toolkit",
            star: "Megrez",
            label: "top",
            note: "Maintaining and extending existing client sites that rely on it.",
        },
    ],

    certification: {
        name: "AWS Certified Cloud Practitioner",
        level: "Foundational",
        badge: "img/aws-certified-cloud-practioner.png",
        certificate: "img/AWS Certified Cloud Practitioner certificate.pdf",
        verifyUrl: "https://aws.amazon.com/verification",
        validation: "6f741a89ec0b4a509eab97ffebc240c8",
        issued: "January 27, 2026",
        expires: "January 27, 2029",
        text: "Amazon's official credential for understanding the AWS Cloud — its core services, security model, architecture and pricing. It means I can talk hosting, deployment and infrastructure with confidence, and build sites with where they'll run in mind.",
        points: [
            "Cloud concepts & architecture",
            "Security & compliance",
            "Core AWS services",
            "Billing & cost optimization",
        ],
    },

    // scroll: true for full-page screenshots — they scroll through the page on hover.
    // Leave it off for single-screen screenshots so the whole image stays in view.
    projects: [
        {
            title: "Maple Guitars",
            kind: "Demo · Luxury brand site",
            description:
                "A dark, luxurious site for a fictional custom guitar workshop — a hand-drawn SVG guitar with a living gloss, a finish selector that re-stains the figured maple top, and a commission flow.",
            tags: ["HTML", "CSS", "SVG", "JavaScript"],
            url: "demos/maple-guitars/index.html",
            image: "img/work/maple-guitars.jpg",
            visual: "browser",
            featured: true,
        },
        {
            title: "Arcline Careers",
            kind: "Demo · Recruitment site",
            description:
                "A bold careers site for a fictional Tokyo tech company — kinetic hero type, count-up stats, employee interviews and a filterable open-positions list.",
            tags: ["HTML", "CSS", "JavaScript", "Swiper"],
            url: "demos/arcline-careers/index.html",
            image: "img/work/arcline-careers.jpg",
            scroll: true,
            visual: "browser",
            featured: false,
        },
        {
            title: "Kumo Coffee",
            kind: "Demo · Product landing page · 日本語",
            description:
                "A fully Japanese landing page for a fictional Tokyo specialty roaster — Mincho typography, product cards with an animated cart, a live subscription builder and a café that knows if it's open right now.",
            tags: ["HTML", "CSS", "JavaScript"],
            url: "demos/kumo-coffee/index.html",
            image: "img/work/kumo-coffee.jpg",
            scroll: true,
            visual: "browser",
            featured: false,
        },
        {
            title: "Kiri Retreat",
            kind: "Demo · Hotel brand site",
            description:
                "A serene site for a fictional mountain onsen retreat — drifting mist, image reveals, seasonal experiences and a booking flow.",
            tags: ["HTML", "CSS", "JavaScript"],
            url: "demos/kiri-retreat/index.html",
            image: "img/work/kiri-retreat.jpg",
            scroll: true,
            visual: "browser",
            featured: false,
        },
        {
            title: "Client Work",
            kind: "Soft Communications · 2022 — now",
            description:
                "Corporate, recruitment, product and landing page sites for major companies across Japan — plus WordPress builds and PHP upgrades. They're under NDA, but I'm happy to walk you through them.",
            tags: ["WordPress", "PHP", "JavaScript", "Swiper"],
            url: "#contact",
            visual: "pages",
            featured: false,
        },
        {
            title: "Night of Terror",
            kind: "Personal project · Browser game",
            description:
                "A horror survival game that runs in the browser. Survive the night: 30 waves of the dead and wraiths that blink in behind you, with 10 unique bosses — a new one every third wave, and the ones you beat come back for more. Fight with a three-hit sword combo, arrows and potions, with a chapel to explore. Best played on a keyboard.",
            tags: ["JavaScript", "Game design", "Keyboard controls"],
            url: "https://david-night-of-terror.netlify.app/",
            // warning: shown as a notice on the card before anyone clicks through
            warning: "It's scary — horror themes and combat. Play with the lights on.",
            visual: "terror",
            featured: true,
            reversed: true,
        },
        {
            title: "Space Tourism",
            kind: "Frontend Mentor challenge",
            description:
                "A multi-page space tourism website built from a professional design — destinations, crew and technology pages with tabbed content and responsive layouts for mobile, tablet and desktop.",
            tags: ["HTML", "CSS", "JavaScript", "Responsive"],
            url: "https://david-space-tourism-website.netlify.app/",
            image: "img/work/space-tourism.jpg",
            visual: "browser",
            featured: true,
            reversed: true,
        },
    ],

    // Newest first. highlight: true gives the entry a gold card.
    journey: [
        {
            period: "Jan 2026",
            title: "AWS Certified Cloud Practitioner",
            place: "Amazon Web Services",
            text: "Earned Amazon's foundational cloud certification — cloud concepts, security, core services and pricing.",
            highlight: true,
        },
        {
            period: "Feb 2022 — Present",
            title: "Frontend Developer",
            place: "Soft Communications Co., Ltd. · Tokyo",
            text: "Building and maintaining websites for clients across Japan — corporate sites, recruitment sites, product pages and landing pages, WordPress themes and PHP upgrades. Working from Figma designs to production with Docker-based workflows.",
        },
        {
            period: "Feb 2021 — Jun 2021",
            title: "Advanced Full-Stack Engineering",
            place: "Code Chrysalis · Tokyo",
            text: "An immersive, intensive engineering program — front-end and back-end development, databases with MySQL, and team workflows on GitHub.",
        },
        {
            period: "Feb 2017 — Feb 2021",
            title: "English Instructor",
            place: "Berlitz Japan · Tokyo",
            text: "Four years working one-on-one with business professionals — where I learned to listen to clients, explain complex ideas simply, and deliver for every person in the room. Skills I use on every project today.",
        },
        {
            period: "2013 — 2016",
            title: "Bachelor of Arts",
            place: "University of Toronto · Woodsworth College",
            text: "Double major in East Asian Studies and History — the start of the road that brought me to Japan.",
        },
    ],
};
