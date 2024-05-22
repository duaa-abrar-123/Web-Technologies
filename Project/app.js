const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const multer = require('multer');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Product = require('./models/product'); // Ensure Product model is imported
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');

// Session and Cookie Configuration
app.use(cookieParser());
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 900000 } // Example: session expires in 15 minutes
}));

// Body Parser and Method Override
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Passport.js Configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Static Files
app.use(express.static('public'));

// Views Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mongoose Configuration
mongoose.connect('mongodb://localhost:27017/Project', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('DB Connected'))
.catch(err => console.log('DB Connection Error:', err));

// Routes
app.use('/products', productRoutes);
app.use(authRoutes);

// Protect Home Route
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.isNewUser) {
      // Mark user as not new after their first login
      req.user.isNewUser = false;
      req.user.save();
    }
    return next();
  }
  res.redirect('/login');
}

// Logout Route
app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid'); // Ensures the session cookie is cleared
      res.redirect('/login');
    });
  });
});

// Login Route (GET)
app.get('/login', (req, res) => {
  res.render('login');
});

// Home Route
app.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const products = await Product.find({});
    res.render('home', { products, user: req.user });
  } catch (err) {
    res.status(500).send('Error retrieving products');
  }
});

app.get('/contactus', (req, res) => {
  res.render('contact');
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
