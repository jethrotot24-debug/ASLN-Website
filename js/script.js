const publicProfiles = {
    Sarah: {
        name: "Sarah, 24",
        location: "📍 Kampala, Uganda",
        image: "images/lady09.png",
        bio: "Loves travel, music and entrepreneurship.",
        interests: ["✈️ Travel", "🎵 Music", "💼 Entrepreneurship"]
    },

    Amina: {
        name: "Amina, 27",
        location: "📍 Nairobi, Kenya",
        image: "images/lady01.png",
        bio: "Passionate about business and adventure.",
        interests: ["💼 Business", "✈️ Adventure", "🌍 Travel"]
    },

    Aisha: {
        name: "Aisha, 28",
        location: "📍 Entebbe, Uganda",
        image: "images/lady03.png",
        bio: "Engineer who enjoys hiking and good conversation.",
        interests: ["🥾 Hiking", "💻 Engineering", "💬 Conversation"]
    },

    Mercy: {
        name: "Mercy, 26",
        location: "📍 Lagos, Nigeria",
        image: "images/lady08.png",
        bio: "Creative designer with a love for art and culture.",
        interests: ["🎨 Art", "🌍 Culture", "💻 Design"]
    },

    Xeinah: {
        name: "Xeinah, 29",
        location: "📍 Johannesburg, South Africa",
        image: "images/lady10.png",
        bio: "Doctor who values family, faith, and fitness.",
        interests: ["❤️ Family", "💪 Fitness", "🌍 Travel"]
    },

    Shanice: {
        name: "Shanice, 25",
        location: "📍 Accra, Ghana",
        image: "images/lady12.png",
        bio: "Marketing professional and foodie at heart.",
        interests: ["📈 Marketing", "🍽️ Food", "✈️ Travel"]
    }
}; 

function likeProfile(name) {
    console.log("You liked " + name);
}

function passProfile(name, button) {
    const card = button.closest(".person-card");

    if (card) {
        card.remove();
    }
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

  function openProfile(name, event) {
    if (event.target.closest("button")) {
        return;
    }

    window.location.href =
        "public-profile.html?name=" + encodeURIComponent(name);
}

function toggleLike(button, profileName) {
    const likedProfiles =
        JSON.parse(localStorage.getItem("aslnLikedProfiles")) || [];

    const heart = button.querySelector(".heart");
    const index = likedProfiles.indexOf(profileName);

    if (index === -1) {
        likedProfiles.push(profileName);
        button.classList.add("liked");
        heart.textContent = "❤️";
    } else {
        likedProfiles.splice(index, 1);
        button.classList.remove("liked");
        heart.textContent = "♡";
    }

    localStorage.setItem(
        "aslnLikedProfiles",
        JSON.stringify(likedProfiles)
    );
}

function initLikeButtons() {
    const likedProfiles =
        JSON.parse(localStorage.getItem("aslnLikedProfiles")) || [];

    document.querySelectorAll(".like-btn").forEach(function (button) {
        const card = button.closest(".person-card");

        if (!card) {
            return;
        }

        const profileName = card.querySelector("h2").textContent;
        const heart = button.querySelector(".heart");

        if (likedProfiles.includes(profileName)) {
            button.classList.add("liked", "no-animation");

            if (heart) {
                heart.textContent = "❤️";
            }
        }
    });
}  

function initConnectButton() {
    const connectBtn = document.querySelector(".connect-btn");
    if (connectBtn) {
        connectBtn.addEventListener("click", function () {
            window.location.href = "messages.html";
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



const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
}

loadProfile();
initLikeButtons();
initConnectButton();
initHeroCTA();
setActiveNav();

function loadPublicProfile() {
    const params = new URLSearchParams(window.location.search);
    const profileName = params.get("name");

    if (!profileName || !publicProfiles[profileName]) {
        window.location.href = "discover.html";
        return;
    }

    const profile = publicProfiles[profileName];

    const image = document.getElementById("publicProfileImage");
    const name = document.getElementById("publicProfileName");
    const location = document.getElementById("publicProfileLocation");
    const bio = document.getElementById("publicProfileBio");
    const interests = document.getElementById("publicProfileInterests");
    const likeButton = document.getElementById("publicLikeButton");

    image.src = profile.image;
    image.alt = profile.name;
    name.textContent = profile.name;
    location.textContent = profile.location;
    bio.textContent = profile.bio;

    interests.innerHTML = "";

    profile.interests.forEach(function (interest) {
        const tag = document.createElement("span");
        tag.textContent = interest;
        interests.appendChild(tag);
    });

        if (likeButton) {
        const likedProfiles =
            JSON.parse(localStorage.getItem("aslnLikedProfiles")) || [];

        if (likedProfiles.includes(profileName)) {
            likeButton.classList.add("liked", "no-animation");
            likeButton.textContent = "❤️ Like";
        }

        likeButton.onclick = function () {
            const index = likedProfiles.indexOf(profileName);

            if (likeButton.classList.contains("liked")) {
                likeButton.classList.remove("liked");
                likeButton.classList.remove("no-animation");
                likeButton.textContent = "♡ Like";

                if (index !== -1) {
                    likedProfiles.splice(index, 1);
                }
            } else {
                likeButton.classList.add("liked");
                likeButton.textContent = "❤️ Like";

                if (index === -1) {
                    likedProfiles.push(profileName);
                }
            }

            localStorage.setItem(
                "aslnLikedProfiles",
                JSON.stringify(likedProfiles)
            );
        };
    }
}

if (document.getElementById("publicProfileImage")) {
    loadPublicProfile();
}

/* Signup handled by js/signup.js on signup.html */