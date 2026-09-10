(function () {
    const methods = [
        { id: "visa", name: "Visa", kind: "Card", type: "card" },
        { id: "mastercard", name: "Mastercard", kind: "Card", type: "card" },
        { id: "amex", name: "American Express", kind: "Card", type: "card" },
        { id: "discover", name: "Discover", kind: "Card", type: "card" },
        { id: "mtn", name: "MTN MoMo", kind: "Mobile money", type: "momo" },
        { id: "airtel", name: "Airtel Money", kind: "Mobile money", type: "momo" },
        { id: "vodafone", name: "Vodafone Cash", kind: "Mobile money", type: "momo" },
        { id: "mpesa", name: "M-Pesa", kind: "Mobile money", type: "momo" },
        { id: "orange", name: "Orange Money", kind: "Mobile money", type: "momo" },
        { id: "att", name: "AT&T", kind: "Carrier billing", type: "carrier" },
        { id: "verizon", name: "Verizon", kind: "Carrier billing", type: "carrier" },
        { id: "paypal", name: "PayPal", kind: "Wallet", type: "wallet" },
        { id: "apple", name: "Apple Pay", kind: "Wallet", type: "wallet" },
        { id: "google", name: "Google Pay", kind: "Wallet", type: "wallet" },
        { id: "paystack", name: "Paystack", kind: "Africa", type: "wallet" },
        { id: "flutterwave", name: "Flutterwave", kind: "Africa", type: "wallet" }
    ];

    const grid = document.getElementById("methodsGrid");
    const fields = document.getElementById("dynamicFields");
    const title = document.getElementById("payTitle");
    const planLabel = document.getElementById("planLabel");
    const form = document.getElementById("payForm");
    if (!grid) return;

    let selected = methods[0];
    let plan = { plan: "platinum", price: "49.99" };

    function fieldsFor(m) {
        if (m.type === "card") {
            return `
                <input name="card" inputmode="numeric" autocomplete="cc-number" placeholder="Card number" required maxlength="19">
                <input name="expiry" placeholder="MM/YY" required maxlength="5">
                <input name="cvc" inputmode="numeric" placeholder="CVC" required maxlength="4">`;
        }
        if (m.type === "momo") {
            return `<input name="phone" type="tel" placeholder="Mobile money number" required>
                <input name="pin" inputmode="numeric" placeholder="MoMo PIN (demo)" required maxlength="6">`;
        }
        if (m.type === "carrier") {
            return `<input name="phone" type="tel" placeholder="Phone on ${m.name} plan" required>`;
        }
        return `<input name="wallet" placeholder="${m.name} email or ID" required>`;
    }

    function renderMethods() {
        grid.innerHTML = methods.map(m => `
            <button type="button" class="method-card${selected.id === m.id ? " selected" : ""}" data-id="${m.id}">
                <div class="brand">${m.name}</div>
                <div class="kind">${m.kind}</div>
            </button>`).join("");
        grid.querySelectorAll(".method-card").forEach(btn => {
            btn.addEventListener("click", () => {
                selected = methods.find(x => x.id === btn.dataset.id);
                title.textContent = "Pay with " + selected.name;
                fields.innerHTML = fieldsFor(selected);
                renderMethods();
            });
        });
    }

    document.querySelectorAll(".plan-card").forEach(card => {
        card.addEventListener("click", () => {
            document.querySelectorAll(".plan-card").forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            plan = { plan: card.dataset.plan, price: card.dataset.price };
            planLabel.textContent = "Plan: " + card.querySelector("h3").textContent + " · $" + plan.price;
        });
    });

    fields.innerHTML = fieldsFor(selected);
    renderMethods();

    form.addEventListener("submit", e => {
        e.preventDefault();
        const record = {
            plan: plan.plan,
            price: plan.price,
            method: selected.id,
            methodName: selected.name,
            at: new Date().toISOString(),
            active: true
        };
        localStorage.setItem("aslnPremium", JSON.stringify(record));
        if (window.ASLN && ASLN.toast) ASLN.toast("Welcome to ASLN " + selected.name + " Premium");
        else alert("Premium activated with " + selected.name);
        setTimeout(() => location.href = "index.html", 700);
    });
})();
