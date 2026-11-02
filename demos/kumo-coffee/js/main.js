/* Kumo Coffee Roasters — demo interactions (vanilla JS) */
(function () {
    "use strict";

    var root = document.documentElement;
    var body = document.body;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var yen = new Intl.NumberFormat("ja-JP");

    /* ---------- Header: shrink, blur, hide on scroll down ---------- */
    var header = document.getElementById("site-header");
    var progressBar = document.querySelector(".scroll-progress-bar");
    var heroMedia = document.querySelector("[data-hero-parallax]");
    var lastY = window.scrollY;
    var ticking = false;

    function onScrollFrame() {
        var y = window.scrollY;
        var max = root.scrollHeight - window.innerHeight;

        header.classList.toggle("is-scrolled", y > 40);
        if (!body.classList.contains("menu-open")) {
            header.classList.toggle("is-hidden", y > 500 && y > lastY + 2);
            if (y < lastY - 2) header.classList.remove("is-hidden");
        }
        lastY = y;

        if (progressBar) {
            progressBar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
        }

        if (!reduceMotion) {
            if (heroMedia && y < window.innerHeight * 1.2) {
                heroMedia.style.transform = "translate3d(0," + (y * 0.3).toFixed(1) + "px,0)";
            }
            updateParallax();
        }
        ticking = false;
    }

    window.addEventListener("scroll", function () {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(onScrollFrame);
        }
    }, { passive: true });

    /* ---------- Parallax images ---------- */
    var parallaxItems = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));

    function updateParallax() {
        var vh = window.innerHeight;
        parallaxItems.forEach(function (img) {
            var frame = img.parentElement;
            var rect = frame.getBoundingClientRect();
            if (rect.bottom < -100 || rect.top > vh + 100) return;
            var speed = parseFloat(img.getAttribute("data-parallax")) || 0.08;
            var offset = (rect.top + rect.height / 2 - vh / 2) * speed;
            var limit = rect.height * 0.09;
            offset = Math.max(-limit, Math.min(limit, offset));
            img.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
        });
    }

    /* ---------- Mobile menu ---------- */
    var menuToggle = document.querySelector(".menu-toggle");
    var mobileMenu = document.getElementById("mobile-menu");

    function setMenu(open) {
        body.classList.toggle("menu-open", open);
        menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
        menuToggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
        mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
    }

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", function () {
            setMenu(!body.classList.contains("menu-open"));
        });
        mobileMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () { setMenu(false); });
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && body.classList.contains("menu-open")) {
                setMenu(false);
                menuToggle.focus();
            }
        });
        window.addEventListener("resize", function () {
            if (window.innerWidth > 767 && body.classList.contains("menu-open")) setMenu(false);
        });
    }

    /* ---------- Count-up numbers ---------- */
    function countUp(el) {
        var target = parseInt(el.getAttribute("data-count"), 10);
        if (reduceMotion || isNaN(target)) {
            el.textContent = target;
            return;
        }
        var duration = 1800;
        var start = null;
        el.textContent = "0";
        function step(ts) {
            if (start === null) start = ts;
            var p = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 4);
            el.textContent = Math.round(target * eased);
            if (p < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }

    /* ---------- Scroll reveal with stagger ---------- */
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
        group.querySelectorAll("[data-reveal]").forEach(function (item, i) {
            item.style.setProperty("--delay", (i * 0.12) + "s");
        });
    });

    var revealItems = document.querySelectorAll("[data-reveal]");

    function reveal(el) {
        el.classList.add("is-visible");
        el.querySelectorAll("[data-count]").forEach(countUp);
    }

    if ("IntersectionObserver" in window && !reduceMotion) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    reveal(entry.target);
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
        revealItems.forEach(function (el) { io.observe(el); });
    } else {
        revealItems.forEach(reveal);
    }

    /* ---------- Magnetic buttons ---------- */
    if (finePointer && !reduceMotion) {
        document.querySelectorAll(".magnetic").forEach(function (btn) {
            var label = btn.querySelector(".button-label");
            btn.addEventListener("pointermove", function (e) {
                var r = btn.getBoundingClientRect();
                var x = e.clientX - (r.left + r.width / 2);
                var y = e.clientY - (r.top + r.height / 2);
                btn.style.transform = "translate3d(" + (x * 0.25).toFixed(1) + "px," + (y * 0.35).toFixed(1) + "px,0)";
                if (label) label.style.transform = "translate3d(" + (x * 0.1).toFixed(1) + "px," + (y * 0.12).toFixed(1) + "px,0)";
            });
            btn.addEventListener("pointerleave", function () {
                btn.style.transform = "";
                if (label) label.style.transform = "";
            });
        });
    }

    /* ---------- Add to cart ---------- */
    var cartButton = document.querySelector(".cart-button");
    var cartCount = document.querySelector(".cart-count");
    var toast = document.querySelector(".toast");
    var toastText = toast ? toast.querySelector(".toast-text") : null;
    var toastTimer = null;
    var cartTotal = 0;

    function showToast(message) {
        if (!toast) return;
        toastText.textContent = message;
        toast.classList.add("is-visible");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(function () {
            toast.classList.remove("is-visible");
        }, 2600);
    }

    function bumpCart() {
        cartTotal += 1;
        cartCount.textContent = cartTotal;
        cartButton.setAttribute("aria-label", "カート（" + cartTotal + "点）");
        cartButton.classList.remove("is-bump");
        void cartButton.offsetWidth;
        cartButton.classList.add("is-bump");
    }

    function flyToCart(from, done) {
        if (reduceMotion || !from.animate) {
            done();
            return;
        }
        header.classList.remove("is-hidden");
        var a = from.getBoundingClientRect();
        var b = cartCount.getBoundingClientRect();
        var x0 = a.left + a.width / 2;
        var y0 = a.top + a.height / 2;
        var x1 = b.left + b.width / 2;
        var y1 = b.top + b.height / 2;
        var peak = Math.min(y0, y1) - 120;
        var dot = document.createElement("span");
        dot.className = "fly-dot";
        body.appendChild(dot);
        var anim = dot.animate([
            { transform: "translate3d(" + x0 + "px," + y0 + "px,0) scale(1)", opacity: 1 },
            { transform: "translate3d(" + (x0 + (x1 - x0) * 0.5) + "px," + peak + "px,0) scale(1.3)", opacity: 1, offset: 0.45 },
            { transform: "translate3d(" + x1 + "px," + y1 + "px,0) scale(0.4)", opacity: 0.6 }
        ], { duration: 850, easing: "cubic-bezier(0.5, 0, 0.3, 1)" });
        anim.onfinish = function () {
            dot.remove();
            done();
        };
    }

    document.querySelectorAll(".add-button").forEach(function (btn) {
        var resetTimer = null;
        btn.addEventListener("click", function () {
            var name = btn.getAttribute("data-product");
            btn.classList.add("is-added");
            window.clearTimeout(resetTimer);
            resetTimer = window.setTimeout(function () {
                btn.classList.remove("is-added");
            }, 1800);
            flyToCart(btn, function () {
                bumpCart();
                showToast("「" + name + "」をカートに追加しました");
            });
        });
    });

    /* ---------- Subscription plan builder ---------- */
    var plan = { frequency: 2, bags: 2 };
    var pricePerBag = 2160;
    var priceEl = document.querySelector("[data-plan-price]");
    var monthEl = document.querySelector("[data-plan-month]");
    var shownPrice = pricePerBag * plan.bags;

    function tweenNumber(el, from, to, duration) {
        if (reduceMotion) {
            el.textContent = yen.format(to);
            return;
        }
        var start = null;
        function step(ts) {
            if (start === null) start = ts;
            var p = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = yen.format(Math.round(from + (to - from) * eased));
            if (p < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }

    function updatePlan() {
        var perDelivery = pricePerBag * plan.bags;
        var perMonth = perDelivery * plan.frequency;
        tweenNumber(priceEl, shownPrice, perDelivery, 600);
        shownPrice = perDelivery;
        monthEl.textContent = yen.format(perMonth);
        priceEl.classList.remove("is-changing");
        void priceEl.offsetWidth;
        priceEl.classList.add("is-changing");
    }

    document.querySelectorAll("[data-plan]").forEach(function (group) {
        var key = group.getAttribute("data-plan");
        group.querySelectorAll(".chip").forEach(function (chip) {
            chip.addEventListener("click", function () {
                group.querySelectorAll(".chip").forEach(function (c) {
                    c.classList.remove("is-active");
                    c.setAttribute("aria-pressed", "false");
                });
                chip.classList.add("is-active");
                chip.setAttribute("aria-pressed", "true");
                plan[key] = parseInt(chip.getAttribute("data-value"), 10);
                updatePlan();
            });
        });
    });

    /* ---------- Café open / closed (Tokyo time) ---------- */
    var status = document.querySelector("[data-open-status]");
    if (status) {
        try {
            var parts = new Intl.DateTimeFormat("en-US", {
                timeZone: "Asia/Tokyo",
                weekday: "short",
                hour: "numeric",
                minute: "numeric",
                hourCycle: "h23"
            }).formatToParts(new Date());
            var get = function (type) {
                var p = parts.filter(function (x) { return x.type === type; })[0];
                return p ? p.value : "";
            };
            var day = get("weekday");
            var minutes = parseInt(get("hour"), 10) * 60 + parseInt(get("minute"), 10);
            var isOpen = day !== "Tue" && minutes >= 480 && minutes < 1080;
            var text = status.querySelector(".open-status-text");
            if (isOpen) {
                status.classList.add("is-open");
                text.textContent = "ただいま営業中・18:00まで";
            } else {
                status.classList.add("is-closed");
                text.textContent = day === "Tue" ? "本日は焙煎日のため定休日です" : "営業時間外・8:00 オープン";
            }
        } catch (err) {
            /* keep default text */
        }
    }

    /* ---------- Testimonial carousel (Swiper coverflow) ---------- */
    if (window.Swiper && document.querySelector(".voices-swiper")) {
        var voices = new window.Swiper(".voices-swiper", {
            effect: "coverflow",
            coverflowEffect: { scale: 0.88, rotate: 0, slideShadows: false },
            centeredSlides: true,
            slidesPerView: "auto",
            loop: true,
            speed: reduceMotion ? 0 : 800,
            grabCursor: true,
            autoplay: reduceMotion ? false : { delay: 5200, disableOnInteraction: false, pauseOnMouseEnter: true },
            pagination: { el: ".voices-pagination", clickable: true },
            navigation: { nextEl: ".voices-next", prevEl: ".voices-prev" },
            a11y: { prevSlideMessage: "前の声へ", nextSlideMessage: "次の声へ" }
        });
        window.addEventListener("load", function () { voices.update(); });
    }

    /* ---------- Newsletter ---------- */
    var form = document.querySelector("[data-newsletter]");
    if (form) {
        var message = document.querySelector("[data-newsletter-message]");
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var input = form.querySelector("input");
            var value = input.value.trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                message.textContent = "メールアドレスを正しく入力してください。";
                input.focus();
                return;
            }
            message.textContent = "ご登録ありがとうございます。¥500 OFFクーポンを " + value + " にお送りしました。";
            form.reset();
        });
    }

    /* ---------- Footer year ---------- */
    var yearEl = document.querySelector("[data-year]");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    onScrollFrame();
})();
