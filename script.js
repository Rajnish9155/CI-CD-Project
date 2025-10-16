// Menu data
const menuItems = [
    {
        id: 1,
        name: "Caesar Salad",
        category: "appetizers",
        price: 8.99,
        description: "Crisp romaine lettuce with parmesan cheese and croutons",
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 2,
        name: "Chicken Wings",
        category: "appetizers",
        price: 12.99,
        description: "Spicy buffalo wings served with ranch dip",
        image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 3,
        name: "Grilled Salmon",
        category: "main",
        price: 24.99,
        description: "Fresh Atlantic salmon with lemon herb butter",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 4,
        name: "Beef Burger",
        category: "main",
        price: 16.99,
        description: "Juicy beef patty with cheese, lettuce, and tomato",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 5,
        name: "Pasta Carbonara",
        category: "main",
        price: 18.99,
        description: "Creamy pasta with pancetta and parmesan",
        image: "https://images.unsplash.com/photo-1551892370-c65dd5069e4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 6,
        name: "Chocolate Cake",
        category: "desserts",
        price: 7.99,
        description: "Rich chocolate cake with vanilla frosting",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 7,
        name: "Tiramisu",
        category: "desserts",
        price: 9.99,
        description: "Classic Italian dessert with coffee and mascarpone",
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 8,
        name: "Ice Cream Sundae",
        category: "desserts",
        price: 6.99,
        description: "Vanilla ice cream with chocolate syrup and nuts",
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
];

// Cart functionality
let cart = [];
let currentUser = null;

// DOM elements
const menuItemsContainer = document.getElementById('menuItems');
const cartSidebar = document.getElementById('cartSidebar');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartCountElement = document.getElementById('cartCount');
const categoryButtons = document.querySelectorAll('.category-btn');
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const authModal = document.getElementById('authModal');
const checkoutModal = document.getElementById('checkoutModal');
const authForm = document.getElementById('authForm');
const checkoutForm = document.getElementById('checkoutForm');
const authTitle = document.getElementById('authTitle');
const nameInput = document.getElementById('name');

// Initialize the app
function init() {
    displayMenuItems('all');
    setupEventListeners();
    loadUserFromStorage();
    updateCartDisplay();
}

// Display menu items
function displayMenuItems(category) {
    menuItemsContainer.innerHTML = '';
    const filteredItems = category === 'all' ? menuItems : menuItems.filter(item => item.category === category);

    filteredItems.forEach(item => {
        const menuItemElement = createMenuItemElement(item);
        menuItemsContainer.appendChild(menuItemElement);
    });
}

// Create menu item element
function createMenuItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'menu-item';
    itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="menu-item-content">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="price">$${item.price.toFixed(2)}</div>
            <button onclick="addToCart(${item.id})">Add to Cart</button>
        </div>
    `;
    return itemDiv;
}

// Add item to cart
function addToCart(itemId) {
    if (!currentUser) {
        alert('Please login to add items to cart');
        openAuthModal('login');
        return;
    }

    const item = menuItems.find(item => item.id === itemId);
    const existingItem = cart.find(cartItem => cartItem.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateCartDisplay();
    saveCartToStorage();
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
    saveCartToStorage();
}

// Update cart display
function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</p>
            </div>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
    cartCountElement.textContent = cart.length;
}

// Setup event listeners
function setupEventListeners() {
    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            displayMenuItems(button.dataset.category);
        });
    });

    // Cart toggle
    cartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);

    // Checkout
    checkoutBtn.addEventListener('click', openCheckoutModal);

    // Auth modals
    loginBtn.addEventListener('click', () => openAuthModal('login'));
    signupBtn.addEventListener('click', () => openAuthModal('signup'));

    // Auth form submission
    authForm.addEventListener('submit', handleAuthSubmit);

    // Checkout form submission
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);

    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === authModal) closeModals();
        if (e.target === checkoutModal) closeModals();
    });
}

// Toggle cart sidebar
function toggleCart() {
    cartSidebar.classList.toggle('open');
}

// Open auth modal
function openAuthModal(type) {
    authTitle.textContent = type === 'login' ? 'Login' : 'Sign Up';
    nameInput.style.display = type === 'signup' ? 'block' : 'none';
    authModal.style.display = 'block';
}

// Open checkout modal
function openCheckoutModal() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    checkoutModal.style.display = 'block';
}

// Close modals
function closeModals() {
    authModal.style.display = 'none';
    checkoutModal.style.display = 'none';
}

// Handle auth form submission
function handleAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;

    if (authTitle.textContent === 'Login') {
        loginUser(email, password);
    } else {
        signupUser(email, password, name);
    }
}

// Login user
function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        saveUserToStorage();
        closeModals();
        alert('Login successful!');
        updateAuthButtons();
    } else {
        alert('Invalid email or password');
    }
}

// Signup user
function signupUser(email, password, name) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        alert('User already exists');
        return;
    }

    const newUser = { email, password, name };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    currentUser = newUser;
    saveUserToStorage();
    closeModals();
    alert('Signup successful!');
    updateAuthButtons();
}

// Update auth buttons
function updateAuthButtons() {
    if (currentUser) {
        loginBtn.textContent = `Welcome, ${currentUser.name}`;
        loginBtn.disabled = true;
        signupBtn.style.display = 'none';
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.disabled = false;
        signupBtn.style.display = 'inline-block';
    }
}

// Handle checkout form submission
function handleCheckoutSubmit(e) {
    e.preventDefault();
    alert('Order placed successfully! Thank you for your order.');
    cart = [];
    updateCartDisplay();
    saveCartToStorage();
    closeModals();
    toggleCart();
}

// Save user to storage
function saveUserToStorage() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Load user from storage
function loadUserFromStorage() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        updateAuthButtons();
    }
}

// Save cart to storage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from storage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    loadCartFromStorage();
});
