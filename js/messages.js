(function () {
    const chatList = document.getElementById("chatList");
    const chatWindow = document.getElementById("chatWindow");
    const chatMessages = document.getElementById("chatMessages");
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const chatHeader = document.getElementById("chatHeader");
    const profilePreview = document.getElementById("profilePreview");
    if (!chatList) return;

    let activeId = null;
    const profileMap = {};
    ASLN.defaultProfiles.forEach(p => { profileMap[p.id] = p; });

    function getMessages() { return ASLN.get(ASLN.keys.messages) || {}; }
    function saveMessages(m) { ASLN.set(ASLN.keys.messages, m); }

    function renderList() {
        const msgs = getMessages();
        const ids = [...new Set([...Object.keys(msgs), ...ASLN.getMatches()])];
        if (!ids.length) {
            chatList.innerHTML = '<p class="empty-msg">No chats yet. Match on Discover first!</p>';
            return;
        }

        chatList.innerHTML = ids.map(id => {
            const p = profileMap[id] || { name: id, img: "images/lady09.png", online: false };
            const thread = msgs[id] || [];
            const last = thread[thread.length - 1];
            return `
                <div class="chat-user${activeId === id ? " active" : ""}" data-id="${id}">
                    <img src="${p.img}" alt="${p.name}">
                    <div class="chat-details">
                        <div class="chat-top"><h3>${p.name}</h3><span class="time">${last ? last.time : ""}</span></div>
                        <span>${last ? last.text : "Start chatting"}</span>
                    </div>
                    ${p.online ? '<span class="unread-count">●</span>' : ""}
                </div>`;
        }).join("");

        chatList.querySelectorAll(".chat-user").forEach(el => {
            el.addEventListener("click", () => openChat(el.dataset.id));
        });
    }

    function openChat(id) {
        activeId = id;
        const p = profileMap[id] || { name: id, img: "images/lady09.png", online: true, location: "Africa", age: 25, job: "Member", interests: ["Life"] };
        const msgs = getMessages();
        if (!msgs[id]) { msgs[id] = []; saveMessages(msgs); }

        chatHeader.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <div><h2>${p.name}</h2><p>${p.online ? "🟢 Online" : "Offline"} · 🔒 Encrypted</p></div>`;

        chatMessages.innerHTML = (msgs[id] || []).map(m => `
            <div class="${m.from === "me" ? "sent" : "received"}">${m.text}</div>
        `).join("");
        chatMessages.scrollTop = chatMessages.scrollHeight;

        if (profilePreview) {
            profilePreview.innerHTML = `
                <img src="${p.img}" alt="${p.name}">
                <h2>${p.name} <span class="verified-chat">✔</span></h2>
                <p>${p.online ? "🟢 Online" : "Offline"}</p>
                <p>📍 ${p.location || "Africa"}</p>
                <p>🎂 ${p.age || 25} Years Old</p>
                <p>💼 ${p.job || "Member"}</p>
                <p>🪪 Verified Member</p>
                <div class="preview-interests">${(p.interests || []).map(i => `<span>${i}</span>`).join("")}</div>
                <a href="public-profile.html?name=${encodeURIComponent(id)}" class="preview-btn">View Full Profile</a>`;
        }

        chatWindow.classList.add("open");
        renderList();
    }

    chatForm?.addEventListener("submit", e => {
        e.preventDefault();
        if (!activeId || !chatInput.value.trim()) return;
        const msgs = getMessages();
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        msgs[activeId].push({ from: "me", text: chatInput.value.trim(), time, encrypted: true });
        saveMessages(msgs);
        chatInput.value = "";
        openChat(activeId);

        setTimeout(() => {
            msgs[activeId].push({ from: activeId, text: "Thanks for your message! I'll reply soon. ❤️", time, encrypted: true });
            saveMessages(msgs);
            openChat(activeId);
        }, 1200);
    });

    renderList();
    const params = new URLSearchParams(location.search);
    if (params.get("chat")) openChat(params.get("chat"));
})();
