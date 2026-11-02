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

	skillGroups: ["Front-End", "Back-End & CMS", "Cloud & Toolkit"],

	// x / y are positions on the star map (0–100 across, 0–60 down)
	// featured: the star selected when the page loads
	skills: [
		{ name: "HTML", group: "Front-End", core: true, x: 7, y: 12, note: "Semantic, accessible markup — header, nav, main, section, footer used for what they mean." },
		{ name: "CSS", group: "Front-End", core: true, x: 19, y: 6, note: "Native CSS nesting, flexbox layouts and rem-based responsive scales. No preprocessor needed." },
		{ name: "JavaScript", group: "Front-End", core: true, x: 31, y: 15, note: "Interactive UI, DOM work and the logic that makes a static design feel alive." },
		{ name: "Vue.js", group: "Front-End", core: true, x: 25, y: 27, note: "Reactive components and state — this very site is built with Vue 3." },
		{ name: "Responsive", group: "Front-End", core: false, x: 10, y: 26, note: "Layouts that hold up from a 375px phone to a 1920px desktop." },

		{ name: "WordPress", group: "Back-End & CMS", core: true, x: 50, y: 8, note: "Custom themes and page templates that clients can actually edit." },
		{ name: "PHP", group: "Back-End & CMS", core: true, x: 62, y: 16, note: "Theme templates, shortcodes and version upgrades that keep legacy sites secure." },
		{ name: "MySQL", group: "Back-End & CMS", core: false, x: 54, y: 27, note: "The database behind WordPress — queries, migrations and keeping data safe during upgrades." },

		{ name: "AWS", group: "Cloud & Toolkit", core: true, featured: true, x: 84, y: 9, note: "AWS Certified Cloud Practitioner (2026). I understand hosting, storage, security and cost in the cloud — the ground every site stands on." },
		{ name: "Docker", group: "Cloud & Toolkit", core: false, x: 93, y: 22, note: "Containerized local environments, so every project runs the same on every machine." },
		{ name: "Git", group: "Cloud & Toolkit", core: true, x: 80, y: 33, note: "GitHub-based version control and collaboration on every project, big or small." },
		{ name: "Figma", group: "Cloud & Toolkit", core: false, x: 67, y: 44, note: "Reading designs precisely and translating them into pixel-perfect code." },
		{ name: "Swiper", group: "Cloud & Toolkit", core: false, x: 51, y: 50, note: "Carousels and sliders — coverflow, center focus, the works." },
		{ name: "jQuery", group: "Cloud & Toolkit", core: false, x: 35, y: 45, note: "Maintaining and extending existing client sites that rely on it." },
		{ name: "AI tools", group: "Cloud & Toolkit", core: false, x: 18, y: 51, note: "Cursor and Claude Code to move faster without cutting corners." },
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
		points: ["Cloud concepts & architecture", "Security & compliance", "Core AWS services", "Billing & cost optimization"],
	},

	projects: [
		{
			title: "Maple Guitars",
			kind: "Demo · Luxury brand site",
			description: "A dark, luxurious site for a fictional custom guitar workshop — a hand-drawn SVG guitar with a living gloss, a finish selector that re-stains the figured maple top, and a commission flow.",
			tags: ["HTML", "CSS", "SVG", "JavaScript"],
			url: "demos/maple-guitars/index.html",
			image: "img/work/maple-guitars.jpg",
			visual: "browser",
			featured: true,
		},
		{
			title: "Arcline Careers",
			kind: "Demo · Recruitment site",
			description: "A bold careers site for a fictional Tokyo tech company — kinetic hero type, count-up stats, employee interviews and a filterable open-positions list.",
			tags: ["HTML", "CSS", "JavaScript", "Swiper"],
			url: "demos/arcline-careers/index.html",
			image: "img/work/arcline-careers.jpg",
			visual: "browser",
			featured: false,
		},
		{
			title: "Kumo Coffee",
			kind: "Demo · Product landing page · 日本語",
			description: "A fully Japanese landing page for a fictional Tokyo specialty roaster — Mincho typography, product cards with an animated cart, a live subscription builder and a café that knows if it's open right now.",
			tags: ["HTML", "CSS", "JavaScript"],
			url: "demos/kumo-coffee/index.html",
			image: "img/work/kumo-coffee.jpg",
			visual: "browser",
			featured: false,
		},
		{
			title: "Kiri Retreat",
			kind: "Demo · Hotel brand site",
			description: "A serene site for a fictional mountain onsen retreat — drifting mist, image reveals, seasonal experiences and a booking flow.",
			tags: ["HTML", "CSS", "JavaScript"],
			url: "demos/kiri-retreat/index.html",
			image: "img/work/kiri-retreat.jpg",
			visual: "browser",
			featured: false,
		},
		{
			title: "Client Work",
			kind: "Soft Communications · 2022 — now",
			description: "Corporate, recruitment, product and landing page sites for major companies across Japan — plus WordPress builds and PHP upgrades. They're under NDA, but I'm happy to walk you through them.",
			tags: ["WordPress", "PHP", "JavaScript", "Swiper"],
			url: "#contact",
			visual: "pages",
			featured: false,
		},
		{
			title: "Space Tourism",
			kind: "Frontend Mentor challenge",
			description: "A multi-page space tourism website built from a professional design — destinations, crew and technology pages with tabbed content and responsive layouts for mobile, tablet and desktop.",
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
		{ period: "Jan 2026", title: "AWS Certified Cloud Practitioner", place: "Amazon Web Services", text: "Earned Amazon's foundational cloud certification — cloud concepts, security, core services and pricing.", highlight: true },
		{ period: "Feb 2022 — Present", title: "Frontend Developer", place: "Soft Communications Co., Ltd. · Tokyo", text: "Building and maintaining websites for clients across Japan — corporate sites, recruitment sites, product pages and landing pages, WordPress themes and PHP upgrades. Working from Figma designs to production with Docker-based workflows." },
		{ period: "Feb 2021 — Jun 2021", title: "Advanced Full-Stack Engineering", place: "Code Chrysalis · Tokyo", text: "An immersive, intensive engineering program — front-end and back-end development, databases with MySQL, and team workflows on GitHub." },
		{ period: "Feb 2017 — Feb 2021", title: "English Instructor", place: "Berlitz Japan · Tokyo", text: "Four years working one-on-one with business professionals — where I learned to listen to clients, explain complex ideas simply, and deliver for every person in the room. Skills I use on every project today." },
		{ period: "2013 — 2016", title: "Bachelor of Arts", place: "University of Toronto · Woodsworth College", text: "Double major in East Asian Studies and History — the start of the road that brought me to Japan." },
	],
};
