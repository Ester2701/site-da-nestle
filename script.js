document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cartCountSpan = document.getElementById('cart-count');
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');

    let cart = JSON.parse(localStorage.getItem('chocolateCart')) || []; // Load cart from local storage

    // Sample product data
    const products = [
        { id: 1, name: 'Dark Chocolate Bar', price: 25.00, image: 'https://via.placeholder.com/300x200/5A2C18/FFFFFF?text=Dark+Chocolate', description: 'Rich and intense, 70% cocoa.' },
        { id: 2, name: 'Milk Chocolate Truffles', price: 35.00, image: 'https://via.placeholder.com/300x200/8B4513/FFFFFF?text=Milk+Truffles', description: 'Smooth and creamy, melts in your mouth.' },
        { id: 3, name: 'White Chocolate Bites', price: 28.00, image: 'https://via.placeholder.com/300x200/D2B48C/FFFFFF?text=White+Chocolate', description: 'Sweet and delicate, with a hint of vanilla.' },
        { id: 4, name: 'Assorted Pralines', price: 45.00, image: 'https://via.placeholder.com/300x200/6B4226/FFFFFF?text=Assorted+Pralines', description: 'A delightful mix of our best pralines.' },
        { id: 5, name: 'Hazelnut Chocolate Spread', price: 30.00, image: 'https://via.placeholder.com/300x200/4A2C18/FFFFFF?text=Hazelnut+Spread', description: 'Perfect for toast, pancakes, or just a spoon!' },
        { id: 6, name: 'Spicy Chili Chocolate', price: 27.00, image: 'https://via.placeholder.com/300x200/3A1C0F/FFFFFF?text=Chili+Chocolate', description: 'A daring blend of rich chocolate and a hint of chili.' }
    ];

    // Function to render products
    function renderProducts() {
        if (productList) {
            productList.innerHTML = '';
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <span class="price">R$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                `;
                productList.appendChild(productCard);
            });

            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    addProductToCart(productId);
                });
            });
        }
    }

    // Function to add product to cart
    function addProductToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCartDisplay();
            saveCart();
        }
    }

    // Function to remove product from cart
    function removeProductFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartDisplay();
        saveCart();
    }

    // Function to update item quantity in cart
    function updateCartItemQuantity(productId, change) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeProductFromCart(productId);
            } else {
                updateCartDisplay();
                saveCart();
            }
        }
    }

    // Function to update cart display
    function updateCartDisplay() {
        if (cartItemsDiv) {
            cartItemsDiv.innerHTML = '';
            let total = 0;

            if (cart.length === 0) {
                emptyCartMessage.style.display = 'block';
                checkoutBtn.disabled = true;
            } else {
                emptyCartMessage.style.display = 'none';
                checkoutBtn.disabled = false;
                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    const cartItemDiv = document.createElement('div');
                    cartItemDiv.classList.add('cart-item');
                    cartItemDiv.innerHTML = `
                        <div class="cart-item-info">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="cart-item-details">
                                <h4>${item.name}</h4>
                                <p>R$${item.price.toFixed(2)} x ${item.quantity}</p>
                            </div>
                        </div>
                        <div class="cart-item-actions">
                            <button data-id="${item.id}" data-action="decrease">-</button>
                            <span>${item.quantity}</span>
                            <button data-id="${item.id}" data-action="increase">+</button>
                            <button class="remove-item-btn" data-id="${item.id}">Remove</button>
                        </div>
                    `;
                    cartItemsDiv.appendChild(cartItemDiv);
                });
            }

            cartCountSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartTotalSpan.textContent = total.toFixed(2);

            // Add event listeners for cart item buttons
            document.querySelectorAll('.cart-item-actions button[data-action]').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    const action = e.target.dataset.action;
                    if (action === 'increase') {
                        updateCartItemQuantity(productId, 1);
                    } else if (action === 'decrease') {
                        updateCartItemQuantity(productId, -1);
                    }
                });
            });

            document.querySelectorAll('.remove-item-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    removeProductFromCart(productId);
                });
            });
        }
    }

    // Function to save cart to local storage
    function saveCart() {
        localStorage.setItem('chocolateCart', JSON.stringify(cart));
    }

    // Checkout button functionality
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                alert('Thank you for your purchase! Your order has been placed.');
                cart = []; // Clear the cart
                updateCartDisplay();
                saveCart();
            } else {
                alert('Your cart is empty. Please add some chocolates before checking out.');
            }
        });
    }

    // Initial render
    renderProducts();
    updateCartDisplay();
});