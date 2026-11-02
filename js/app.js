/* ------------------------------------------------------------------
   Profile site — Vue 3 app
------------------------------------------------------------------ */
const { createApp, ref, computed, watch, onMounted, onBeforeUnmount } = Vue;
const SITE = window.SITE_DATA;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------- */
/* Skill constellation component */
/* ------------------------------------------- */
const SkillConstellation = {
	props: {
		skills: { type: Array, required: true },
		groups: { type: Array, required: true },
	},
	setup(props) {
		const featured = props.skills.find((skill) => skill.featured) || props.skills[0];
		const activeName = ref(featured.name);
		const active = computed(() => props.skills.find((skill) => skill.name === activeName.value));

		// Join the stars of each group, in order, into a constellation
		const lines = computed(() => {
			const result = [];
			props.groups.forEach((group) => {
				const stars = props.skills.filter((skill) => skill.group === group);
				for (let i = 1; i < stars.length; i++) {
					result.push({
						key: stars[i - 1].name + "-" + stars[i].name,
						group,
						x1: stars[i - 1].x,
						y1: stars[i - 1].y,
						x2: stars[i].x,
						y2: stars[i].y,
					});
				}
			});
			return result;
		});

		const skillsIn = (group) => props.skills.filter((skill) => skill.group === group);
		const select = (name) => {
			activeName.value = name;
		};

		return { activeName, active, lines, skillsIn, select };
	},
	template: `
		<div class="constellation">
			<div class="constellation-map">
				<svg class="constellation-svg" viewBox="0 0 100 60" role="img" aria-label="A star map of my skills, grouped into constellations">
					<line
						v-for="line in lines"
						:key="line.key"
						class="constellation-line"
						:class="{ 'is-lit': line.group === active.group }"
						:x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2"
					></line>
					<g
						v-for="skill in skills"
						:key="skill.name"
						class="constellation-star"
						:class="{ 'is-active': skill.name === activeName, 'is-lit': skill.group === active.group }"
						@mouseenter="select(skill.name)"
						@click="select(skill.name)"
					>
						<circle class="star-hit" :cx="skill.x" :cy="skill.y" r="4"></circle>
						<circle class="star-halo" :cx="skill.x" :cy="skill.y" r="3.2"></circle>
						<circle class="star-dot" :cx="skill.x" :cy="skill.y" :r="skill.core ? 1.1 : 0.75"></circle>
						<text class="star-label" :x="skill.x" :y="skill.y + 4.2" text-anchor="middle" font-size="2.4">{{ skill.name }}</text>
					</g>
				</svg>
			</div>

			<div class="constellation-panel">
				<div class="panel-detail" aria-live="polite">
					<p class="panel-group">{{ active.group }}</p>
					<transition name="fade" mode="out-in">
						<div class="panel-copy" :key="active.name">
							<h3 class="panel-name">{{ active.name }}</h3>
							<p class="panel-note">{{ active.note }}</p>
						</div>
					</transition>
				</div>

				<div class="chip-group" v-for="group in groups" :key="group">
					<p class="chip-group-name">{{ group }}</p>
					<ul class="chip-list">
						<li class="chip-item" v-for="skill in skillsIn(group)" :key="skill.name">
							<button
								class="chip"
								:class="{ 'is-active': skill.name === activeName }"
								type="button"
								:aria-pressed="skill.name === activeName"
								@click="select(skill.name)"
								@mouseenter="select(skill.name)"
							>{{ skill.name }}</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	`,
};

