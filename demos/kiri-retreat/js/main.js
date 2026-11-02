/* =========================================================
   Kiri Retreat — demo interactions (vanilla JS)
   ========================================================= */
(function () {
    "use strict";

    var root = document.documentElement;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var mobileQuery = window.matchMedia("(max-width: 767px)");

    function clamp(v, min, max) {
        return Math.min(max, Math.max(min, v));
    }

    /* ---------- Loader ---------- */
    function finishLoading() {
        if (root.classList.contains("is-loaded")) return;
        root.classList.add("is-loaded");
    }
    window.setTimeout(finishLoading, reduceMotion ? 0 : 1500);

    /* ---------- Split hero title into characters ---------- */
    var charIndex = 0;
    document.querySelectorAll("[data-split]").forEach(function (el) {
        var words = el.textContent.trim().split(/\s+/);
        el.textContent = "";
        el.setAttribute("aria-label", words.join(" "));
        words.forEach(function (word, wi) {
            var wordSpan = document.createElement("span");
            wordSpan.className = "word";
            wordSpan.setAttribute("aria-hidden", "true");
            Array.prototype.forEach.call(word, function (ch) {
                var c = document.createElement("span");
                c.className = "char";
                c.textContent = ch;
                c.style.setProperty("--i", charIndex++);
                wordSpan.appendChild(c);
            });
            el.appendChild(wordSpan);
            if (wi < words.length - 1) el.appendChild(document.createTextNode(" "));
        });
    });

    /* ---------- Split intro statement into words ---------- */
    var statement = document.querySelector("[data-words]");
    var statementWords = [];
    if (statement) {
        var parts = statement.textContent.trim().split(/\s+/);
        statement.textContent = "";
        parts.forEach(function (p, i) {
            var s = document.createElement("span");
            s.className = "w";
            s.textContent = p;
            statement.appendChild(s);
            if (i < parts.length - 1) statement.appendChild(document.createTextNode(" "));
            statementWords.push(s);
        });
    }

    /* ---------- Header ---------- */
    var header = document.querySelector(".site-header");
    var lastY = window.scrollY;

    function updateHeader(y) {
        header.classList.toggle("is-scrolled", y > 40);
        if (!root.classList.contains("menu-open")) {
            var goingDown = y > lastY + 4;
            var goingUp = y < lastY - 4;
            if (goingDown && y > window.innerHeight * 0.8) header.classList.add("is-hidden");
            if (goingUp || y < 200) header.classList.remove("is-hidden");
        }
        lastY = y;
    }

    /* ---------- Mobile menu ---------- */
    var toggle = document.querySelector(".menu-toggle");
    var mobileMenu = document.getElementById("mobile-menu");

    function setMenu(open) {
        root.classList.toggle("menu-open", open);
        document.body.classList.toggle("is-locked", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        mobileMenu.setAttribute("aria-hidden", String(!open));
    }

    toggle.addEventListener("click", function () {
        setMenu(!root.classList.contains("menu-open"));
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
            setMenu(false);
        });
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && root.classList.contains("menu-open")) setMenu(false);
    });
    mobileQuery.addEventListener("change", function (e) {
        if (!e.matches) setMenu(false);
    });

    /* ---------- Scroll reveals (staggered) ---------- */
    var revealEls = document.querySelectorAll(".reveal, .clip-reveal");

    document.querySelectorAll(".reveal").forEach(function (el) {
        var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
            return c.classList.contains("reveal");
        });
        var idx = siblings.indexOf(el);
        if (idx > 0) el.style.setProperty("--delay", Math.min(idx * 0.1, 0.7) + "s");
    });

    function countUp(el) {
        var target = parseInt(el.getAttribute("data-count"), 10);
        if (reduceMotion) return;
        var start = null;
        var duration = 2000;
        function step(ts) {
            if (start === null) start = ts;
            var p = clamp((ts - start) / duration, 0, 1);
            var eased = 1 - Math.pow(1 - p, 4);
            el.textContent = Math.round(target * eased).toLocaleString("en-US");
            if (p < 1) window.requestAnimationFrame(step);
        }
        el.textContent = "0";
        window.requestAnimationFrame(step);
    }

    if ("IntersectionObserver" in window && !reduceMotion) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                entry.target.querySelectorAll("[data-count]").forEach(countUp);
                io.unobserve(entry.target);
            });
        }, { rootMargin: "0px 0px -12% 0px", threshold: 0.01 });
        revealEls.forEach(function (el) {
            io.observe(el);
        });
    } else {
        revealEls.forEach(function (el) {
            el.classList.add("is-visible");
        });
    }

    /* ---------- Seasons tabs ---------- */
    var tabs = Array.prototype.slice.call(document.querySelectorAll(".season-tab"));
    var panels = Array.prototype.slice.call(document.querySelectorAll(".season-panel"));
    var tabList = document.querySelector(".season-tabs");
    var seasonDuration = 7000;
    var seasonTimer = null;
    var seasonIndex = 0;
    var seasonsInView = false;
    var autoplay = !reduceMotion;

    panels.forEach(function (p) {
        p.hidden = false;
        p.setAttribute("aria-hidden", p.classList.contains("is-active") ? "false" : "true");
    });

    function showSeason(i, focus) {
        seasonIndex = (i + tabs.length) % tabs.length;
        tabs.forEach(function (t, ti) {
            var on = ti === seasonIndex;
            t.classList.toggle("is-active", on);
            t.setAttribute("aria-selected", String(on));
            t.tabIndex = on ? 0 : -1;
        });
        panels.forEach(function (p, pi) {
            var on = pi === seasonIndex;
            p.classList.toggle("is-active", on);
            p.setAttribute("aria-hidden", String(!on));
        });
        if (focus) tabs[seasonIndex].focus();
        scheduleSeason();
    }

    function scheduleSeason() {
        window.clearTimeout(seasonTimer);
        if (!autoplay || !seasonsInView) return;
        seasonTimer = window.setTimeout(function () {
            showSeason(seasonIndex + 1);
        }, seasonDuration);
    }

    function stopAutoplay() {
        autoplay = false;
        window.clearTimeout(seasonTimer);
        tabList.classList.add("is-paused");
    }

    if (tabList) {
        tabList.style.setProperty("--season-duration", seasonDuration / 1000 + "s");
        if (!autoplay) tabList.classList.add("is-paused");

        tabs.forEach(function (tab, i) {
            tab.addEventListener("click", function () {
                stopAutoplay();
                showSeason(i);
            });
            tab.addEventListener("keydown", function (e) {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    stopAutoplay();
                    showSeason(seasonIndex + (e.key === "ArrowRight" ? 1 : -1), true);
                }
            });
        });

        if ("IntersectionObserver" in window) {
            new IntersectionObserver(function (entries) {
                seasonsInView = entries[0].isIntersecting;
                if (seasonsInView) {
                    // restart the active progress bar so it matches the timer
                    var active = tabs[seasonIndex];
                    active.classList.remove("is-active");
                    void active.offsetWidth;
                    active.classList.add("is-active");
                    scheduleSeason();
                } else {
                    window.clearTimeout(seasonTimer);
                }
            }, { threshold: 0.35 }).observe(document.querySelector(".season-stage"));
        }
    }

    /* ---------- Scroll-driven effects ---------- */
    var hero = document.querySelector(".hero");
    var heroLayers = Array.prototype.slice.call(document.querySelectorAll(".hero [data-parallax]"));
    var innerParallax = Array.prototype.slice.call(document.querySelectorAll("[data-parallax-inner]"));
    var bookingMedia = document.querySelector("[data-parallax-section]");
    var unveil = document.querySelector("[data-unveil]");
    var gallery = document.querySelector(".gallery");
    var galleryTrack = document.querySelector(".gallery-track");
    var galleryDistance = 0;

    function measureGallery() {
        if (!gallery || !galleryTrack) return;
        if (mobileQuery.matches || reduceMotion) {
            gallery.style.height = "";
            galleryTrack.style.transform = "";
            galleryDistance = 0;
            return;
        }
        galleryDistance = Math.max(0, galleryTrack.scrollWidth - window.innerWidth);
        gallery.style.height = window.innerHeight + galleryDistance + "px";
    }

    function updateEffects() {
        var y = window.scrollY;
        var vh = window.innerHeight;

        updateHeader(y);

        if (reduceMotion) return;

        // Hero layered parallax
        if (y < vh * 1.3) {
            heroLayers.forEach(function (el) {
                var speed = parseFloat(el.getAttribute("data-parallax")) || 0;
                el.style.transform = "translate3d(0," + (y * speed).toFixed(1) + "px,0)";
            });
        }

        // Inner image parallax
        innerParallax.forEach(function (img) {
            var r = img.parentElement.getBoundingClientRect();
            if (r.bottom < -100 || r.top > vh + 100) return;
            var speed = parseFloat(img.getAttribute("data-parallax-inner")) || 0;
            var offset = (r.top + r.height / 2 - vh / 2) * -speed;
            img.style.translate = "0 " + offset.toFixed(1) + "px";
        });

        // Booking background
        if (bookingMedia) {
            var br = bookingMedia.parentElement.getBoundingClientRect();
            if (br.bottom > 0 && br.top < vh) {
                var bo = (br.top + br.height / 2 - vh / 2) * -0.18;
                bookingMedia.style.transform = "translate3d(0," + bo.toFixed(1) + "px,0)";
            }
        }

        // Onsen unveil (clip-path opens as it scrolls in)
        if (unveil) {
            var ur = unveil.getBoundingClientRect();
            var up = clamp((vh - ur.top) / (vh * 0.95), 0, 1);
            var eased = 1 - Math.pow(1 - up, 3);
            unveil.style.setProperty("--unveil", (1 - eased).toFixed(4));
        }

        // Intro words light up as you read
        if (statement && statementWords.length) {
            var sr = statement.getBoundingClientRect();
            var start = vh * 0.85;
            var end = vh * 0.35;
            var sp = clamp((start - sr.top) / (start - end + sr.height * 0.6), 0, 1);
            var lit = Math.round(sp * statementWords.length);
            statementWords.forEach(function (w, i) {
                w.classList.toggle("is-lit", i < lit);
            });
        }

        // Pinned horizontal gallery
        if (galleryDistance > 0) {
            var gr = gallery.getBoundingClientRect();
            var gp = clamp(-gr.top / (gr.height - vh), 0, 1);
            galleryTrack.style.transform = "translate3d(" + (-gp * galleryDistance).toFixed(1) + "px,0,0)";
        }
    }

    if (reduceMotion) {
        if (unveil) unveil.style.setProperty("--unveil", "0");
        statementWords.forEach(function (w) {
            w.classList.add("is-lit");
        });
    }

    var ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
            updateEffects();
            ticking = false;
        });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
        measureGallery();
        onScroll();
    });
    window.addEventListener("load", function () {
        measureGallery();
        updateEffects();
    });
    measureGallery();
    updateEffects();

    /* ---------- Booking widget (demo only) ---------- */
    var form = document.querySelector(".booking-form");
    if (form) {
        var checkin = form.elements.checkin;
        var checkout = form.elements.checkout;
        var roomSelect = form.elements.room;
        var guestsOut = form.querySelector(".stepper-value");
        var stepBtns = form.querySelectorAll(".stepper-btn");
        var totalEl = form.querySelector(".form-total-value");
        var message = form.querySelector(".form-message");
        var guests = 2;

        function iso(d) {
            var m = String(d.getMonth() + 1).padStart(2, "0");
            var day = String(d.getDate()).padStart(2, "0");
            return d.getFullYear() + "-" + m + "-" + day;
        }

        var today = new Date();
        var inDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);
        var outDate = new Date(inDate.getFullYear(), inDate.getMonth(), inDate.getDate() + 2);
        checkin.min = iso(today);
        checkin.value = iso(inDate);
        checkout.min = iso(new Date(inDate.getTime() + 864e5));
        checkout.value = iso(outDate);

        function nights() {
            var a = new Date(checkin.value);
            var b = new Date(checkout.value);
            var n = Math.round((b - a) / 864e5);
            return isNaN(n) ? 0 : n;
        }

        function maxGuests() {
            return roomSelect.value === "168000" ? 4 : roomSelect.value === "98000" ? 3 : 2;
        }

        function renderGuests() {
            guests = clamp(guests, 1, maxGuests());
            guestsOut.textContent = guests;
            stepBtns[0].disabled = guests <= 1;
            stepBtns[1].disabled = guests >= maxGuests();
        }

        function renderTotal() {
            var n = nights();
            if (n < 1) {
                totalEl.textContent = "—";
                return;
            }
            var total = n * parseInt(roomSelect.value, 10);
            totalEl.textContent = "¥" + total.toLocaleString("en-US") + " · " + n + (n === 1 ? " night" : " nights");
        }

        stepBtns.forEach(function (btn) {
            btn.addEventListener("click", function () {
                guests += parseInt(btn.getAttribute("data-step"), 10);
                renderGuests();
            });
        });

        checkin.addEventListener("change", function () {
            if (!checkin.value) return;
            var next = new Date(new Date(checkin.value).getTime() + 864e5);
            checkout.min = iso(next);
            if (nights() < 1) checkout.value = iso(next);
            renderTotal();
        });
        checkout.addEventListener("change", renderTotal);
        roomSelect.addEventListener("change", function () {
            renderGuests();
            renderTotal();
        });

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var n = nights();
            message.classList.remove("is-error");
            if (n < 1) {
                message.textContent = "Please choose a check-out date after your check-in date.";
                message.classList.add("is-error");
            } else {
                var roomName = roomSelect.options[roomSelect.selectedIndex].text.split(" · ")[0];
                message.textContent = "Good news: the " + roomName + " is available for " + n + (n === 1 ? " night" : " nights") + " for " + guests + (guests === 1 ? " guest" : " guests") + ". (This is a demo, so no booking was made.)";
            }
            message.classList.add("is-shown");
        });

        renderGuests();
        renderTotal();
    }
})();
