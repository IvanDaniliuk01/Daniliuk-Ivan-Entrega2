// src/routes/views.router.js

const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager('./products.json');

// Ruta para el home
router.get('/', (req, res) => {
  res.render('home');
});

// Ruta para la vista en tiempo real de productos
router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
