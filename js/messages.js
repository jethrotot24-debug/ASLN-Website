(function () {
    const chatList = document.getElementById("chatList");
    const chatMessages = document.getElementById("chatMessages");
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const chatHeader = document.getElementById("chatHeader");
    const waApp = document.getElementById("waApp");
    const waBack = document.getElementById("waBack");
    const search = document.getElementById("chatSearch");
    const emojiTray = document.getElementById("emojiTray");
    const emojiBtn = document.getElementById("emojiBtn");
    if (!chatList) return;

    let activeId = null;
    let filter = "all";
    const profileMap = {};
    ASLN.defaultProfiles.forEach(p => { profileMap[p.id] = p; });

    function getMessages() { return ASLN.get(ASLN.keys.messages) || {}; }
    function saveMessages(m) { ASLN.set(ASLN.keys.messages, m); }

    function ticks(m) {
        if (m.from !== "me") return "";
        if (m.status === "read") return '<span class="wa-ticks read">✓✓</span>';
        if (m.status === "delivered") return '<span class="wa-ticks">✓✓</span>';
        return '<span class="wa-ticks">✓</span>';
    }

    function renderList() {
        const msgs = getMessages();
        const q = (search && search.value || "").toLowerCase();
        let ids = [...new Set([...Object.keys(msgs), ...ASLN.getMatches()])];
        ids = ids.filter(id => {
            const p = profileMap[id] || { name: id, online: false };
            const thread = msgs[id] || [];
            const last = thread[thread.length - 1];
            const unread = thread.some(m => m.from !== "me" && m.status !== "read");
            if (filter === "online" && !p.online) return false;
            if (filter === "unread" && !unread) return false;
            if (q && !(p.name.toLowerCase().includes(q) || (last && last.text.toLowerCase().includes(q)))) return false;
            return true;
        });

        if (!ids.length) {
            chatList.innerHTML = '<p class="empty-msg">No chats yet. Match on Discover first.</p>';
            return;
        }

        chatList.innerHTML = ids.map(id => {
            const p = profileMap[id] || { name: id, img: "images/lady09.png", online: false };
            const thread = msgs[id] || [];
            const last = thread[thread.length - 1];
            const unread = thread.filter(m => m.from !== "me" && m.status !== "read").length;
            return `
                <div class="wa-user${activeId === id ? " active" : ""}" data-id="${id}">
                    <img src="${p.img}" alt="${p.name}">
                    <div>
                        <h3>${p.name}${p.online ? " ·" : ""}</h3>
                        <p class="preview">${last ? last.text : "Start chatting on ASLN"}</p>
                    </div>
                    <div class="meta">
                        <div>${last ? last.time : ""}</div>
                        ${unread ? '<span class="unread">' + unread + "</span>" : ""}
                    </div>
                </div>`;
        }).join("");

        chatList.querySelectorAll(".wa-user").forEach(el => {
            el.addEventListener("click", () => openChat(el.dataset.id));
        });
    }

    function openChat(id) {
        activeId = id;
        const p = profileMap[id] || { name: id, img: "images/lady09.png", online: true, location: "Africa" };
        const msgs = getMessages();
        if (!msgs[id]) { msgs[id] = []; }
        msgs[id] = msgs[id].map(m => m.from === "me" ? m : { ...m, status: "read" });
        saveMessages(msgs);

        chatHeader.innerHTML = `
            <button type="button" class="wa-back" id="waBackInner" aria-label="Back">←</button>
            <img src="${p.img}" alt="${p.name}">
            <div>
                <h2>${p.name}</h2>
                <p>${p.online ? "online" : "last seen recently"} · 🔒</p>
            </div>
            <div class="wa-head-actions">
                <button type="button" class="wa-icon-btn" title="Voice">📞</button>
                <button type="button" class="wa-icon-btn" title="Video">🎥</button>
            </div>`;
        chatHeader.querySelector("#waBackInner")?.addEventListener("click", closeChat);

        const thread = msgs[id] || [];
        chatMessages.innerHTML = '<div class="wa-day">Today</div>' + thread.map(m => `
            <div class="wa-bubble ${m.from === "me" ? "out" : "in"}">
                ${m.text}
                <div class="wa-meta"><span>${m.time}</span>${ticks(m)}</div>
            </div>
        `).join("");
        chatMessages.scrollTop = chatMessages.scrollHeight;
        waApp.classList.add("show-chat");
        document.body.classList.add("show-chat");
        renderList();
        chatInput?.focus();
    }

    function closeChat() {
        waApp.classList.remove("show-chat");
        document.body.classList.remove("show-chat");
        activeId = null;
        renderList();
    }

    waBack?.addEventListener("click", closeChat);

    document.querySelectorAll(".wa-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".wa-tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            filter = tab.dataset.filter;
            renderList();
        });
    });

    search?.addEventListener("input", renderList);

    emojiBtn?.addEventListener("click", () => emojiTray.classList.toggle("open"));
    emojiTray?.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
            chatInput.value += btn.textContent;
            chatInput.focus();
        });
    });

    chatForm?.addEventListener("submit", e => {
        e.preventDefault();
        if (!activeId || !chatInput.value.trim()) return;
        const msgs = getMessages();
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        msgs[activeId].push({ from: "me", text: chatInput.value.trim(), time, encrypted: true, status: "sent" });
        saveMessages(msgs);
        chatInput.value = "";
        emojiTray?.classList.remove("open");
        openChat(activeId);

        setTimeout(() => {
            const all = getMessages();
            const last = all[activeId].filter(m => m.from === "me").pop();
            if (last) last.status = "delivered";
            saveMessages(all);
            openChat(activeId);
        }, 400);

        setTimeout(() => {
            const all = getMessages();
            all[activeId].push({ from: activeId, text: "Thanks for your message — I'll reply soon. 💛", time, encrypted: true, status: "read" });
            all[activeId].forEach(m => { if (m.from === "me") m.status = "read"; });
            saveMessages(all);
            openChat(activeId);
        }, 1400);
    });

    renderList();
    const params = new URLSearchParams(location.search);
    if (params.get("chat")) openChat(params.get("chat"));
})();
