(function () {
    const form = document.getElementById("signupForm");
    if (!form) return;

    let step = 1;
    const userData = {};
    const steps = document.querySelectorAll(".signup-step");
    const progress = document.getElementById("signupProgress");
    const stepLabel = document.getElementById("stepLabel");

    function showStep(n) {
        step = n;
        steps.forEach(s => s.classList.toggle("active", parseInt(s.dataset.step) === n));
        if (progress) progress.style.width = (n / 4 * 100) + "%";
        if (stepLabel) stepLabel.textContent = "Step " + n + " of 4";
    }

    document.getElementById("nextStep1")?.addEventListener("click", () => {
        const fn = document.getElementById("firstName").value.trim();
        const ln = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const pw = document.getElementById("password").value;
        const dateOfBirth = document.getElementById("dateOfBirth").value;

if (!fn || !ln || !email || !pw || !dateOfBirth) {
    ASLN.toast("Fill all fields. Password must be 6+ characters.", "error");
    return;
}

Object.assign(userData, {
    firstName: fn,
    lastName: ln,
    email,
    password: pw,
    dateOfBirth
});

showStep(2);
    });

    document.getElementById("nextStep2")?.addEventListener("click", () => {
        const country = document.getElementById("country").value;
        const idType = document.getElementById("idType").value;
        const idNumber = document.getElementById("idNumber").value.trim();
        if (!country || !idType || !idNumber) {
            ASLN.toast("Identity verification is required.", "error");
            return;
        }
        if (!ASLN.validateNIN(idNumber, country)) {
            ASLN.toast("Invalid ID format for selected country.", "error");
            return;
        }
        Object.assign(userData, { country, idType, idNumber, verificationStatus: "pending" });
        showStep(3);
    });

    document.getElementById("nextStep3")?.addEventListener("click", () => {
        userData.location = document.getElementById("location").value.trim();
        userData.bio = document.getElementById("bio").value.trim();
        userData.interests = document.getElementById("interests").value.trim();
        showStep(4);
        document.getElementById("reviewName").textContent = userData.firstName + " " + userData.lastName;
        document.getElementById("reviewEmail").textContent = userData.email;
        document.getElementById("reviewId").textContent = userData.idType + ": ****" + userData.idNumber.slice(-4);
    });

    document.querySelectorAll(".prev-step").forEach(btn => btn.addEventListener("click", () => showStep(step - 1)));

   form.addEventListener("submit", async e => {
    e.preventDefault();

    console.log("Create Account clicked");
    console.log("Sending:", userData);

    try {
        const response = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        console.log("Server response:", result);

        if (!response.ok) {
            ASLN.toast(
                result.message || "Failed to create account.",
                "error"
            );
            return;
        }

        // Account successfully created in PostgreSQL
        userData.createdAt = new Date().toISOString();
        userData.userId = result.userId;

        ASLN.set(ASLN.keys.user, userData);

        ASLN.toast(
            "Account created successfully! Verification in progress."
        );

        setTimeout(() => {
            window.location.href = "profile.html";
        }, 1200);

    } catch (error) {
        console.error("Signup error:", error);

        ASLN.toast(
            "Could not connect to the ASLN server.",
            "error"
        );
    }
});

    document.getElementById("idType")?.addEventListener("change", e => {
        const hints = {
            NIN: "Uganda NIN: 2 letters + 12 digits (e.g. CM920861025KLA)",
            "National ID": "Enter your national ID number",
            Passport: "Passport number (8-12 characters)",
            "Driver's License": "Enter your license number"
        };
        const hint = document.getElementById("idHint");
        if (hint) hint.textContent = hints[e.target.value] || "";
    });

    showStep(1);
})();
