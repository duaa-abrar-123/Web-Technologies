const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Render login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// Render register page
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!email) {
      return res.status(400).send('Email is required');
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send('User already registered.');
    }

    user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10), // Hash the password before saving
      isNewUser: true
    });

    await user.save();
    res.redirect('/login');
  } catch (error) {
    res.status(500).send('Error registering new user');
  }
});

module.exports = router;
