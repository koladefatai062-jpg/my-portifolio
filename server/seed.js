require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();

  // Seed admin
  const existing = await Admin.findOne({ email: 'admin@rogue.com' });
  if (!existing) {
    await Admin.create({ email: 'admin@rogue.com', password: 'admin123' });
    console.log('Admin created: admin@rogue.com / admin123');
  } else {
    console.log('Admin already exists');
  }

  // Seed sample products
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { name: 'Oversized Logo Tee', description: 'Heavyweight cotton oversized tee with front print.', price: 49.99, category: 'T-Shirts', sizes: ['S', 'M', 'L', 'XL'], images: ['https://placehold.co/600x800/111/fff?text=Oversized+Tee'], stock: 50, featured: true },
      { name: 'Classic Hoodie', description: 'Premium fleece hoodie with kangaroo pocket.', price: 89.99, category: 'Hoodies', sizes: ['S', 'M', 'L', 'XL', 'XXL'], images: ['https://placehold.co/600x800/111/fff?text=Classic+Hoodie'], stock: 35, featured: true },
      { name: 'Cargo Pants', description: 'Loose fit cargo pants with multiple pockets.', price: 79.99, category: 'Pants', sizes: ['S', 'M', 'L', 'XL'], images: ['https://placehold.co/600x800/111/fff?text=Cargo+Pants'], stock: 25, featured: false },
      { name: 'Bomber Jacket', description: 'Satin bomber jacket with embroidered back.', price: 129.99, category: 'Jackets', sizes: ['M', 'L', 'XL'], images: ['https://placehold.co/600x800/111/fff?text=Bomber+Jacket'], stock: 15, featured: true },
      { name: 'Graphic Tee', description: 'Bold graphic print on soft cotton tee.', price: 44.99, category: 'T-Shirts', sizes: ['S', 'M', 'L', 'XL'], images: ['https://placehold.co/600x800/111/fff?text=Graphic+Tee'], stock: 60, featured: false },
      { name: 'Beanie', description: 'Ribbed knit beanie with embroidered logo.', price: 24.99, category: 'Accessories', sizes: ['S', 'M', 'L'], images: ['https://placehold.co/600x800/111/fff?text=Beanie'], stock: 100, featured: false },
      { name: 'Running Sneakers', description: 'Lightweight mesh sneakers with cushioned sole.', price: 119.99, category: 'Shoes', sizes: ['S', 'M', 'L', 'XL'], images: ['https://placehold.co/600x800/111/fff?text=Sneakers'], stock: 20, featured: false },
    ]);
    console.log('Sample products seeded');
  } else {
    console.log('Products already exist');
  }

  await mongoose.disconnect();
  process.exit(0);
};

seed();
