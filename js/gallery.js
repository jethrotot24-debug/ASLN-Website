(function () {
    const grid = document.getElementById("momentsGrid");
    const lightbox = document.getElementById("lightbox");
    const postForm = document.getElementById("postMomentForm");
    if (!grid) return;

    let category = "all";

    function getMoments() { return ASLN.get(ASLN.keys.moments) || ASLN.defaultMoments; }

    function render() {
        let moments = getMoments();
        if (category !== "all") moments = moments.filter(m => m.category === category);

        grid.innerHTML = moments.map((m, i) => `
            <article class="moment-card" data-index="${i}" style="animation-delay:${i * 0.07}s">
                <div class="moment-img-wrap">
                    <img src="${m.img}" alt="${m.caption}" loading="lazy">
                    <span class="moment-cat">${m.category}</span>
                </div>
                <div class="moment-body">
                    <div class="moment-author">
                        <img src="${m.authorImg}" alt="${m.author}">
                        <div><strong>${m.author}</strong><span>${m.time}</span></div>
                    </div>
                    <p>${m.caption}</p>
                    <button class="moment-like" data-id="${m.id}">❤ ${m.likes}</button>
                </div>
            </article>`).join("");

        grid.querySelectorAll(".moment-card").forEach(card => {
            card.addEventListener("click", e => {
                if (e.target.closest(".moment-like")) return;
                openLightbox(parseInt(card.dataset.index));
            });
        });

        grid.querySelectorAll(".moment-like").forEach(btn => {
            btn.addEventListener("click", e => {
                e.stopPropagation();
                const moments = getMoments();
                const m = moments.find(x => x.id === btn.dataset.id);
                if (m) { m.likes++; ASLN.set(ASLN.keys.moments, moments); render(); }
            });
        });
    }

    function openLightbox(index) {
        const moments = category === "all" ? getMoments() : getMoments().filter(m => m.category === category);
        const m = moments[index];
        if (!m || !lightbox) return;
        lightbox.innerHTML = `
            <div class="lightbox-backdrop"></div>
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <img src="${m.img}" alt="${m.caption}">
                <div class="lightbox-info"><strong>${m.author}</strong><p>${m.caption}</p><span>${m.likes} likes · ${m.time}</span></div>
            </div>`;
        lightbox.classList.add("show");
        lightbox.querySelector(".lightbox-backdrop").onclick = () => lightbox.classList.remove("show");
        lightbox.querySelector(".lightbox-close").onclick = () => lightbox.classList.remove("show");
    }

    document.querySelectorAll(".gallery-filter").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".gallery-filter").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            category = btn.dataset.cat;
            render();
        });
    });

    postForm?.addEventListener("submit", e => {
        e.preventDefault();
        const user = ASLN.getUser();
        const caption = document.getElementById("momentCaption").value;
        const file = document.getElementById("momentImage").files[0];
        if (!caption) return;

        function add(img) {
            const moments = getMoments();
            moments.unshift({
                id: "m" + Date.now(),
                author: user ? user.firstName : "Guest",
                authorImg: user?.profilePicture || "images/lady09.png",
                img: img || "images/lady09.png",
                caption,
                category: document.getElementById("momentCategory").value,
                likes: 0,
                time: "Just now"
            });
            ASLN.set(ASLN.keys.moments, moments);
            postForm.reset();
            document.getElementById("postPanel").classList.remove("open");
            render();
            ASLN.toast("Moment posted!");
        }

        if (file) {
            const r = new FileReader();
            r.onload = ev => add(ev.target.result);
            r.readAsDataURL(file);
        } else add(null);
    });

    document.getElementById("openPost")?.addEventListener("click", () => document.getElementById("postPanel").classList.add("open"));
    document.getElementById("closePost")?.addEventListener("click", () => document.getElementById("postPanel").classList.remove("open"));
    render();
})();
