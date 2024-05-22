const mongoose = require('mongoose');
const Product = require('./models/product'); // Ensure the path is correct

mongoose.connect('mongodb://localhost:27017/Project', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('DB Connected');
  })
  .catch((err) => {
    console.error('Unable to connect to DB', err);
  });

const newProducts = [
  {
    name: 'Pillowy and plumpy serum',
    category: 'Serum',
    price: 1850,
    description: '5% 5D Hyaluronic Acid, 1% Niacinamide',
    imageUrl: '/images/hey1.webp'
  },
  {
    name: 'Pink Clay Mask | Kaolin Mask',
    category: 'Mask',
    price: 5700,
    description: '5% Rose Kaolin Clay, Saffron, Vitamin E & Aloe Vera',
    imageUrl: '/images/pro1.webp'
  },
  {
    name: 'Rose Cloud Cleanser | pH friendly',
    category: 'Cleanser',
    price: 3900,
    description: 'Pineapple Extract & Hyaluronic Acid',
    imageUrl: '/images/hey8.webp'
  },
  {
    name: 'Juicy Mist | Peppy Face Mist',
    category: 'Mist',
    price: 2500,
    description: 'Lemon Peel oil & Pomegranate extract',
    imageUrl: '/images/res1.webp'
  }
];

Product.insertMany(newProducts)
  .then(() => {
    console.log('Products added');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error(err);
    mongoose.connection.close();
  });
