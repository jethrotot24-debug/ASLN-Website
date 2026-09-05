(function () {
    const stack = document.getElementById("cardStack");
    if (!stack) return;

    let profiles = [...ASLN.defaultProfiles];
    let passed = ASLN.get(ASLN.keys.passed) || [];
    let index = 0;
    let activeCard = null;
    let startX = 0, currentX = 0, dragging = false;

    const matchModal = document.getElementById("matchModal");

    function available() {
        return profiles.filter(p => !passed.includes(p.id));
    }

    function renderStack() {
        stack.innerHTML = "";
        const list = available();
        if (index >= list.length) {
            stack.innerHTML = '<div class="no-more-cards"><div class="no-more-icon">✨</div><h3>You\'ve seen everyone!</h3><p>Check back soon or adjust your filters.</p><button onclick="location.reload()">Refresh</button></div>';
            return;
        }

        list.slice(index, index + 3).reverse().forEach((p, i, arr) => {
            const card = document.createElement("div");
            const isTop = i === arr.length - 1;
            card.className = "swipe-card" + (isTop ? " active" : "");
            card.dataset.id = p.id;
            card.style.zIndex = i + 1;
            card.innerHTML = `
                <div class="swipe-card-image">
                    <img src="${p.img}" alt="${p.name}">
                    <div class="swipe-card-gradient"></div>
                    ${p.online ? '<span class="swipe-online">Online</span>' : ""}
                    ${p.verified ? '<span class="swipe-verified">Verified</span>' : ""}
                </div>
                <div class="swipe-card-info">
                    <h2>${p.name}, ${p.age}</h2>
                    <p class="swipe-location">${p.location}</p>
                    <p class="swipe-job">${p.job}</p>
                    <p class="swipe-bio">${p.bio}</p>
                    <div class="swipe-tags">${p.interests.map(t => `<span>${t}</span>`).join("")}</div>
                </div>
                <div class="swipe-indicator like-ind">LIKE</div>
                <div class="swipe-indicator pass-ind">NOPE</div>
            `;
            stack.appendChild(card);
        });

        activeCard = stack.querySelector(".swipe-card.active");
        if (activeCard) bindDrag(activeCard);
    }

    function bindDrag(card) {
        card.addEventListener("mousedown", startDrag);
        card.addEventListener("touchstart", startDrag, { passive: true });
    }

    function startDrag(e) {
        if (!activeCard || e.target.closest(".swipe-actions")) return;
        dragging = true;
        startX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
        activeCard.style.transition = "none";
        document.addEventListener("mousemove", onDrag);
        document.addEventListener("mouseup", endDrag);
        document.addEventListener("touchmove", onDrag, { passive: true });
        document.addEventListener("touchend", endDrag);
    }

    function onDrag(e) {
        if (!dragging || !activeCard) return;
        currentX = (e.type === "touchmove" ? e.touches[0].clientX : e.clientX) - startX;
        activeCard.style.transform = `translateX(${currentX}px) rotate(${currentX * 0.08}deg)`;
        activeCard.classList.toggle("show-like", currentX > 60);
        activeCard.classList.toggle("show-pass", currentX < -60);
    }

    function endDrag() {
        if (!dragging || !activeCard) return;
        dragging = false;
        document.removeEventListener("mousemove", onDrag);
        document.removeEventListener("mouseup", endDrag);
        document.removeEventListener("touchmove", onDrag);
        document.removeEventListener("touchend", endDrag);
        if (currentX > 100) swipeAction("like");
        else if (currentX < -100) swipeAction("pass");
        else {
            activeCard.style.transition = "transform 0.4s cubic-bezier(.25,.8,.25,1)";
            activeCard.style.transform = "";
            activeCard.classList.remove("show-like", "show-pass");
        }
        currentX = 0;
    }

    function swipeAction(action) {
        const id = activeCard.dataset.id;
        const profile = profiles.find(p => p.id === id);
        activeCard.style.transition = "transform 0.5s, opacity 0.5s";
        activeCard.style.transform = action === "like" ? "translateX(120%) rotate(20deg)" : "translateX(-120%) rotate(-20deg)";
        activeCard.style.opacity = "0";

        setTimeout(() => {
            if (action === "like") {
                ASLN.addMatch(id);
                if (Math.random() > 0.45) showMatch(profile);
                ASLN.toast("You liked " + profile.name + "!");
            } else {
                passed.push(id);
                ASLN.set(ASLN.keys.passed, passed);
            }
            index++;
            renderStack();
        }, 400);
    }

    function showMatch(p) {
        if (!matchModal || !p) return;
        document.getElementById("matchName").textContent = p.name;
        document.getElementById("matchImg").src = p.img;
        matchModal.classList.add("show");
    }

    document.getElementById("btnLike")?.addEventListener("click", () => { if (activeCard) { currentX = 150; swipeAction("like"); } });
    document.getElementById("btnPass")?.addEventListener("click", () => { if (activeCard) { currentX = -150; swipeAction("pass"); } });
    document.getElementById("btnSuper")?.addEventListener("click", () => {
        if (activeCard) {
            activeCard.classList.add("super-like");
            setTimeout(() => { currentX = 150; swipeAction("like"); }, 600);
        }
    });
    document.getElementById("closeMatch")?.addEventListener("click", () => matchModal.classList.remove("show"));
    document.getElementById("msgMatch")?.addEventListener("click", () => { matchModal.classList.remove("show"); window.location.href = "messages.html?chat=" + document.getElementById("matchName").textContent; });

    document.querySelectorAll(".filter-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            const f = chip.dataset.filter;
            profiles = f === "all" ? [...ASLN.defaultProfiles] : ASLN.defaultProfiles.filter(p =>
                p.location.toLowerCase().includes(f) || p.interests.some(i => i.toLowerCase().includes(f))
            );
            index = 0;
            renderStack();
        });
    });

    renderStack();
})();
