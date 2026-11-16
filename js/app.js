/* ------------------------------------------------------------------
   Profile site — Vue 3 app
------------------------------------------------------------------ */
const { createApp, ref, computed, watch, onMounted, onBeforeUnmount } = Vue;
const SITE = window.SITE_DATA;
const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
).matches;

/* ------------------------------------------- */
/* Skill constellation component */
/* ------------------------------------------- */

// Project a star's real sky position (ra in hours, dec in degrees) onto a
// flat chart centred on (ra0, dec0) — a gnomonic projection, like a star atlas.
// East is to the left and north is up, as you see the sky looking up.
function projectStar(ra, dec, ra0, dec0) {
    const rad = Math.PI / 180;
    const a = ra * 15 * rad;
    const d = dec * rad;
    const a0 = ra0 * 15 * rad;
    const d0 = dec0 * rad;
    const cosC =
        Math.sin(d) * Math.sin(d0) +
        Math.cos(d) * Math.cos(d0) * Math.cos(a - a0);
    return {
        x: -(Math.cos(d) * Math.sin(a - a0)) / cosC,
        y:
            -(
                Math.sin(d) * Math.cos(d0) -
                Math.cos(d) * Math.sin(d0) * Math.cos(a - a0)
            ) / cosC,
    };
}

// Fit a constellation's projected stars into its box on the map, keeping its true shape
function layoutConstellation(constellation) {
    const stars = Object.entries(constellation.stars);
    const ra0 =
        stars.reduce((sum, [, star]) => sum + star.ra, 0) / stars.length;
    const dec0 =
        stars.reduce((sum, [, star]) => sum + star.dec, 0) / stars.length;
    const flat = stars.map(([name, star]) => ({
        name,
        ...star,
        ...projectStar(star.ra, star.dec, ra0, dec0),
    }));

    const xs = flat.map((star) => star.x);
    const ys = flat.map((star) => star.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const { box } = constellation;
    const scale = Math.min(box.w / (maxX - minX), box.h / (maxY - minY));
    const offsetX = box.x + (box.w - (maxX - minX) * scale) / 2;
    const offsetY = box.y + (box.h - (maxY - minY) * scale) / 2;

    const positions = {};
    flat.forEach((star) => {
        positions[star.name] = {
            x: offsetX + (star.x - minX) * scale,
            y: offsetY + (star.y - minY) * scale,
            // Brighter stars (lower magnitude) are drawn larger
            r: Math.max(0.55, 1.45 - star.mag * 0.2),
            mag: star.mag,
        };
    });
    return positions;
}

// Where a star's name sits, relative to the star
function labelPosition(star, side) {
    const gap = star.r + 1.2;
    if (side === "top")
        return { x: star.x, y: star.y - gap - 0.2, anchor: "middle" };
    if (side === "left")
        return { x: star.x - gap, y: star.y + 0.8, anchor: "end" };
    if (side === "right")
        return { x: star.x + gap, y: star.y + 0.8, anchor: "start" };
    return { x: star.x, y: star.y + gap + 1.8, anchor: "middle" };
}

const SkillConstellation = {
    props: {
        skills: { type: Array, required: true },
        constellations: { type: Array, required: true },
    },
    setup(props) {
        const layouts = {};
        props.constellations.forEach((constellation) => {
            layouts[constellation.group] = layoutConstellation(constellation);
        });

        const stars = props.skills
            .map((skill) => {
                const constellation = props.constellations.find(
                    (item) => item.group === skill.group,
                );
                const star =
                    layouts[skill.group] && layouts[skill.group][skill.star];
                if (!star) {
                    console.warn(`No star "${skill.star}" for ${skill.name}`);
                    return null;
                }
                return {
                    ...skill,
                    ...star,
                    constellation: constellation.name,
                    text: labelPosition(star, skill.label),
                };
            })
            .filter(Boolean);

        const lines = props.constellations.flatMap((constellation) =>
            constellation.lines.map(([from, to]) => {
                const a = layouts[constellation.group][from];
                const b = layouts[constellation.group][to];
                return {
                    key: constellation.name + "-" + from + "-" + to,
                    group: constellation.group,
                    x1: a.x,
                    y1: a.y,
                    x2: b.x,
                    y2: b.y,
                };
            }),
        );

        const featured = stars.find((star) => star.featured) || stars[0];
        const activeName = ref(featured.name);
        const active = computed(() =>
            stars.find((star) => star.name === activeName.value),
        );

        const skillsIn = (group) =>
            stars.filter((star) => star.group === group);
        const select = (name) => {
            activeName.value = name;
        };

        return { stars, activeName, active, lines, skillsIn, select };
    },
    template: `
		<div class="constellation">
			<div class="constellation-map">
				<svg class="constellation-svg" viewBox="0 0 100 80" role="img" aria-label="A star map of my skills — each group is a real constellation: Orion, Cygnus and the Big Dipper">
					<line
						v-for="line in lines"
						:key="line.key"
						class="constellation-line"
						:class="{ 'is-lit': line.group === active.group }"
						:x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2"
					></line>
					<text
						v-for="item in constellations"
						:key="item.name"
						class="constellation-name"
						:class="{ 'is-lit': item.group === active.group }"
						:x="item.nameAt.x" :y="item.nameAt.y"
						:text-anchor="item.nameAt.x < 30 ? 'middle' : 'start'"
						font-size="1.7"
					>{{ item.name }}</text>
					<g
						v-for="star in stars"
						:key="star.name"
						class="constellation-star"
						:class="{ 'is-active': star.name === activeName, 'is-lit': star.group === active.group }"
						@mouseenter="select(star.name)"
						@click="select(star.name)"
					>
						<circle class="star-hit" :cx="star.x" :cy="star.y" r="3"></circle>
						<circle class="star-halo" :cx="star.x" :cy="star.y" :r="star.r + 2.4"></circle>
						<circle class="star-dot" :cx="star.x" :cy="star.y" :r="star.r"></circle>
						<text class="star-label" :x="star.text.x" :y="star.text.y" :text-anchor="star.text.anchor" font-size="2.2">{{ star.name }}</text>
					</g>
				</svg>
			</div>

			<div class="constellation-panel">
				<div class="panel-detail" aria-live="polite">
					<p class="panel-group">{{ active.group }}</p>
					<transition name="fade" mode="out-in">
						<div class="panel-copy" :key="active.name">
							<h3 class="panel-name">{{ active.name }}</h3>
							<p class="panel-star">{{ active.star }} · {{ active.constellation }}</p>
							<p class="panel-note">{{ active.note }}</p>
						</div>
					</transition>
				</div>

				<div class="chip-group" v-for="item in constellations" :key="item.group">
					<p class="chip-group-name">{{ item.group }}</p>
					<ul class="chip-list">
						<li class="chip-item" v-for="skill in skillsIn(item.group)" :key="skill.name">
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
                window.scrollTo({
                    top: 0,
                    behavior: reduceMotion ? "auto" : "smooth",
                });
                return;
            }
            const next = sectionOrder[sectionOrder.indexOf(active.value) + 1];
            if (next)
                document.getElementById(next).scrollIntoView({
                    behavior: reduceMotion ? "auto" : "smooth",
                });
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
            const max =
                document.documentElement.scrollHeight - window.innerHeight;
            progress.value = max > 0 ? window.scrollY / max : 0;
            scrolled.value = window.scrollY > 20;
        };

        let sectionObserver = null;

        onMounted(() => {
            sectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting)
                            active.value = entry.target.id;
                    });
                },
                { rootMargin: "-45% 0px -50% 0px" },
            );
            document
                .querySelectorAll("[data-section]")
                .forEach((section) => sectionObserver.observe(section));

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
            romans: [
                "i",
                "ii",
                "iii",
                "iv",
                "v",
                "vi",
                "vii",
                "viii",
                "ix",
                "x",
            ],
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
    { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
);

app.directive("reveal", {
    mounted(el, binding) {
        el.classList.add("reveal");
        if (binding.value)
            el.style.setProperty("--reveal-delay", binding.value + "ms");
        revealObserver.observe(el);
    },
});

app.component("skill-constellation", SkillConstellation);
app.mount("#app");
