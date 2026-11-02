/* ------------------------------------------------------------------
   Gold starfield — twinkling stars with gentle scroll parallax
   and the occasional shooting star.
------------------------------------------------------------------ */
(function () {
	const canvas = document.getElementById("starfield");
	if (!canvas) return;

	const ctx = canvas.getContext("2d");
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const colors = ["243, 217, 139", "212, 175, 55", "248, 236, 196"];

	let width = 0;
	let height = 0;
	let stars = [];
	let shooting = null;
	let nextShot = 4000;

	function resize() {
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = width * dpr;
		canvas.height = height * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		const count = Math.round((width * height) / 4500);
		stars = Array.from({ length: count }, () => ({
			x: Math.random() * width,
			y: Math.random() * height,
			radius: Math.random() * 1.1 + 0.2,
			alpha: Math.random() * 0.7 + 0.2,
			speed: Math.random() * 0.0015 + 0.0004,
			phase: Math.random() * Math.PI * 2,
			depth: Math.random() * 0.15 + 0.02,
			color: colors[Math.floor(Math.random() * colors.length)],
		}));

		if (reduceMotion) draw(0);
	}

	function drawShootingStar(time) {
		if (!shooting && time > nextShot) {
			shooting = {
				x: Math.random() * width * 0.7 + width * 0.2,
				y: Math.random() * height * 0.4,
				life: 0,
			};
		}
		if (!shooting) return;

		shooting.life += 1;
		const progress = shooting.life / 70;
		const x = shooting.x - progress * 420;
		const y = shooting.y + progress * 200;
		const gradient = ctx.createLinearGradient(x, y, x + 120, y - 57);
		gradient.addColorStop(0, `rgba(248, 236, 196, ${1 - progress})`);
		gradient.addColorStop(1, "rgba(248, 236, 196, 0)");

		ctx.strokeStyle = gradient;
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + 120, y - 57);
		ctx.stroke();

		if (progress >= 1) {
			shooting = null;
			nextShot = time + 6000 + Math.random() * 8000;
		}
	}

	function draw(time) {
		ctx.clearRect(0, 0, width, height);
		const scroll = window.scrollY;

		for (const star of stars) {
			const twinkle = reduceMotion ? 1 : 0.55 + 0.45 * Math.sin(time * star.speed + star.phase);
			let y = (star.y - scroll * star.depth) % height;
			if (y < 0) y += height;

			ctx.beginPath();
			ctx.arc(star.x, y, star.radius, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(${star.color}, ${star.alpha * twinkle})`;
			ctx.fill();
		}

		if (!reduceMotion) {
			drawShootingStar(time);
			requestAnimationFrame(draw);
		}
	}

	resize();
	window.addEventListener("resize", resize);

	if (reduceMotion) {
		window.addEventListener("scroll", () => draw(0), { passive: true });
	} else {
		requestAnimationFrame(draw);
	}
})();