/* ------------------------------------------- */
/* Root app */
/* ------------------------------------------- */
const app = createApp({
	setup() {
		const navItems = [
			{ id: "about", label: "About" },
			{ id: "services", label: "Services" },
			{ id: "skills", label: "Skills" },
			{ id: "certified", label: "AWS" },
			{ id: "work", label: "Work" },
			{ id: "journey", label: "Journey" },
			{ id: "contact", label: "Contact" },
		];
		const sectionOrder = ["hero", ...navItems.map((item) => item.id)];

		const active = ref("hero");
		const menuOpen = ref(false);
		const scrolled = ref(false);
		const progress = ref(0);
		const talking = ref(true);

		/* Guide pose follows the section */
		const poses = ["down", "left", "up"];
		const pose = computed(() => {
			if (active.value === "hero") return "down";
			if (active.value === "contact") return "up";
			return "left";
		});
		const guideLine = computed(() => SITE.guideLines[active.value] || "");

		let talkTimer = null;
		watch(active, () => {
			talking.value = true;
			clearTimeout(talkTimer);
			talkTimer = setTimeout(() => {
				talking.value = false;
			}, 4000);
		});

		const guideClick = () => {
			if (pose.value === "up") {
				window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
				return;
			}
			const next = sectionOrder[sectionOrder.indexOf(active.value) + 1];
			if (next) document.getElementById(next).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
		};

		/* Menu locks page scroll while open */
		watch(menuOpen, (open) => {
			document.documentElement.classList.toggle("menu-active", open);
		});

		/* Typewriter in the hero */
		const typed = ref(reduceMotion ? SITE.heroRoles[0] : "");
		let typeTimer = null;
		let roleIndex = 0;
		let charIndex = 0;
		let deleting = false;

		const typeTick = () => {
			const word = SITE.heroRoles[roleIndex];

			if (reduceMotion) {
				roleIndex = (roleIndex + 1) % SITE.heroRoles.length;
				typed.value = SITE.heroRoles[roleIndex];
				typeTimer = setTimeout(typeTick, 3000);
				return;
			}

			if (!deleting) {
				charIndex++;
				typed.value = word.slice(0, charIndex);
				if (charIndex === word.length) {
					deleting = true;
					typeTimer = setTimeout(typeTick, 1800);
					return;
				}
				typeTimer = setTimeout(typeTick, 65);
			} else {
				charIndex--;
				typed.value = word.slice(0, charIndex);
				if (charIndex === 0) {
					deleting = false;
					roleIndex = (roleIndex + 1) % SITE.heroRoles.length;
					typeTimer = setTimeout(typeTick, 350);
					return;
				}
				typeTimer = setTimeout(typeTick, 30);
			}
		};

		/* Scroll state */
		const onScroll = () => {
			const max = document.documentElement.scrollHeight - window.innerHeight;
			progress.value = max > 0 ? window.scrollY / max : 0;
			scrolled.value = window.scrollY > 20;
		};

		let sectionObserver = null;

		onMounted(() => {
			sectionObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) active.value = entry.target.id;
					});
				},
				{ rootMargin: "-45% 0px -50% 0px" }
			);
			document.querySelectorAll("[data-section]").forEach((section) => sectionObserver.observe(section));

			window.addEventListener("scroll", onScroll, { passive: true });
			onScroll();

			talkTimer = setTimeout(() => {
				talking.value = false;
			}, 5000);
			typeTimer = setTimeout(typeTick, reduceMotion ? 3000 : 900);
		});

		onBeforeUnmount(() => {
			sectionObserver?.disconnect();
			window.removeEventListener("scroll", onScroll);
			clearTimeout(typeTimer);
			clearTimeout(talkTimer);
		});

		return {
			...SITE,
			year: new Date().getFullYear(),
			romans: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"],
			navItems,
			active,
			menuOpen,
			scrolled,
			progress,
			talking,
			poses,
			pose,
			guideLine,
			guideClick,
			typed,
		};
	},
});

/* ------------------------------------------- */
/* v-reveal: fade elements up as they scroll in */
/* ------------------------------------------- */
const revealObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			entry.target.classList.add("is-visible");
			revealObserver.unobserve(entry.target);
		});
	},
	{ threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
);

app.directive("reveal", {
	mounted(el, binding) {
		el.classList.add("reveal");
		if (binding.value) el.style.setProperty("--reveal-delay", binding.value + "ms");
		revealObserver.observe(el);
	},
});

app.component("skill-constellation", SkillConstellation);
app.mount("#app");
