/* Maple Guitars — demo interactions (vanilla JS) */
(function () {
    "use strict";

    var root = document.documentElement;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var isMobile = function () {
        return window.innerWidth <= 1023;
    };
    var lerp = function (a, b, t) {
        return a + (b - a) * t;
    };
    var clamp = function (v, min, max) {
        return Math.min(max, Math.max(min, v));
    };

    root.setAttribute("data-finish", "honey");

    /* ---------------------------------------------------------
       Finish data
       --------------------------------------------------------- */
    var FINISHES = {
        honey: {
            index: "01",
            name: "Honey Flame",
            desc: "A clear amber that lets AAAAA flame do the talking. Under a lamp the stripes roll like light across a glass of whisky.",
            figure: "Flame, 2-piece bookmatch",
            grade: "AAAAA, 3.2 mm stripe",
            origin: "Bigleaf maple, Pacific Northwest"
        },
        tobacco: {
            index: "02",
            name: "Tobacco Burst",
            desc: "Hand-shaded from a warm centre into near-black edges. Smoky, vintage and quietly dramatic on a dark stage.",
            figure: "Flame, 2-piece bookmatch",
            grade: "AAAA, wide roll",
            origin: "Bigleaf maple, British Columbia"
        },
        cherry: {
            index: "03",
            name: "Cherry Quilt",
            desc: "Deep cherry over billowing quilt figure. The top looks carved into pillows of light that swell as you move.",
            figure: "Quilt, 2-piece bookmatch",
            grade: "Master grade, tight quilt",
            origin: "Bigleaf maple, Oregon"
        },
        midnight: {
            index: "04",
            name: "Midnight Blue Burst",
            desc: "Ink-blue aniline fading to black, with a flame that glints silver under cool light. Our most requested custom.",
            figure: "Flame, 2-piece bookmatch",
            grade: "AAAAA, 3 mm stripe",
            origin: "Bigleaf maple, Washington"
        }
    };

    /* ---------------------------------------------------------
       Guitar cloning (ids prefixed g1- are re-prefixed per clone)
       --------------------------------------------------------- */
    var heroGuitar = document.getElementById("hero-guitar");
    var cloneCount = 1;

    function cloneGuitar(target, finish) {
        if (!heroGuitar || !target) return null;
        cloneCount += 1;
        var html = heroGuitar.outerHTML
            .replace(/g1-/g, "g" + cloneCount + "-")
            .replace(' id="hero-guitar"', "")
            .replace(/data-finish="[a-z]+"/, 'data-finish="' + finish + '"');
        target.insertAdjacentHTML("beforeend", html);
        return target.lastElementChild;
    }

    var woodTarget = document.querySelector('[data-guitar-clone="wood"]');
    var woodGuitar = cloneGuitar(woodTarget, "honey");

    document.querySelectorAll(".model-guitar[data-guitar-clone]").forEach(function (el) {
        cloneGuitar(el, el.getAttribute("data-guitar-clone"));
    });

    /* ---------------------------------------------------------
       Intro / loader
       --------------------------------------------------------- */
    function finishIntro() {
        root.classList.add("is-loaded");
    }

    if (reduceMotion) {
        finishIntro();
    } else {
        window.setTimeout(finishIntro, 2300);
    }

    /* ---------------------------------------------------------
       Split philosophy text into words
       --------------------------------------------------------- */
    var wordsEl = document.querySelector("[data-words]");
    var words = [];
    if (wordsEl) {
        var parts = wordsEl.textContent.trim().split(/\s+/);
        wordsEl.textContent = "";
        parts.forEach(function (w, i) {
            var span = document.createElement("span");
            span.className = "word";
            span.textContent = w;
            wordsEl.appendChild(span);
            if (i < parts.length - 1) wordsEl.appendChild(document.createTextNode(" "));
            words.push(span);
        });
    }

    /* ---------------------------------------------------------
       Stagger + reveal on scroll
       --------------------------------------------------------- */
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
        Array.prototype.forEach.call(group.querySelectorAll(".reveal"), function (el, i) {
            el.style.setProperty("--d", i * 0.12 + "s");
        });
    });

    var revealEls = document.querySelectorAll(".reveal, .clip-reveal");

    function countUp(el) {
        var end = parseInt(el.getAttribute("data-count"), 10);
        if (reduceMotion || isNaN(end)) return;
        var start = null;
        var dur = 1800;
        var step = function (ts) {
            if (!start) start = ts;
            var p = Math.min(1, (ts - start) / dur);
            var eased = 1 - Math.pow(1 - p, 4);
            el.textContent = Math.round(end * eased);
            if (p < 1) requestAnimationFrame(step);
        };
        el.textContent = "0";
        requestAnimationFrame(step);
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealEls.forEach(function (el) {
            el.classList.add("is-visible");
        });
    } else {
        var io = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    var num = entry.target.querySelector("[data-count]");
                    if (num) countUp(num);
                    io.unobserve(entry.target);
                });
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
        );
        revealEls.forEach(function (el) {
            io.observe(el);
        });
    }

    /* ---------------------------------------------------------
       Header: hide on scroll down, show on scroll up
       --------------------------------------------------------- */
    var header = document.querySelector(".site-header");
    var lastY = window.scrollY;

    function onHeaderScroll() {
        var y = window.scrollY;
        header.classList.toggle("is-scrolled", y > 40);
        if (!root.classList.contains("menu-open")) {
            if (y > lastY + 4 && y > 220) header.classList.add("is-hidden");
            else if (y < lastY - 4) header.classList.remove("is-hidden");
        }
        lastY = y;
    }

    /* ---------------------------------------------------------
       Mobile menu
       --------------------------------------------------------- */
    var toggle = document.querySelector(".menu-toggle");
    var menu = document.getElementById("mobile-menu");

    function setMenu(open) {
        root.classList.toggle("menu-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    if (toggle && menu) {
        toggle.addEventListener("click", function () {
            setMenu(!root.classList.contains("menu-open"));
        });
        menu.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () {
                setMenu(false);
            });
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") setMenu(false);
        });
        window.addEventListener("resize", function () {
            if (!isMobile()) setMenu(false);
        });
    }

    /* ---------------------------------------------------------
       Finish selector
       --------------------------------------------------------- */
    var swatches = document.querySelectorAll(".finish-swatch");
    var finishInfo = document.querySelector(".finish-info");
    var currentFinish = "honey";
    var infoTimer = null;

    function setFinish(finish, fromConfig) {
        if (!FINISHES[finish] || finish === currentFinish) return;
        currentFinish = finish;
        root.setAttribute("data-finish", finish);
        if (heroGuitar) heroGuitar.setAttribute("data-finish", finish);
        if (woodGuitar) woodGuitar.setAttribute("data-finish", finish);

        swatches.forEach(function (s) {
            var on = s.getAttribute("data-finish") === finish;
            s.classList.toggle("is-active", on);
            s.setAttribute("aria-checked", on ? "true" : "false");
        });

        if (finishInfo) {
            finishInfo.classList.add("is-changing");
            window.clearTimeout(infoTimer);
            infoTimer = window.setTimeout(
                function () {
                    var data = FINISHES[finish];
                    finishInfo.querySelectorAll("[data-finish-field]").forEach(function (f) {
                        f.textContent = data[f.getAttribute("data-finish-field")];
                    });
                    finishInfo.classList.remove("is-changing");
                },
                reduceMotion ? 0 : 420
            );
        }

        if (!fromConfig) {
            var radio = document.querySelector('.config input[name="finish"][data-finish="' + finish + '"]');
            if (radio) {
                radio.checked = true;
                updateTotal();
            }
        }
    }

    swatches.forEach(function (s, i) {
        s.addEventListener("click", function () {
            setFinish(s.getAttribute("data-finish"));
        });
        s.addEventListener("keydown", function (e) {
            var dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
            if (!dir) return;
            e.preventDefault();
            var next = swatches[(i + dir + swatches.length) % swatches.length];
            next.focus();
            setFinish(next.getAttribute("data-finish"));
        });
    });

    /* ---------------------------------------------------------
       Configurator total
       --------------------------------------------------------- */
    var config = document.querySelector("[data-config]");
    var totalEl = document.querySelector("[data-total]");
    var BASE = 460000; // Aurora, AAAA flame, standard spec (tax excluded)
    var shownTotal = BASE;
    var totalRaf = null;

    function formatYen(n) {
        return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function updateTotal() {
        if (!config || !totalEl) return;
        var sum = BASE;
        config.querySelectorAll("input:checked").forEach(function (input) {
            sum += parseInt(input.value, 10) || 0;
        });
        if (reduceMotion) {
            shownTotal = sum;
            totalEl.textContent = formatYen(sum);
            return;
        }
        var from = shownTotal;
        var start = null;
        cancelAnimationFrame(totalRaf);
        var step = function (ts) {
            if (!start) start = ts;
            var p = Math.min(1, (ts - start) / 900);
            var e = 1 - Math.pow(1 - p, 3);
            shownTotal = from + (sum - from) * e;
            totalEl.textContent = formatYen(Math.round(shownTotal / 1000) * 1000);
            if (p < 1) totalRaf = requestAnimationFrame(step);
        };
        totalRaf = requestAnimationFrame(step);
    }

    if (config) {
        config.addEventListener("change", function (e) {
            var t = e.target;
            if (t.name === "finish" && t.getAttribute("data-finish")) {
                setFinish(t.getAttribute("data-finish"), true);
            }
            updateTotal();
        });
    }

    /* ---------------------------------------------------------
       Testimonials
       --------------------------------------------------------- */
    var quoteWrap = document.querySelector("[data-quotes]");
    if (quoteWrap) {
        var quotes = quoteWrap.querySelectorAll(".quote");
        var dots = document.querySelectorAll(".quote-dot");
        var qIndex = 0;
        var showQuote = function (n) {
            qIndex = (n + quotes.length) % quotes.length;
            quotes.forEach(function (q, i) {
                q.classList.toggle("is-active", i === qIndex);
            });
            dots.forEach(function (d, i) {
                d.classList.toggle("is-active", i === qIndex);
                d.setAttribute("aria-selected", i === qIndex ? "true" : "false");
            });
        };
        dots.forEach(function (d, i) {
            d.addEventListener("click", function () {
                showQuote(i);
            });
            d.querySelector(".quote-dot-bar").addEventListener("animationend", function () {
                if (d.classList.contains("is-active")) showQuote(qIndex + 1);
            });
        });
    }

    /* ---------------------------------------------------------
       Commission form (front-end only)
       --------------------------------------------------------- */
    var form = document.querySelector(".commission-form");
    if (form) {
        var card = form.closest(".commission-card");
        var errorEl = form.querySelector(".form-error");
        var submit = form.querySelector(".form-submit");
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var name = form.elements.name;
            var email = form.elements.email;
            var bad = [];
            name.classList.toggle("is-invalid", !name.value.trim());
            if (!name.value.trim()) bad.push("your name");
            var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
            email.classList.toggle("is-invalid", !emailOk);
            if (!emailOk) bad.push("a valid email");
            if (bad.length) {
                errorEl.textContent = "Please add " + bad.join(" and ") + ".";
                return;
            }
            errorEl.textContent = "";
            submit.classList.add("is-loading");
            submit.querySelector(".button-label").textContent = "Sending…";
            window.setTimeout(
                function () {
                    card.classList.add("is-sent");
                },
                reduceMotion ? 0 : 1200
            );
        });
    }

    /* ---------------------------------------------------------
       Magnetic buttons
       --------------------------------------------------------- */
    if (finePointer && !reduceMotion) {
        document.querySelectorAll(".magnetic").forEach(function (btn) {
            var label = btn.querySelector(".button-label");
            btn.addEventListener("mousemove", function (e) {
                var r = btn.getBoundingClientRect();
                var x = e.clientX - (r.left + r.width / 2);
                var y = e.clientY - (r.top + r.height / 2);
                btn.style.transform = "translate(" + x * 0.28 + "px," + y * 0.38 + "px)";
                if (label) label.style.transform = "translate(" + x * 0.12 + "px," + y * 0.16 + "px)";
            });
            btn.addEventListener("mouseleave", function () {
                btn.style.transform = "";
                if (label) label.style.transform = "";
            });
        });
    }

    /* ---------------------------------------------------------
       Pointer, guitar light & tilt, scroll-linked motion
       --------------------------------------------------------- */
    var glow = document.querySelector(".cursor-glow");
    var pointer = { x: window.innerWidth * 0.7, y: window.innerHeight * 0.4, active: false };
    var glowPos = { x: pointer.x, y: pointer.y };

    window.addEventListener(
        "pointermove",
        function (e) {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            if (!pointer.active && glow && finePointer) glow.classList.add("is-on");
            pointer.active = true;
        },
        { passive: true }
    );
    document.addEventListener("mouseleave", function () {
        if (glow) glow.classList.remove("is-on");
    });

    // Each interactive guitar instance
    function makeInstance(guitar, tiltEl, maxTilt) {
        if (!guitar) return null;
        return {
            guitar: guitar,
            tilt: tiltEl,
            base: guitar.querySelector(".guitar-base"),
            spot: guitar.querySelector(".fx-spot"),
            maxTilt: maxTilt,
            rx: 0,
            ry: 0,
            sx: 140,
            sy: 820,
            sh: 0.2,
            visible: true
        };
    }

    var instances = [];
    var heroTilt = document.querySelector(".hero .guitar-tilt");
    instances.push(makeInstance(heroGuitar, heroTilt, 7));
    instances.push(makeInstance(woodGuitar, woodTarget, 5));
    document.querySelectorAll(".model-guitar .guitar").forEach(function (g) {
        instances.push(makeInstance(g, null, 0));
    });
    instances = instances.filter(Boolean);

    if ("IntersectionObserver" in window) {
        var visIO = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                instances.forEach(function (inst) {
                    if (inst.guitar === entry.target) inst.visible = entry.isIntersecting;
                });
            });
        });
        instances.forEach(function (inst) {
            visIO.observe(inst.guitar);
        });
    }

    function updateInstance(inst, scrollShift) {
        if (!inst.visible || !inst.base) return;
        var r = inst.base.getBoundingClientRect();
        if (!r.width) return;
        var cx = r.left + r.width / 2;
        var cy = r.top + r.height / 2;
        var nx = clamp((pointer.x - cx) / (window.innerWidth * 0.5), -1, 1);
        var ny = clamp((pointer.y - cy) / (window.innerHeight * 0.5), -1, 1);

        // Tilt toward the cursor
        if (inst.tilt && inst.maxTilt && finePointer) {
            inst.rx = lerp(inst.rx, -ny * inst.maxTilt * 0.7, 0.06);
            inst.ry = lerp(inst.ry, nx * inst.maxTilt, 0.06);
            inst.tilt.style.setProperty("--rx", inst.rx.toFixed(3) + "deg");
            inst.tilt.style.setProperty("--ry", inst.ry.toFixed(3) + "deg");
        }

        // Highlight follows the cursor in the guitar's own (rotated) coordinates
        if (inst.spot && inst.base.getScreenCTM) {
            var ctm = inst.base.getScreenCTM();
            var tx = 140;
            var ty = 820;
            if (ctm && pointer.active) {
                var pt = inst.base.createSVGPoint();
                pt.x = pointer.x;
                pt.y = pointer.y;
                var local = pt.matrixTransform(ctm.inverse());
                tx = clamp(local.x, 0, 420);
                ty = clamp(local.y, 560, 1100);
            }
            inst.sx = lerp(inst.sx, tx, 0.08);
            inst.sy = lerp(inst.sy, ty, 0.08);
            inst.spot.setAttribute("transform", "translate(" + inst.sx.toFixed(1) + " " + inst.sy.toFixed(1) + ")");
        }

        // Chatoyance: the inverse figure fades in as the light angle changes
        var target = 0.12 + 0.55 * Math.abs(Math.sin(nx * 1.6 + ny * 0.8 + scrollShift));
        inst.sh = lerp(inst.sh, target, 0.06);
        inst.guitar.style.setProperty("--shimmer", inst.sh.toFixed(3));
    }

    var heroSection = document.querySelector(".hero");
    var heroScroll = document.querySelector(".hero .guitar-scroll");
    var process = document.querySelector(".process");
    var processSteps = document.querySelectorAll(".process-step");
    var parallaxEls = document.querySelectorAll("[data-parallax]");

    function onScrollEffects() {
        var vh = window.innerHeight;
        var y = window.scrollY;

        // Hero guitar: rotate / scale / drift as the hero leaves
        if (heroScroll && heroSection && !reduceMotion) {
            var hp = clamp(y / heroSection.offsetHeight, 0, 1);
            heroScroll.style.setProperty("--sr", (hp * 14).toFixed(2) + "deg");
            heroScroll.style.setProperty("--ss", (1 - hp * 0.12).toFixed(3));
            heroScroll.style.setProperty("--sy", (hp * 18).toFixed(2) + "vh");
        }

        // Philosophy words light up
        if (words.length) {
            var wr = wordsEl.getBoundingClientRect();
            var wp = clamp((vh * 0.82 - wr.top) / (wr.height + vh * 0.35), 0, 1);
            var lit = Math.round(wp * words.length);
            words.forEach(function (w, i) {
                w.classList.toggle("is-lit", i < lit);
            });
        }

        // Process progress line
        if (process) {
            var pr = process.getBoundingClientRect();
            var pp = clamp((vh * 0.55 - pr.top) / pr.height, 0, 1);
            process.style.setProperty("--p", pp.toFixed(4));
            processSteps.forEach(function (step) {
                var sr = step.getBoundingClientRect();
                step.classList.toggle("is-active", sr.top + 28 < vh * 0.55);
            });
        }

        // Image parallax (clamped so the 1.14x-scaled image never shows its edge)
        if (reduceMotion) return;
        parallaxEls.forEach(function (el) {
            var r = el.getBoundingClientRect();
            if (r.bottom < 0 || r.top > vh) return;
            var speed = parseFloat(el.getAttribute("data-parallax")) || 0.06;
            var limit = r.height * 0.065;
            var offset = clamp((r.top + r.height / 2 - vh / 2) * -speed, -limit, limit);
            el.style.setProperty("--py", offset.toFixed(1) + "px");
        });
    }

    var year = document.querySelector("[data-year]");
    if (year) year.textContent = new Date().getFullYear();

    var ticking = false;
    window.addEventListener(
        "scroll",
        function () {
            onHeaderScroll();
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(function () {
                    onScrollEffects();
                    ticking = false;
                });
            }
        },
        { passive: true }
    );
    window.addEventListener("resize", onScrollEffects);
    onHeaderScroll();
    onScrollEffects();

    if (reduceMotion) {
        // Static: put the highlight in a pleasing resting place and stop.
        instances.forEach(function (inst) {
            if (inst.spot) inst.spot.setAttribute("transform", "translate(150 800)");
        });
        return;
    }

    function loop() {
        var scrollShift = window.scrollY * 0.0012;
        instances.forEach(function (inst) {
            updateInstance(inst, scrollShift);
        });
        if (glow && finePointer) {
            glowPos.x = lerp(glowPos.x, pointer.x, 0.12);
            glowPos.y = lerp(glowPos.y, pointer.y, 0.12);
            glow.style.transform = "translate3d(" + glowPos.x.toFixed(1) + "px," + glowPos.y.toFixed(1) + "px,0)";
        }
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
})();
