// Products Data
const products = [
    { 
        id: 1, 
        name: "Antique Brass Vishnu Idol", 
        price: 14500, 
        category: "Vishnu & Avatars", 
        image: "https://cdn.pixabay.com/photo/2020/07/21/16/48/lord-vishnu-5426640_640.jpg" 
    },
    { 
        id: 2, 
        name: "Vintage Krishna with Flute Idol", 
        price: 11500, 
        category: "Vishnu & Avatars", 
        image: "https://cdn.pixabay.com/photo/2019/07/28/09/11/krishna-4368597_640.jpg" 
    },
    { 
        id: 3, 
        name: "Balaji Temple Idol", 
        price: 18000, 
        category: "Vishnu & Avatars", 
        image: "https://cdn.pixabay.com/photo/2021/01/09/09/39/balaji-5902199_640.jpg" 
    },
    { 
        id: 4, 
        name: "Classic Nataraja Statue", 
        price: 13200, 
        category: "Shiva Collection", 
        image: "https://cdn.pixabay.com/photo/2017/03/03/15/42/shiva-2115108_640.jpg" 
    },
    { 
        id: 5, 
        name: "Antique Shiva Lingam Set", 
        price: 9800, 
        category: "Shiva Collection", 
        image: "https://cdn.pixabay.com/photo/2020/02/03/11/07/shivling-4815842_640.jpg" 
    },
    { 
        id: 6, 
        name: "Meditating Shiva Idol", 
        price: 10500, 
        category: "Shiva Collection", 
        image: "https://cdn.pixabay.com/photo/2019/12/13/16/23/shiva-4693945_640.jpg" 
    },
    { 
        id: 7, 
        name: "Vintage Sitting Ganesha", 
        price: 7500, 
        category: "Ganesha Idols", 
        image: "https://cdn.pixabay.com/photo/2016/10/15/12/01/ganesha-1742478_640.jpg" 
    },
    { 
        id: 8, 
        name: "Dancing Ganesha Idol", 
        price: 8200, 
        category: "Ganesha Idols", 
        image: "https://cdn.pixabay.com/photo/2018/09/13/22/03/ganesh-3675958_640.jpg" 
    },
    { 
        id: 9, 
        name: "Panchaloha Mini Ganesha Set", 
        price: 6300, 
        category: "Ganesha Idols", 
        image: "https://cdn.pixabay.com/photo/2020/01/13/10/49/ganesha-4762590_640.jpg" 
    },
    { 
        id: 10, 
        name: "Antique Lakshmi Idol", 
        price: 9900, 
        category: "Devi / Goddesses", 
        image: "https://cdn.pixabay.com/photo/2020/10/14/17/29/lakshmi-5655570_640.jpg" 
    },
    { 
        id: 11, 
        name: "Durga on Lion Statue", 
        price: 12800, 
        category: "Devi / Goddesses", 
        image: "https://cdn.pixabay.com/photo/2019/10/06/10/03/durga-4529597_640.jpg" 
    },
    { 
        id: 12, 
        name: "Saraswati with Veena Idol", 
        price: 10200, 
        category: "Devi / Goddesses", 
        image: "https://cdn.pixabay.com/photo/2020/01/29/08/54/saraswati-4801877_640.jpg" 
    }
];

// Cart Management Functions
function getCart() {
    const cart = localStorage.getItem('divineCart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('divineCart', JSON.stringify(cart));
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    updateCartCount();
    return true;
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCount();
}

function clearCart() {
    localStorage.removeItem('divineCart');
    updateCartCount();
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const cart = getCart();
        cartCountElement.textContent = cart.length;
    }
}

function calculateTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Products Page Functions
function renderProducts(filteredProducts = products) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">₹${product.price.toLocaleString()}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });

    // Add event listeners to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
            
            // Visual feedback
            this.textContent = '✓ Added!';
            this.classList.add('added');
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.classList.remove('added');
            }, 1000);
        });
    });
}

function setupProductsPage() {
    const searchInput = document.getElementById('search-input');
    const categoryButtons = document.querySelectorAll('.category-btn');

    let currentCategory = 'All';
    let currentSearch = '';

    function filterProducts() {
        let filtered = products;

        // Filter by category
        if (currentCategory !== 'All') {
            filtered = filtered.filter(p => p.category === currentCategory);
        }

        // Filter by search
        if (currentSearch) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(currentSearch.toLowerCase())
            );
        }

        renderProducts(filtered);
    }

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearch = this.value;
            filterProducts();
        });
    }

    // Category filter functionality
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            currentCategory = this.getAttribute('data-category');
            filterProducts();
        });
    });

    // Initial render
    renderProducts();
    updateCartCount();
}

// Cart Page Functions
function renderCart() {
    const cart = getCart();
    const emptyCart = document.getElementById('empty-cart');
    const cartContent = document.getElementById('cart-content');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
        return;
    }

    if (emptyCart) emptyCart.style.display = 'none';
    if (cartContent) cartContent.style.display = 'block';

    if (cartItems) {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-quantity">Quantity: ${item.quantity}</p>
                    <p class="cart-item-price">₹${(item.price * item.quantity).toLocaleString()}</p>
                </div>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            `;
            cartItems.appendChild(cartItem);
        });

        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
                renderCart();
            });
        });
    }

    if (cartTotal) {
        cartTotal.textContent = `₹${calculateTotal().toLocaleString()}`;
    }
}

function setupCartPage() {
    const clearCartBtn = document.getElementById('clear-cart-btn');
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear your cart?')) {
                clearCart();
                renderCart();
            }
        });
    }

    renderCart();
    updateCartCount();
}

// Payment Page Functions
function renderOrderSummary() {
    const cart = getCart();
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');

    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    if (orderItems) {
        orderItems.innerHTML = '';
        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <span class="order-item-name">${item.name} x${item.quantity}</span>
                <span class="order-item-price">₹${(item.price * item.quantity).toLocaleString()}</span>
            `;
            orderItems.appendChild(orderItem);
        });
    }

    if (orderTotal) {
        orderTotal.textContent = `₹${calculateTotal().toLocaleString()}`;
    }
}

function setupPaymentPage() {
    const checkoutForm = document.getElementById('checkout-form');

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('customer-name').value.trim();
            const mobile = document.getElementById('customer-mobile').value.trim();
            const address = document.getElementById('customer-address').value.trim();
            const deliveryArea = document.getElementById('delivery-area').value;

            if (!name || !mobile || !address || !deliveryArea) {
                alert('Please fill in all customer details');
                return;
            }

            // Clear cart and redirect to thank you page
            clearCart();
            window.location.href = 'thankyou.html';
        });
    }

    renderOrderSummary();
}

// Initialize appropriate page on load
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();

    switch(currentPage) {
        case 'products.html':
            setupProductsPage();
            break;
        case 'cart.html':
            setupCartPage();
            break;
        case 'payment.html':
            setupPaymentPage();
            break;
        default:
            updateCartCount();
    }
});
