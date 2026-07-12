// ======================
// PRODUCT CONSTRUCTOR
// ======================
function Product(name, price, qty = 1) {
    this.name = name;
    this.price = price;
    this.qty = qty;
}

const productData = {
    lipstick: { label: 'Lipstick', image: 'assets/img/lipstick.jpg', stock: 18 },
    lipbalm: { label: 'Lipbalm', image: 'assets/img/lipbalm_lip.jpg', stock: 24 },
    lipgloss: { label: 'Lipgloss', image: 'assets/img/lipgloss_lip.jpg', stock: 15 },
    lipliner: { label: 'Lipliner', image: 'assets/img/lipliner_lips.jpg', stock: 12 },
    foundation: { label: 'Foundation', image: 'assets/img/foundation.png', stock: 9 },
    compactpowder: { label: 'Compact Powder', image: 'assets/img/compact_face.jpg', stock: 14 },
    settingspray: { label: 'Setting Spray', image: 'assets/img/settingspray__face.jpg', stock: 11 },
    eyeliner: { label: 'Eyeliner', image: 'assets/img/eyeliner_eye.jpg', stock: 21 },
    eyeshadow: { label: 'Eyeshadow', image: 'assets/img/eyeshadow_eye.jpg', stock: 8 },
    kajal: { label: 'Kajal', image: 'assets/img/kajal_eye.jpg', stock: 17 },
    mascara: { label: 'Mascara', image: 'assets/img/mascara_eye.jpg', stock: 13 },
    perfume: { label: 'Perfume', image: 'assets/img/perfume.png', stock: 7 },
    bodymist: { label: 'Body Mist', image: 'assets/img/perfume__fragrance.jpg', stock: 20 },
    serum: { label: 'Serum', image: 'assets/img/serum_skincare.png', stock: 10 },
    sunscreen: { label: 'Sunscreen', image: 'assets/img/sunscreen_skincare.png', stock: 16 },
    toner: { label: 'Toner', image: 'assets/img/toner_skincare.png', stock: 19 },
    facewash: { label: 'Face Wash', image: 'assets/img/facewash_skincare.jpg', stock: 22 }
};

// ======================
// LOAD CART
// ======================
let cart = JSON.parse(localStorage.getItem("cart"));

if (!Array.isArray(cart)) {
    cart = [];
}

// ======================
// ADD TO CART
// ======================
function addToCart(name, price) {
    let existing = cart.find(item => item.name === name);
console.log("clicked", name);
    if (existing) {
        existing.qty++;
    } else {
        cart.push(new Product(name, price, 1));
    }

let qtyBox = document.getElementById(name + "-qty");
let countBox = document.getElementById(name + "-count");

if (qtyBox && countBox) {
    qtyBox.style.display = "block";
    countBox.innerText = cart.find(i => i.name === name).qty;
}

    showToast("🛒 " + name + " added!");
    updateCart();
}

// ======================
// CHANGE QTY
// ======================
function changeQty(name, change) {
    let item = cart.find(i => i.name === name);
    if (!item) return;

    item.qty += change;

    if (item.qty <= 0) {
        cart = cart.filter(i => i.name !== name);
        document.getElementById(name + "-qty").style.display = "none";
    } else {
        document.getElementById(name + "-count").innerText = item.qty;
    }

    updateCart();
}

