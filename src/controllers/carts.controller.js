const CartManager = require('../managers/CartManager');
const ProductManager = require('../managers/ProductManager');

const cartManager = new CartManager('./carts.json');
const productManager = new ProductManager('./products.json');

const createCart = async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    return res.status(201).json({ cart: newCart });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCartById = async (req, res) => {
  try {
    const cid = parseInt(req.params.cid, 10);
    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    return res.json({ cart });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const cid = parseInt(req.params.cid, 10);
    const pid = parseInt(req.params.pid, 10);
    // Verificar que el producto exista en products.json
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    return res.json({ cart: updatedCart });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const decrementProductInCart = async (req, res) => {
  try {
    const cid = parseInt(req.params.cid, 10);
    const pid = parseInt(req.params.pid, 10);
    const updatedCart = await cartManager.decrementProductQuantity(cid, pid);
    return res.json({ cart: updatedCart });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const finalizeCart = async (req, res) => {
  try {
    const cid = parseInt(req.params.cid, 10);
    const updatedCart = await cartManager.finalizeCart(cid);
    return res.json({ cart: updatedCart });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createCart,
  getCartById,
  addProductToCart,
  decrementProductInCart,
  finalizeCart
};
