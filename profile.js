// Load user profile on page load
window.addEventListener("DOMContentLoaded", function() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        window.location.href = "auth.html";
        return;
    }

    // Display user info
    document.getElementById("userName").textContent = currentUser.name;
    document.getElementById("userEmail").textContent = currentUser.email;
    document.getElementById("userJoinDate").textContent = currentUser.joinDate;
    document.getElementById("userAddress").textContent = currentUser.address || "No address saved yet.";
    document.getElementById("addressText").textContent = currentUser.address || "You haven't set a saved shipping address yet.";

    // Update auth status in navbar
    document.getElementById("authStatus").innerHTML = `<span style="color: white; margin-left: 20px;">Welcome, ${currentUser.name}!</span>`;

    renderOrders();
    renderWishlist();
});

// Edit Profile
function editProfile() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    document.getElementById("editName").value = currentUser.name;
    document.getElementById("editEmail").value = currentUser.email;
    document.getElementById("editModal").style.display = "block";
}

function editAddress() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    document.getElementById("editAddress").value = currentUser.address || "";
    document.getElementById("addressModal").style.display = "block";
}

// Close Modal
function closeModal() {
    document.getElementById("editModal").style.display = "none";
}

function closeAddressModal() {
    document.getElementById("addressModal").style.display = "none";
}

// Save Profile Changes
function saveProfile() {
    let newName = document.getElementById("editName").value.trim();
    let newEmail = document.getElementById("editEmail").value.trim();

    if (!newName || !newEmail) {
        showMessage("Please fill all fields!", "error");
        return;
    }

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let users = JSON.parse(localStorage.getItem("glowBeautyUsers")) || [];

    // Find and update user in the users array
    let userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].name = newName;
        users[userIndex].email = newEmail;
        localStorage.setItem("glowBeautyUsers", JSON.stringify(users));
    }

    // Update current user
    currentUser.name = newName;
    currentUser.email = newEmail;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Update display
    document.getElementById("userName").textContent = newName;
    document.getElementById("userEmail").textContent = newEmail;
    document.getElementById("authStatus").innerHTML = `<span style="color: white; margin-left: 20px;">Welcome, ${newName}!</span>`;

    showMessage("✓ Profile updated successfully!", "success");
    closeModal();
}

function saveAddress() {
    let newAddress = document.getElementById("editAddress").value.trim();

    if (!newAddress) {
        showMessage("Please enter your address!", "error");
        return;
    }

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let users = JSON.parse(localStorage.getItem("glowBeautyUsers")) || [];

    let userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].address = newAddress;
        localStorage.setItem("glowBeautyUsers", JSON.stringify(users));
    }

    currentUser.address = newAddress;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    document.getElementById("userAddress").textContent = newAddress;
    document.getElementById("addressText").textContent = newAddress;

    showMessage("✓ Address updated successfully!", "success");
    closeAddressModal();
}

// Render Orders
function renderOrders() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let orders = JSON.parse(localStorage.getItem("glowBeautyOrders")) || [];
    let ordersList = document.getElementById("ordersList");

    if (!ordersList) return;

    let userOrders = orders.filter(order => order.userId === currentUser.id);

    if (userOrders.length === 0) {
        ordersList.innerHTML = `<p class="empty-state">No orders yet. Start shopping to create your first order!</p>`;
        return;
    }

    ordersList.innerHTML = userOrders.map(order => {
        return `
            <div class="order-item">
                <div>
                    <strong>${order.title}</strong>
                    <p>${order.date}</p>
                </div>
                <div>
                    <span>${order.items} items</span>
                    <strong>₹${order.total}</strong>
                </div>
            </div>
        `;
    }).join("");
}

// Render Wishlist
function renderWishlist() {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let wishlistBox = document.getElementById("profileWishlist");

    if (!wishlistBox) return;

    if (wishlist.length === 0) {
        wishlistBox.innerHTML = `<p class="empty-state">Your wishlist is empty. Click the heart icon in products to save favorites.</p>`;
        return;
    }

    wishlistBox.innerHTML = wishlist.map(item => {
        return `
            <div class="wishlist-card">
                <div>
                    <strong>${item.name}</strong>
                    <p>₹${item.price}</p>
                </div>
                <button class="btn-danger" onclick="removeWishlistItem('${item.name}')">Remove</button>
            </div>
        `;
    }).join("");
}

function removeWishlistItem(name) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist = wishlist.filter(item => item.name !== name);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    renderWishlist();
}

// Sign Out
function signOut() {
    if (confirm("Are you sure you want to sign out?")) {
        localStorage.removeItem("currentUser");
        showMessage("✓ Signed out successfully! Redirecting...", "success");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    }
}

// Show Message
function showMessage(text, type) {
    let messageBox = document.getElementById("messageBox");
    messageBox.innerHTML = text;
    messageBox.className = "message-box " + type;
    setTimeout(() => {
        messageBox.className = "message-box";
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    let editModal = document.getElementById("editModal");
    let addressModal = document.getElementById("addressModal");
    if (event.target === editModal) {
        editModal.style.display = "none";
    }
    if (event.target === addressModal) {
        addressModal.style.display = "none";
    }
}
