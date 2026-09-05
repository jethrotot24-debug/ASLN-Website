const ASLN = {
    keys: {
        user: "aslnUser",
        matches: "aslnMatches",
        messages: "aslnMessages",
        moments: "aslnMoments",
        passed: "aslnPassed"
    },

    get(key) {
        try { return JSON.parse(localStorage.getItem(key)); }
        catch { return null; }
    },

    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    getUser() { return this.get(this.keys.user); },

    defaultProfiles: [
        { id: "Sarah", name: "Sarah", age: 24, location: "Kampala, Uganda", job: "Entrepreneur", bio: "Loves travel, music and entrepreneurship.", img: "images/lady09.png", interests: ["Travel", "Music", "Business"], verified: true, online: true },
        { id: "Amina", name: "Amina", age: 27, location: "Nairobi, Kenya", job: "Business Analyst", bio: "Passionate about business and adventure.", img: "images/lady01.png", interests: ["Business", "Adventure", "Travel"], verified: true, online: true },
        { id: "Aisha", name: "Aisha", age: 28, location: "Entebbe, Uganda", job: "Engineer", bio: "Engineer who enjoys hiking and good conversation.", img: "images/lady03.png", interests: ["Hiking", "Engineering", "Cooking"], verified: true, online: false },
        { id: "Mercy", name: "Mercy", age: 26, location: "Lagos, Nigeria", job: "Designer", bio: "Creative designer with a love for art and culture.", img: "images/lady08.png", interests: ["Art", "Culture", "Design"], verified: true, online: true },
        { id: "Xeinah", name: "Xeinah", age: 29, location: "Johannesburg, SA", job: "Doctor", bio: "Values family, faith, and staying active.", img: "images/lady10.png", interests: ["Family", "Fitness", "Faith"], verified: true, online: false },
        { id: "Shanice", name: "Shanice", age: 25, location: "Accra, Ghana", job: "Marketing", bio: "Marketing professional and foodie at heart.", img: "images/lady12.png", interests: ["Food", "Marketing", "Travel"], verified: true, online: true }
    ],

    defaultMoments: [
        { id: "m1", author: "Sarah", authorImg: "images/lady09.png", img: "images/lady09.png", caption: "Beautiful evening in Kampala. Grateful for this city.", category: "Life", likes: 142, time: "2h ago" },
        { id: "m2", author: "Amina", authorImg: "images/lady01.png", img: "images/lady01.png", caption: "Adventure day in Nairobi — living my best life.", category: "Travel", likes: 89, time: "5h ago" },
        { id: "m3", author: "Mercy", authorImg: "images/lady08.png", img: "images/lady08.png", caption: "New designs dropping soon. Stay tuned!", category: "Events", likes: 256, time: "1d ago" },
        { id: "m4", author: "Shanice", authorImg: "images/lady12.png", img: "images/lady12.png", caption: "Sunday brunch vibes in Accra.", category: "Food", likes: 312, time: "1d ago" },
        { id: "m5", author: "Aisha", authorImg: "images/lady03.png", img: "images/lady03.png", caption: "Hiking complete. Views worth every step.", category: "Travel", likes: 178, time: "2d ago" },
        { id: "m6", author: "Xeinah", authorImg: "images/lady10.png", img: "images/lady10.png", caption: "Morning run along the coast. Grateful.", category: "Life", likes: 95, time: "3d ago" }
    ],

    initMoments() {
        if (!this.get(this.keys.moments)) this.set(this.keys.moments, this.defaultMoments);
    },

    initMessages() {
        if (!this.get(this.keys.messages)) {
            this.set(this.keys.messages, {
                Sarah: [
                    { from: "Sarah", text: "Hi! I saw we matched. How are you?", time: "10:30 AM", encrypted: true },
                    { from: "me", text: "Hello Sarah! Great to connect with you.", time: "10:32 AM", encrypted: true }
                ],
                Amina: [
                    { from: "Amina", text: "Your profile caught my eye. Love your vibe!", time: "Yesterday", encrypted: true }
                ]
            });
        }
    },

    getMatches() { return this.get(this.keys.matches) || []; },

    addMatch(id) {
        const matches = this.getMatches();
        if (!matches.includes(id)) {
            matches.push(id);
            this.set(this.keys.matches, matches);
        }
    },

    validateNIN(value, country) {
        if (!value || value.length < 8) return false;
        const v = value.replace(/\s/g, "");
        if (country === "UG") return /^[A-Z]{2}[0-9]{12}$/i.test(v);
        if (country === "KE") return /^[0-9]{7,8}$/.test(v);
        if (country === "NG") return /^[0-9]{11}$/.test(v);
        return /^[A-Z0-9]{8,20}$/i.test(v);
    },

    toast(msg, type) {
        let t = document.querySelector(".asln-toast");
        if (!t) {
            t = document.createElement("div");
            t.className = "asln-toast";
            document.body.appendChild(t);
        }
        t.textContent = msg;
        t.className = "asln-toast show" + (type ? " " + type : "");
        setTimeout(() => t.classList.remove("show"), 3000);
    },

    setActiveNav() {
        const page = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll(".navbar a, nav a").forEach(link => {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href === page);
        });
        document.querySelectorAll(".bottom-nav a").forEach(link => {
            link.classList.toggle("active", link.dataset.page === page);
        });
    },

    loadProfileExtras() {
        const user = this.getUser();
        if (!user) return;

        const map = {
            userName: user.firstName + " " + user.lastName,
            userEmail: user.email,
            userLocation: user.location || "Africa",
            userBio: user.bio || "Looking for meaningful connections.",
            userAge: user.age || "—",
            userInterests: user.interests || "Music, Travel, Sports"
        };

        Object.entries(map).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        });

        const img = document.getElementById("profileImage");
        if (img && user.profilePicture) img.src = user.profilePicture;

        const badge = document.getElementById("verifyBadge");
        if (badge) {
            const ok = user.verificationStatus === "verified";
            badge.textContent = ok ? "Verified Member" : "Verification Pending";
            badge.className = "verify-badge " + (ok ? "verified" : "pending");
        }
    },

    init() {
        this.initMoments();
        this.initMessages();
        this.setActiveNav();
        this.loadProfileExtras();
    }
};

document.addEventListener("DOMContentLoaded", () => ASLN.init());
