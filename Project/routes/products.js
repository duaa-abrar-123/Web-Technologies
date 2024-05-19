const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('index', { products });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get form to add new product
router.get('/new', (req, res) => {
  res.render('addProduct');
});

// Add new product
router.post('/', async (req, res) => {
  const product = new Product(req.body);
  try {
    await product.save();
    res.redirect('/products');
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('viewProduct', { product });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get form to edit product
router.get('/:id/edit', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('editProduct', { product });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/products');
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