// ======================
// UPDATE CART UI
// ======================
function updateCart() {
    let cartBox = document.getElementById("cartBox");
    let totalBox = document.getElementById("total");

    if (!cartBox) return;

    cartBox.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartBox.innerHTML = '<p style="color:#777;margin:0;">Your cart is empty. Add items to see them here.</p>';
    }

    cart.forEach(item => {
        let itemTotal = item.price * item.qty;
        total += itemTotal;
        let meta = productData[item.name] || {};

        cartBox.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <img class="cart-item-img" src="${meta.image || 'assets/img/default.png'}" alt="${meta.label || item.name}">
                    <div class="cart-item-meta">
                        <strong>${meta.label || item.name}</strong>
                        <span>₹${item.price} each · Qty: ${item.qty}</span>
                    </div>
                </div>
                <div class="cart-item-right">
                    <span class="cart-item-total">₹${itemTotal}</span>
                    <button onclick="removeItem('${item.name}')">Remove</button>
                </div>
            </div>
        `;
    });

    totalBox.innerHTML = "Total: ₹" + total;

    localStorage.setItem("cart", JSON.stringify(cart));
    updateBadges();
}

function togglePanel(panelName) {
    let cartPanel = document.getElementById("cartPanel");
    let wishlistPanel = document.getElementById("wishlistPanel");
    let backdrop = document.getElementById("panelBackdrop");

    if (panelName === "cart") {
        cartPanel.classList.toggle("open");
        wishlistPanel.classList.remove("open");
    } else {
        wishlistPanel.classList.toggle("open");
        cartPanel.classList.remove("open");
    }

    let open = cartPanel.classList.contains("open") || wishlistPanel.classList.contains("open");
    backdrop.classList.toggle("open", open);
}

function closePanels() {
    document.getElementById("cartPanel").classList.remove("open");
    document.getElementById("wishlistPanel").classList.remove("open");
    document.getElementById("panelBackdrop").classList.remove("open");
}

function clearCart() {
    if (cart.length === 0) {
        showToast("Cart is already empty");
        return;
    }

    if (confirm("Clear all items from cart?")) {
        cart = [];
        updateCart();
        showToast("Cart cleared!");
    }
}

function updateBadges() {
    let cartBadge = document.getElementById("cartCountBadge");
    let wishlistBadge = document.getElementById("wishlistCountBadge");

    if (cartBadge) {
        cartBadge.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
    }
    if (wishlistBadge) {
        wishlistBadge.innerText = wishlist.length;
    }
}

// ======================
// SEARCH
// ======================
function searchProducts() {
    let input = document.getElementById("searchBar").value.toLowerCase();
    let items = document.querySelectorAll(".product");

    items.forEach(item => {
        let text = item.innerText.toLowerCase();
        item.style.display = text.includes(input) ? "block" : "none";
    });
}

// ======================
// CATEGORY FILTER
// ======================
function showCategory(category) {
    let items = document.querySelectorAll(".product");

    items.forEach(item => {
        item.style.display =
            category === "all" || item.classList.contains(category)
                ? "block"
                : "none";
    });
}

// ======================
// SORT PRODUCTS
// ======================
function sortProducts() {
    let sortType = document.getElementById("sortDropdown").value;
    let container = document.querySelector(".products-container");
    let products = Array.from(document.querySelectorAll(".product"));
    
    // Filter out hidden products
    let visibleProducts = products.filter(p => p.style.display !== "none");
    
    if (sortType === "default") {
        // Restore original order (reorder by data attribute or original position)
        products.sort((a, b) => {
            return Array.from(container.children).indexOf(a) - Array.from(container.children).indexOf(b);
        });
    } else if (sortType === "price-low") {
        visibleProducts.sort((a, b) => {
            let priceA = parseInt(a.querySelector(".price").innerText.replace(/[₹,]/g, ""));
            let priceB = parseInt(b.querySelector(".price").innerText.replace(/[₹,]/g, ""));
            return priceA - priceB;
        });
    } else if (sortType === "price-high") {
        visibleProducts.sort((a, b) => {
            let priceA = parseInt(a.querySelector(".price").innerText.replace(/[₹,]/g, ""));
            let priceB = parseInt(b.querySelector(".price").innerText.replace(/[₹,]/g, ""));
            return priceB - priceA;
        });
    } else if (sortType === "name-a-z") {
        visibleProducts.sort((a, b) => {
            let nameA = a.querySelector("b").innerText.toLowerCase();
            let nameB = b.querySelector("b").innerText.toLowerCase();
            return nameA.localeCompare(nameB);
        });
    } else if (sortType === "name-z-a") {
        visibleProducts.sort((a, b) => {
            let nameA = a.querySelector("b").innerText.toLowerCase();
            let nameB = b.querySelector("b").innerText.toLowerCase();
            return nameB.localeCompare(nameA);
        });
    }
    
    // Re-insert visible products in new order, keep hidden ones at the end
    let hiddenProducts = products.filter(p => p.style.display === "none");
    
    visibleProducts.forEach(product => {
        container.appendChild(product);
    });
    
    hiddenProducts.forEach(product => {
        container.appendChild(product);
    });
}

function normalizeProductKey(name) {
    return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function initProductStockUpdates() {
    document.querySelectorAll('.product').forEach(card => {
        const nameText = card.querySelector('b')?.innerText || '';
        const key = normalizeProductKey(nameText);
        const stock = productData[key]?.stock ?? 0;

        const stockBadge = document.createElement('div');
        stockBadge.className = 'stock-update';
        stockBadge.textContent = stock;
        card.appendChild(stockBadge);

        card.addEventListener('mouseenter', () => {
            stockBadge.textContent = `Stock available: ${stock}`;
            stockBadge.classList.add('active');
        });

        card.addEventListener('mouseleave', () => {
            stockBadge.textContent = stock;
            stockBadge.classList.remove('active');
        });
    });
}

function showToast(message) {
    let toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// ======================
// LOAD
// ======================
window.addEventListener("DOMContentLoaded", function () {
    updateCart();
    initProductStockUpdates();

    // 🔥 RESTORE UI
    cart.forEach(item => {
        let qtyBox = document.getElementById(item.name + "-qty");
        let count = document.getElementById(item.name + "-count");

        if (qtyBox && count) {
            qtyBox.style.display = "block";
            count.innerText = item.qty;
        }
    });
});
function removeItem(name) {
    cart = cart.filter(item => item.name !== name);

    let qtyBox = document.getElementById(name + "-qty");
    if (qtyBox) qtyBox.style.display = "none";

    updateCart();
}
function checkout() {
    if (!cart.length) {
        showToast("Your cart is empty. Add products first.");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = 49;

    let discountPercent = 25;
    if (subtotal >= 1000) discountPercent = 75;
    else if (subtotal >= 600) discountPercent = 50;

    const discountAmount = Math.floor((subtotal * discountPercent) / 100);
    const discountedSubtotal = subtotal - discountAmount;
    const total = discountedSubtotal + shipping;

    document.getElementById("checkoutItems").innerHTML = cart.map(item => {
        const meta = productData[item.name] || {};
        return `
            <div class="checkout-item">
                <img src="${meta.image || 'assets/img/default.png'}" alt="${meta.label || item.name}">
                <div>
                    <strong>${meta.label || item.name}</strong>
                    <span>${item.qty} × ₹${item.price}</span>
                </div>
            </div>
        `;
    }).join('');

    const offerLabel = subtotal >= 1000
        ? "75% OFF (₹1000+ order)"
        : subtotal >= 600
            ? "50% OFF (₹600+ order)"
            : "25% OFF on every order";

    document.getElementById("checkoutSubtotal").textContent = "₹" + subtotal;
    document.getElementById("checkoutDiscount").textContent = "-₹" + discountAmount;
    document.getElementById("checkoutTotal").textContent = "₹" + total;
    document.getElementById("checkoutOfferBox").textContent = "Offer applied: " + offerLabel;
    document.getElementById("checkoutOfferBox").style.display = "block";
    document.getElementById("checkoutDiscountRow").style.display = "flex";

    document.getElementById("checkoutModal").classList.add("open");
    document.querySelector(".products-container").classList.add("products-container-behind");
    document.body.style.overflow = "hidden";
}

function closeCheckoutModal() {
    document.getElementById("checkoutModal").classList.remove("open");
    document.querySelector(".products-container").classList.remove("products-container-behind");
    document.body.style.overflow = "auto";
}

function placeOrder() {
    if (!cart.length) return;

    localStorage.setItem("glowFirstOrderUsed", "true");
    showToast("🎉 Order placed successfully! Thank you for shopping with Glow Beauty.");
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
    closeCheckoutModal();
}

// ======================
// WISHLIST FUNCTIONS
// ======================
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function addToWishlist(name, price) {
    let existing = wishlist.find(item => item.name === name);
    
    if (!existing) {
        wishlist.push({ name, price });
        showToast("❤️ " + name + " added to wishlist!");
    } else {
        showToast("Already in wishlist!");
    }
    
    updateWishlist();
}

function removeFromWishlist(name) {
    wishlist = wishlist.filter(item => item.name !== name);
    updateWishlist();
}

function updateWishlist() {
    let wishlistBox = document.getElementById("wishlistBox");
    
    if (!wishlistBox) return;
    
    wishlistBox.innerHTML = "";
    
    if (wishlist.length === 0) {
        wishlistBox.innerHTML = "<p style='color: #999;'>Your wishlist is empty</p>";
    } else {
        wishlist.forEach(item => {
            let meta = productData[item.name] || {};
            wishlistBox.innerHTML += `
                <div class="wishlist-item">
                    <img class="wishlist-item-img" src="${meta.image || 'assets/img/default.png'}" alt="${meta.label || item.name}">
                    <div class="wishlist-item-details">
                        <strong>${meta.label || item.name}</strong>
                        <span>₹${item.price}</span>
                    </div>
                    <button onclick="removeFromWishlist('${item.name}')">Remove</button>
                </div>
            `;
        });
    }
    
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateBadges();
}

function clearWishlist() {
    if (confirm("Clear all items from wishlist?")) {
        wishlist = [];
        updateWishlist();
        showToast("Wishlist cleared!");
    }
}

window.addEventListener("DOMContentLoaded", function () {
    updateWishlist();
});

// ======================
// PRODUCT DETAIL MODAL
// ======================
function showProductDetail(productName, productPrice) {
    // Get product details from the HTML
    let productCard = Array.from(document.querySelectorAll(".product")).find(p => p.innerText.includes(productName));
    
    if (!productCard) return;

    // Extract image
    let img = productCard.querySelector("img").src;
    
    // Extract price
    let price = productCard.querySelector(".price").innerText;
    
    // Extract features
    let featuresList = productCard.querySelector("ul");
    let featuresHTML = featuresList ? featuresList.outerHTML : "";
    
    // Populate modal
    document.getElementById("detailImg").src = img;
    document.getElementById("detailName").innerText = productName;
    document.getElementById("detailPrice").innerText = price;
    document.getElementById("detailFeatures").innerHTML = featuresHTML;
    
    // Set action buttons
    let existing = cart.find(item => item.name.toLowerCase() === productName.toLowerCase());
    let qtyDisplay = existing ? `Qty: ${existing.qty}` : "";
    document.getElementById("detailActions").innerHTML = `
        <button onclick="addToCart('${productName.toLowerCase().replace(/\\s+/g, '')}', ${productPrice})" style="flex: 2;">Add to Cart 🛒</button>
        <button onclick="addToWishlist('${productName.toLowerCase().replace(/\\s+/g, '')}', ${productPrice})" style="flex: 1; background: #ff6b6b;">Wishlist ❤️</button>
    `;
    
    // Show modal
    document.getElementById("productDetailModal").classList.add("open");
    document.querySelector(".products-container").classList.add("products-container-behind");
    document.body.style.overflow = "hidden";
}

function closeProductDetail() {
    document.getElementById("productDetailModal").classList.remove("open");
    document.querySelector(".products-container").classList.remove("products-container-behind");
    document.body.style.overflow = "auto";
}

// ======================
// OFFER POPUP - SHOWS AFTER 60 SECONDS
// ======================
function showOfferPopup() {
    let offerPopup = document.getElementById("offerPopup");
    if (offerPopup) {
        offerPopup.classList.add("show");
    }
}

function closeOfferPopup() {
    let offerPopup = document.getElementById("offerPopup");
    if (offerPopup) {
        offerPopup.classList.remove("show");
    }
}

function applyOffer() {
    showToast("🎉 Code GLOW20 applied! 20% OFF on your order");
    closeOfferPopup();
}

// Initialize offer popup on page load
window.addEventListener("DOMContentLoaded", function () {
    // Show offer popup after 2 seconds
    setTimeout(() => {
        showOfferPopup();
    },2000);
});