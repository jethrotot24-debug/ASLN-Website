document.addEventListener("DOMContentLoaded", async () => {
    const profilesContainer = document.getElementById("profilesContainer");

    try {
        const response = await fetch("http://localhost:5000/profiles");
        const profiles = await response.json();

        if (!profiles.length) {
            profilesContainer.innerHTML = "<p>No members found yet.</p>";
            return;
        }

        profilesContainer.innerHTML = "";

        profiles.forEach(profile => {
            // Calculate age from date of birth
            const birthDate = new Date(profile.date_of_birth);
            const today = new Date();

            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();

            if (
                monthDifference < 0 ||
                (monthDifference === 0 && today.getDate() < birthDate.getDate())
            ) {
                age--;
            }

            const card = document.createElement("div");
            card.className = "person-card";

            card.innerHTML = `
                <img src="images/default-profile.png" alt="${profile.first_name}">
                
                <h2>${profile.first_name}, ${age}</h2>
                
                <p>${profile.city || ""}, ${profile.country || ""}</p>
                
                <p>${profile.bio || "ASLN Member"}</p>

              <div class="card-buttons">
    <button class="like-btn">❤️ Like</button>
    <button class="view-btn" onclick="viewProfile(${profile.id})">
        View Profile
    </button>
</div>
            `;

            profilesContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading profiles:", error);

        profilesContainer.innerHTML =
            "<p>Could not load ASLN members. Please try again.</p>";
    }
});

function viewProfile(userId) {
    window.location.href = `public-profile.html?id=${userId}`;
}