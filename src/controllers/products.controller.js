const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager('./products.json');

const getAllProducts = async (req, res) => {
  try {
    const products = await productManager.getProducts();
    if (req.query.name) {
      const filtered = products.filter(p => p.title.toLowerCase().includes(req.query.name.toLowerCase()));
      return res.json({ products: filtered });
    }
    return res.json({ products });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


const getProductById = async (req, res) => {
  try {
    const pid = parseInt(req.params.pid, 10);
    const product = await productManager.getProductById(pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    return res.json({ product });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || price === undefined || status === undefined || stock === undefined || !category || !thumbnails) {
      return res.status(400).json({ error: 'Información incompleta' });
    }
    const newProduct = await productManager.addProduct(req.body);
    return res.status(201).json({ product: newProduct });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const pid = parseInt(req.params.pid, 10);
    const updatedProduct = await productManager.updateProduct(pid, req.body);
    return res.json({ product: updatedProduct });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const pid = parseInt(req.params.pid, 10);
    await productManager.deleteProduct(pid);
    return res.json({ message: 'Producto eliminado' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};
