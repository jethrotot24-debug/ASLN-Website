function likeProfile(name) {
    alert("You liked " + name + "! We'll notify you if it's a match.");
}

function passProfile(name) {
    alert("You passed on " + name + ".");
}

function saveUser(event) {
    event.preventDefault();

    const profilePicture = document.getElementById("profilePicture").files[0];
    const user = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        profilePicture: ""
    };

    function finishSignup() {
        localStorage.setItem("aslnUser", JSON.stringify(user));
        alert("Account created successfully! Welcome to ASLN.");
        window.location.href = "profile.html";
    }

    if (profilePicture) {
        const reader = new FileReader();
        reader.onload = function (e) {
            user.profilePicture = e.target.result;
            finishSignup();
        };
        reader.readAsDataURL(profilePicture);
    } else {
        finishSignup();
    }
}

function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const savedUser = JSON.parse(localStorage.getItem("aslnUser"));

    if (savedUser && savedUser.email === email && savedUser.password === password) {
        alert("Welcome back, " + savedUser.firstName + "!");
        window.location.href = "profile.html";
    } else {
        alert("Invalid email or password. Please try again or sign up.");
    }
}

function loadProfile() {
    const savedUser = JSON.parse(localStorage.getItem("aslnUser"));

    if (!savedUser) return;

    const userName = document.getElementById("userName");
    if (userName) {
        userName.textContent = savedUser.firstName + " " + savedUser.lastName;
    }

    const profileImage = document.getElementById("profileImage");
    if (profileImage && savedUser.profilePicture) {
        profileImage.src = savedUser.profilePicture;
    }

    const userEmail = document.getElementById("userEmail");
    if (userEmail) {
        userEmail.textContent = savedUser.email;
    }
}

function initLikeButtons() {
    document.querySelectorAll(".like-btn").forEach(function (button) {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            button.classList.toggle("liked");
        });
    });
}

function initConnectButton() {
    const connectBtn = document.querySelector(".connect-btn");
    if (connectBtn) {
        connectBtn.addEventListener("click", function () {
            alert("Message sent! They'll be notified of your interest.");
        });
    }
}

function initHeroCTA() {
    const heroBtn = document.querySelector(".hero-cta");
    if (heroBtn) {
        heroBtn.addEventListener("click", function () {
            window.location.href = "signup.html";
        });
    }
}

function setActiveNav() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("nav a").forEach(function (link) {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
}

const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", saveUser);
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
}

loadProfile();
initLikeButtons();
initConnectButton();
initHeroCTA();
setActiveNav();
