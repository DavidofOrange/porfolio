/* Arcline Careers — demo by David Childerhose (vanilla JS) */
(function () {
    "use strict";

    var doc = document.documentElement;
    doc.classList.add("js");

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    /* ---------- Hero: split letters ---------- */
    var charIndex = 0;
    document.querySelectorAll("[data-split]").forEach(function (el) {
        var text = el.textContent;
        el.setAttribute("aria-label", text);
        el.textContent = "";
        Array.prototype.forEach.call(text, function (ch) {
            var span = document.createElement("span");
            span.className = "char";
            span.setAttribute("aria-hidden", "true");
            span.textContent = ch === " " ? " " : ch;
            span.style.setProperty("--i", charIndex++);
            el.appendChild(span);
        });
    });

    /* ---------- Hero: rotating words ---------- */
    var rotator = document.querySelector(".hero-rotator");
    if (rotator) {
        var words = rotator.querySelectorAll(".rotator-word");
        var current = 0;
        var fitWidth = function () {
            rotator.style.width = words[current].offsetWidth + "px";
        };
        fitWidth();
        window.addEventListener("resize", fitWidth);
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(fitWidth);
        }

        if (!reduceMotion && words.length > 1) {
            setInterval(function () {
                var prev = words[current];
                current = (current + 1) % words.length;
                var next = words[current];
                prev.classList.remove("is-active");
                prev.classList.add("is-leaving");
                next.classList.add("is-active");
                fitWidth();
                setTimeout(function () {
                    prev.classList.remove("is-leaving");
                }, 800);
            }, 2600);
        }
    }

    /* ---------- Hero: live "routed today" ticker ---------- */
    var liveCount = document.querySelector("[data-live-count]");
    if (liveCount && !reduceMotion) {
        var liveValue = parseInt(liveCount.getAttribute("data-live-count"), 10) || 0;
        setInterval(function () {
            if (document.hidden) {
                return;
            }
            liveValue += 3 + Math.floor(Math.random() * 14);
            liveCount.textContent = liveValue.toLocaleString("en-US");
        }, 1400);
    }

    /* ---------- Header: hide on scroll down, show on scroll up + progress ---------- */
    var header = document.getElementById("site-header");
    var progressBar = document.querySelector(".scroll-progress-bar");
    var lastY = window.scrollY;
    var ticking = false;

    var parallaxItems = document.querySelectorAll("[data-speed]");
    var timeline = document.querySelector(".timeline");
    var timelineFill = document.querySelector(".timeline-line-fill");

    function onScroll() {
        var y = window.scrollY;
        var max = document.documentElement.scrollHeight - window.innerHeight;

        if (progressBar) {
            progressBar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
        }

        if (header && !document.body.classList.contains("menu-open")) {
            header.classList.toggle("is-scrolled", y > 40);
            if (y > lastY && y > 240) {
                header.classList.add("is-hidden");
            } else if (y < lastY) {
                header.classList.remove("is-hidden");
            }
        }
        lastY = y;

        if (!reduceMotion) {
            parallaxItems.forEach(function (el) {
                var speed = parseFloat(el.getAttribute("data-speed")) || 0;
                el.style.transform = "translate3d(0," + (y * speed * -1) + "px,0)";
            });
        }

        if (timeline && timelineFill) {
            var rect = timeline.getBoundingClientRect();
            var start = window.innerHeight * 0.6;
            var ratio = (start - rect.top) / rect.height;
            ratio = Math.max(0, Math.min(1, ratio));
            timelineFill.style.transform = "scaleY(" + ratio + ")";
        }

        ticking = false;
    }

    window.addEventListener("scroll", function () {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });
    onScroll();

    /* ---------- Mobile menu ---------- */
    var menuToggle = document.querySelector(".menu-toggle");
    var mobileMenu = document.getElementById("mobile-menu");

    function setMenu(open) {
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        mobileMenu.classList.toggle("is-open", open);
        mobileMenu.setAttribute("aria-hidden", String(!open));
        document.body.classList.toggle("menu-open", open);
    }

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", function () {
            setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
        });
        mobileMenu.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () {
                setMenu(false);
            });
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
                setMenu(false);
                menuToggle.focus();
            }
        });
        window.addEventListener("resize", function () {
            if (window.innerWidth > 1023 && mobileMenu.classList.contains("is-open")) {
                setMenu(false);
            }
        });
    }

    /* ---------- Staggered reveals ---------- */
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
        Array.prototype.forEach.call(group.children, function (child, i) {
            child.style.setProperty("--d", (i * 0.09).toFixed(2) + "s");
        });
    });

    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && !reduceMotion) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    el.classList.add("is-visible");
                    revealObserver.unobserve(el);
                    // Drop the stagger delay afterwards so hover transitions feel instant
                    setTimeout(function () {
                        el.style.removeProperty("--d");
                    }, 1800);
                }
            });
        }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
        revealEls.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        revealEls.forEach(function (el) {
            el.classList.add("is-visible");
        });
    }

    /* ---------- Count-up stats ---------- */
    var counters = document.querySelectorAll(".count");

    function formatNumber(value, decimals) {
        return value.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    function runCount(el) {
        var target = parseFloat(el.getAttribute("data-target"));
        var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
        if (reduceMotion) {
            el.textContent = formatNumber(target, decimals);
            return;
        }
        var duration = 2000;
        var startTime = null;
        function step(ts) {
            if (startTime === null) {
                startTime = ts;
            }
            var p = Math.min((ts - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 4);
            el.textContent = formatNumber(target * eased, decimals);
            if (p < 1) {
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    }

    if ("IntersectionObserver" in window) {
        var countObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    runCount(entry.target);
                    countObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        counters.forEach(function (el) {
            countObserver.observe(el);
        });
    } else {
        counters.forEach(runCount);
    }

    /* ---------- Hero spotlight follows the cursor ---------- */
    var hero = document.getElementById("hero");
    var spotlight = document.querySelector(".hero-spotlight");
    if (hero && spotlight && finePointer && !reduceMotion) {
        var tx = window.innerWidth * 0.7;
        var ty = window.innerHeight * 0.3;
        var cx = tx;
        var cy = ty;
        var spotRunning = false;

        var animateSpot = function () {
            cx += (tx - cx) * 0.12;
            cy += (ty - cy) * 0.12;
            spotlight.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
            if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
                window.requestAnimationFrame(animateSpot);
            } else {
                spotRunning = false;
            }
        };

        hero.addEventListener("mousemove", function (e) {
            var rect = hero.getBoundingClientRect();
            tx = e.clientX - rect.left;
            ty = e.clientY - rect.top;
            if (!spotRunning) {
                spotRunning = true;
                window.requestAnimationFrame(animateSpot);
            }
        });
    }

    /* ---------- Magnetic buttons ---------- */
    if (finePointer && !reduceMotion) {
        document.querySelectorAll(".magnetic").forEach(function (btn) {
            var label = btn.querySelector(".magnetic-label");
            btn.addEventListener("mousemove", function (e) {
                var rect = btn.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = "translate(" + x * 0.3 + "px," + y * 0.4 + "px)";
                if (label) {
                    label.style.transform = "translate(" + x * 0.12 + "px," + y * 0.15 + "px)";
                }
            });
            btn.addEventListener("mouseleave", function () {
                btn.style.transform = "";
                if (label) {
                    label.style.transform = "";
                }
            });
        });
    }

    /* ---------- Voices slider (Swiper coverflow) ---------- */
    if (window.Swiper) {
        new window.Swiper(".voices-slider", {
            effect: "coverflow",
            coverflowEffect: { scale: 0.88, rotate: 0, depth: 0, stretch: 0, modifier: 1, slideShadows: false },
            centeredSlides: true,
            slidesPerView: "auto",
            spaceBetween: 0,
            initialSlide: 1,
            speed: 800,
            grabCursor: true,
            keyboard: { enabled: true },
            navigation: { prevEl: ".voices-prev", nextEl: ".voices-next" },
            pagination: { el: ".voices-pagination", clickable: true }
        });
    }

    /* ---------- Job filters ---------- */
    var tabs = document.querySelectorAll(".filter-tab");
    var jobs = Array.prototype.slice.call(document.querySelectorAll(".job-item"));
    var jobsCountNum = document.querySelector(".jobs-count-num");
    var filtering = false;

    function applyFilter(filter) {
        var matches = jobs.filter(function (job) {
            return filter === "all" || job.getAttribute("data-team") === filter;
        });
        var visible = jobs.filter(function (job) {
            return !job.hidden;
        });

        if (jobsCountNum) {
            jobsCountNum.textContent = matches.length;
        }

        if (reduceMotion) {
            jobs.forEach(function (job) {
                job.hidden = matches.indexOf(job) === -1;
            });
            return;
        }

        filtering = true;
        visible.forEach(function (job, i) {
            job.style.transitionDelay = (i * 0.03) + "s";
            job.classList.add("is-leaving");
        });

        setTimeout(function () {
            jobs.forEach(function (job) {
                job.classList.remove("is-leaving");
                job.style.transitionDelay = "";
                var show = matches.indexOf(job) !== -1;
                job.hidden = !show;
                if (show) {
                    job.classList.add("is-entering");
                }
            });
            // Force reflow so the entering state is painted before animating in
            void document.body.offsetHeight;
            matches.forEach(function (job, i) {
                job.style.transitionDelay = (i * 0.07) + "s";
                job.classList.remove("is-entering");
            });
            setTimeout(function () {
                matches.forEach(function (job) {
                    job.style.transitionDelay = "";
                });
                filtering = false;
            }, 400 + matches.length * 70);
        }, 380 + visible.length * 30);
    }

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            if (filtering || tab.classList.contains("is-active")) {
                return;
            }
            tabs.forEach(function (t) {
                t.classList.remove("is-active");
                t.setAttribute("aria-pressed", "false");
            });
            tab.classList.add("is-active");
            tab.setAttribute("aria-pressed", "true");
            revealTab(tab);
            applyFilter(tab.getAttribute("data-filter"));
        });
    });

    /* On phones the filter row scrolls sideways: keep the chosen tab in view
       and drop the edge fade once the end of the row is reached */
    var filterRow = document.querySelector(".job-filters");

    function revealTab(tab) {
        if (!filterRow || filterRow.scrollWidth <= filterRow.clientWidth) {
            return;
        }
        var rowRect = filterRow.getBoundingClientRect();
        var tabRect = tab.getBoundingClientRect();
        var pad = 20;
        var delta = 0;
        if (tabRect.right > rowRect.right - pad * 2) {
            delta = tabRect.right - rowRect.right + pad * 2;
        } else if (tabRect.left < rowRect.left + pad) {
            delta = tabRect.left - rowRect.left - pad;
        }
        if (delta !== 0) {
            filterRow.scrollBy({ left: delta, behavior: reduceMotion ? "auto" : "smooth" });
        }
    }

    function updateFilterFade() {
        if (!filterRow) {
            return;
        }
        var atEnd = filterRow.scrollLeft + filterRow.clientWidth >= filterRow.scrollWidth - 4;
        filterRow.classList.toggle("is-scrolled-end", atEnd);
    }

    if (filterRow) {
        filterRow.addEventListener("scroll", updateFilterFade, { passive: true });
        window.addEventListener("resize", updateFilterFade);
        updateFilterFade();
    }

    /* ---------- FAQ accordion (smooth height) ---------- */
    document.querySelectorAll(".faq-item").forEach(function (item) {
        var btn = item.querySelector(".faq-toggle");
        var panel = item.querySelector(".faq-a");
        if (!btn || !panel) {
            return;
        }

        btn.addEventListener("click", function () {
            var open = btn.getAttribute("aria-expanded") === "true";
            btn.setAttribute("aria-expanded", String(!open));
            item.classList.toggle("is-open", !open);

            if (!open) {
                panel.style.height = panel.scrollHeight + "px";
                var onEnd = function (e) {
                    if (e.propertyName === "height" && btn.getAttribute("aria-expanded") === "true") {
                        panel.style.height = "auto";
                    }
                    panel.removeEventListener("transitionend", onEnd);
                };
                panel.addEventListener("transitionend", onEnd);
            } else {
                panel.style.height = panel.scrollHeight + "px";
                void panel.offsetHeight;
                panel.style.height = "0px";
            }
        });
    });
})();
