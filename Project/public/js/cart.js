document.addEventListener('DOMContentLoaded', () => {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartBody = cartSidebar.querySelector('.offcanvas-body');

    fetchCart(); // Fetch the cart from the server when the page loads

    document.querySelectorAll('.btn-primary').forEach((button, index) => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const productCard = button.closest('.card');
            const product = {
                id: index, // Assuming each product has a unique index for simplicity
                name: productCard.querySelector('.card-title').textContent,
                price: parseFloat(productCard.querySelector('.price b').textContent.replace('Rs.', '').replace(',', '')),
                imageUrl: productCard.querySelector('.card-img-top').src,
                quantity: 1
            };
            await addToCart(product);
            showSuccessMessage('Item has been successfully added to the cart.');
        });
    });

    async function addToCart(product) {
        const response = await fetch('/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        if (response.ok) {
            updateCart(await response.json());
        }
    }

    async function fetchCart() {
        const response = await fetch('/cart');
        if (response.ok) {
            updateCart(await response.json());
        }
    }

    function updateCart(cart) {
        cartBody.innerHTML = '';
        let total = 0;
        cart.forEach((product, index) => {
            const productElement = document.createElement('div');
            productElement.classList.add('cart-item');
            productElement.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <div class="product-info">
                    <h6>${product.name}</h6>
                    <h6>Rs. ${product.price.toLocaleString('en-IN')}</h6>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary me-1" onclick="changeQuantity(${index}, -1)">-</button>
                    <span class="quantity-display">${product.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary ms-1" onclick="changeQuantity(${index}, 1)">+</button>
                    <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeFromCart(${index})">Remove</button>
                </div>
            `;
            cartBody.appendChild(productElement);
            total += product.price * product.quantity;
        });
        const totalElement = document.createElement('div');
        totalElement.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mt-3', 'border-top', 'pt-3');
        totalElement.innerHTML = `
            <h5>Total:</h5>
            <h5>Rs. ${total.toLocaleString('en-IN')}</h5>
        `;
        cartBody.appendChild(totalElement);
        const checkoutButton = document.createElement('button');
        checkoutButton.classList.add('btn', 'btn-primary', 'mt-3');
        checkoutButton.textContent = 'Checkout';
        checkoutButton.addEventListener('click', async () => {
            const response = await fetch('/cart/checkout', { method: 'POST' });
            if (response.ok) {
                alert('Order placed');
                updateCart([]);
                const offcanvas = new bootstrap.Offcanvas(cartSidebar);
                offcanvas.hide();
            }
        });
        cartBody.appendChild(checkoutButton);
    }

    window.changeQuantity = async (index, delta) => {
        const response = await fetch(`/cart/update/${index}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ delta })
        });
        if (response.ok) {
            updateCart(await response.json());
        }
    };

    window.removeFromCart = async (index) => {
        const response = await fetch(`/cart/remove/${index}`, { method: 'DELETE' });
        if (response.ok) {
            updateCart(await response.json());
        }
    };

    function showSuccessMessage(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show';
        alert.role = 'alert';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alert);
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 3000);
    }
});
