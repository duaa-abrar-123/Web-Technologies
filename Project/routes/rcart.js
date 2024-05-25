const express = require('express');
const router = express.Router();

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Unauthorized');
}

// Get the current cart
router.get('/', ensureAuthenticated, (req, res) => {
    res.json(req.session.cart || []);
});

// Add a product to the cart
router.post('/add', ensureAuthenticated, (req, res) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    const product = req.body;
    const existingProductIndex = req.session.cart.findIndex(item => item.id === product.id);
    if (existingProductIndex >= 0) {
        req.session.cart[existingProductIndex].quantity++;
    } else {
        req.session.cart.push(product);
    }
    res.json(req.session.cart);
});

// Update the quantity of a product in the cart
router.post('/update/:index', ensureAuthenticated, (req, res) => {
    const index = req.params.index;
    const delta = req.body.delta;
    if (req.session.cart && req.session.cart[index]) {
        req.session.cart[index].quantity += delta;
        if (req.session.cart[index].quantity <= 0) {
            req.session.cart.splice(index, 1);
        }
    }
    res.json(req.session.cart);
});

// Remove a product from the cart
router.delete('/remove/:index', ensureAuthenticated, (req, res) => {
    const index = req.params.index;
    if (req.session.cart && req.session.cart[index]) {
        req.session.cart.splice(index, 1);
    }
    res.json(req.session.cart);
});

// Checkout and clear the cart
router.post('/checkout', ensureAuthenticated, (req, res) => {
    // Handle order placement logic here (e.g., save order to the database)
    // For now, we'll just clear the cart
    req.session.cart = [];
    res.send('Order placed');
});

module.exports = router;
