// Toggle between Sign In and Sign Up forms
function toggleForm() {
    document.getElementById("signInForm").classList.toggle("active");
    document.getElementById("signUpForm").classList.toggle("active");
}

// Sign Up Function
function signUp() {
    let name = document.getElementById("signUpName").value.trim();
    let email = document.getElementById("signUpEmail").value.trim();
    let password = document.getElementById("signUpPassword").value;
    let confirmPassword = document.getElementById("signUpConfirmPassword").value;
    let messageBox = document.getElementById("messageBox");

    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showMessage("Please fill all fields!", "error");
        return;
    }

    if (password !== confirmPassword) {
        showMessage("Passwords do not match!", "error");
        return;
    }

    if (password.length < 10) {
        showMessage("Password must be at least 10 characters!", "error");
        return;
    }

    // Check if email already exists
    let users = JSON.parse(localStorage.getItem("glowBeautyUsers")) || [];
    if (users.some(user => user.email === email)) {
        showMessage("Email already registered!", "error");
        return;
    }

    // Create new user
    let newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        joinDate: new Date().toLocaleDateString(),
        address: ""
    };

    users.push(newUser);
    localStorage.setItem("glowBeautyUsers", JSON.stringify(users));

    showMessage("✓ Account created successfully! Redirecting to sign in...", "success");

    setTimeout(() => {
        document.getElementById("signUpName").value = "";
        document.getElementById("signUpEmail").value = "";
        document.getElementById("signUpPassword").value = "";
        document.getElementById("signUpConfirmPassword").value = "";
        toggleForm();
    }, 1500);
}

// Sign In Function
function signIn() {
    let email = document.getElementById("signInEmail").value.trim();
    let password = document.getElementById("signInPassword").value;

    // Validation
    if (!email || !password) {
        showMessage("Please fill all fields!", "error");
        return;
    }

    // Check credentials
    let users = JSON.parse(localStorage.getItem("glowBeautyUsers")) || [];
    let user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showMessage("Invalid email or password!", "error");
        return;
    }

    // Store current logged-in user
    localStorage.setItem("currentUser", JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        joinDate: user.joinDate,
        address: user.address || ""
    }));

    showMessage("✓ Signed in successfully! Redirecting...", "success");

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1500);
}

// Show Message
function showMessage(text, type) {
    let messageBox = document.getElementById("messageBox");
    messageBox.innerHTML = text;
    messageBox.className = "message-box " + type;
}

// Check if user is already logged in
window.addEventListener("DOMContentLoaded", function() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        window.location.href = "profile.html";
    }
});
