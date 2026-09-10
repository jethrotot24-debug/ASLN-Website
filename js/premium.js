(function () {
    const THEME_KEY = "aslnTheme";
    const HERO_KEY = "aslnHeroState";
    const PREMIUM_KEY = "aslnPremium";
    const INTERVAL_MS = 30 * 60 * 1000;

    const HERO_SCENES = [
        { src: "images/africa-bg.jpg", caption: "ASLN · Across Africa" },
        { src: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&w=1920&q=80", caption: "Savanna gold · ASLN" },
        { src: "https://images.unsplash.com/photo-1523805009345-7448845a9b73?auto=format&fit=crop&w=1920&q=80", caption: "Sunset over East Africa" },
        { src: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1920&q=80", caption: "Cape light · ASLN" },
        { src: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1920&q=80", caption: "Horizon of the continent" },
        { src: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1920&q=80", caption: "Safari light · ASLN journeys" },
        { src: "https://images.unsplash.com/photo-1484318571209-661cf29a69c3?auto=format&fit=crop&w=1920&q=80", caption: "Gold dunes · African hour" },
        { src: "https://images.unsplash.com/photo-1451332048581-1e54785bae15?auto=format&fit=crop&w=1920&q=80", caption: "North African glow · ASLN" }
    ];

    function getTheme() {
        return localStorage.getItem(THEME_KEY) || "dark";
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(THEME_KEY, theme);
        const scene = currentHeroScene();
        document.documentElement.style.setProperty("--asln-glass-bg", 'url("' + scene.src + '")');
        document.querySelectorAll(".theme-option").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.theme === theme);
        });
    }

    function currentHeroScene() {
        const now = Date.now();
        let state = null;
        try { state = JSON.parse(localStorage.getItem(HERO_KEY)); } catch { state = null; }
        if (!state || typeof state.index !== "number") {
            state = { index: 0, at: now };
        } else if (now - state.at >= INTERVAL_MS) {
            const steps = Math.floor((now - state.at) / INTERVAL_MS);
            state.index = (state.index + steps) % HERO_SCENES.length;
            state.at = state.at + steps * INTERVAL_MS;
        }
        localStorage.setItem(HERO_KEY, JSON.stringify(state));
        return HERO_SCENES[state.index % HERO_SCENES.length];
    }

    function ensureStyles() {
        if (!document.querySelector('link[href="css/premium.css"]')) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "css/premium.css";
            document.head.appendChild(link);
        }
    }

    function isPremium() {
        try { return !!JSON.parse(localStorage.getItem(PREMIUM_KEY)); }
        catch { return false; }
    }

    function injectNav() {
        document.querySelectorAll(".navbar, header nav").forEach(nav => {
            if (!nav.querySelector('a[href="premium.html"]')) {
                const a = document.createElement("a");
                a.href = "premium.html";
                a.className = "gold-link";
                a.textContent = "Premium";
                nav.appendChild(a);
            }
        });
        if (isPremium()) {
            document.querySelectorAll(".logo").forEach(logo => {
                if (!logo.querySelector(".premium-chip")) {
                    const chip = document.createElement("span");
                    chip.className = "premium-chip";
                    chip.textContent = "GOLD";
                    logo.appendChild(chip);
                }
            });
        }
    }

    function injectSettings() {
        if (document.querySelector(".asln-settings-btn")) return;
        const btn = document.createElement("button");
        btn.className = "asln-settings-btn";
        btn.type = "button";
        btn.setAttribute("aria-label", "Open settings");
        btn.textContent = "⚙";
        const panel = document.createElement("div");
        panel.className = "asln-settings-panel";
        panel.innerHTML = `
            <div class="asln-settings-sheet">
                <h2>General settings</h2>
                <p>Appearance for the ASLN website and app. Glass adds gold frost over the rotating African scenes.</p>
                <div class="theme-grid">
                    <button type="button" class="theme-option" data-theme="dark">
                        <span class="theme-swatch dark"></span>
                        <span><strong>Dark</strong><br><small>Midnight gold, cinema contrast</small></span>
                    </button>
                    <button type="button" class="theme-option" data-theme="light">
                        <span class="theme-swatch light"></span>
                        <span><strong>Light</strong><br><small>Warm ivory with antique gold</small></span>
                    </button>
                    <button type="button" class="theme-option" data-theme="glass">
                        <span class="theme-swatch glass"></span>
                        <span><strong>Glass + gold</strong><br><small>Frosted panels over ASLN scenery</small></span>
                    </button>
                </div>
                <p style="margin-top:22px"><a href="premium.html" class="hero-btn" style="display:inline-block">ASLN Premium</a></p>
                <p class="pay-note">Background photos on Home rotate every 30 minutes and stay African in mood — cities, savanna light, and gold hour.</p>
                <button type="button" class="close-settings" style="margin-top:16px;background:#333;color:#fff">Close</button>
            </div>`;
        document.body.appendChild(btn);
        document.body.appendChild(panel);
        const open = () => panel.classList.add("open");
        const close = () => panel.classList.remove("open");
        btn.addEventListener("click", open);
        panel.addEventListener("click", e => { if (e.target === panel) close(); });
        panel.querySelector(".close-settings").addEventListener("click", close);
        panel.querySelectorAll(".theme-option").forEach(opt => {
            opt.addEventListener("click", () => applyTheme(opt.dataset.theme));
        });
        applyTheme(getTheme());
    }

    function setupHero() {
        const hero = document.querySelector(".hero");
        if (!hero) return;
        const scene = currentHeroScene();
        let layer = hero.querySelector(".hero-bg-layer");
        if (!layer) {
            layer = document.createElement("div");
            layer.className = "hero-bg-layer";
            hero.prepend(layer);
        }
        layer.style.backgroundImage = 'url("' + scene.src + '")';
        let cap = hero.querySelector(".hero-bg-caption");
        if (!cap) {
            cap = document.createElement("p");
            cap.className = "hero-bg-caption";
            const overlay = hero.querySelector(".hero-overlay") || hero;
            overlay.appendChild(cap);
        }
        cap.textContent = scene.caption + " · next scene in 30 min";
        document.documentElement.style.setProperty("--asln-glass-bg", 'url("' + scene.src + '")');
    }

    function bindRipples() {
        document.addEventListener("click", e => {
            const el = e.target.closest("button, .hero-btn, .hero-secondary, .join-btn, .spotlight-btn, .like-btn, .pay-btn, .method-card, .theme-option, .filter-chip, .gallery-filter, .action-btn");
            if (!el || el.classList.contains("asln-settings-btn")) return;
            const rect = el.getBoundingClientRect();
            const ink = document.createElement("span");
            ink.className = "ripple-ink";
            const size = Math.max(rect.width, rect.height);
            ink.style.width = ink.style.height = size + "px";
            ink.style.left = (e.clientX - rect.left - size / 2) + "px";
            ink.style.top = (e.clientY - rect.top - size / 2) + "px";
            el.appendChild(ink);
            setTimeout(() => ink.remove(), 600);
        });
    }

    applyTheme(getTheme());
    ensureStyles();
    document.addEventListener("DOMContentLoaded", () => {
        applyTheme(getTheme());
        injectNav();
        injectSettings();
        setupHero();
        bindRipples();
    });

    window.ASLNPremium = { getTheme, applyTheme, isPremium, currentHeroScene, HERO_SCENES, PREMIUM_KEY };
})();
