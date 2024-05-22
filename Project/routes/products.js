const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const upload = require('../middlewares/upload');

// Get all products with pagination
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit);
    res.render('index', { 
      products, 
      currentPage: page, 
      totalPages, 
      limit 
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get form to add new product
router.get('/new', (req, res) => {
  res.render('addProduct');
});

// Add new product
router.post('/', upload.single('image'), async (req, res) => {
  const product = new Product({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    description: req.body.description,
    status: req.body.status,
    imageUrl: req.file ? `/images/${req.file.filename}` : undefined,
  });
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
router.put('/:id', upload.single('image'), async (req, res) => {
  const updates = {
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    description: req.body.description,
    status: req.body.status,
  };
  if (req.file) {
    updates.imageUrl = `/images/${req.file.filename}`;
  }
  try {
    await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
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
