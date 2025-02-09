document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-form")?.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        fetch("backend/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) window.location.href = "resume.html"; // Redirect to resume
            else alert(data.message);
        });
    });

    document.getElementById("signup-form")?.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;

        fetch("backend/signup.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) window.location.href = "index.html"; // Redirect to login
            else alert(data.message);
        });
    });
});
