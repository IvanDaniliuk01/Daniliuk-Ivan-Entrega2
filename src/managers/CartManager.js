const fs = require('fs').promises;

class CartManager {
  constructor(filePath) {
    this.path = filePath;
  }

  // Lee el archivo de carritos y retorna un arreglo
  async getCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return []; // Si no existe el archivo, retorna un arreglo vacío. Esto se ejecuta únicamente por primera vez.
      } else {
        throw new Error("Error al leer carritos: " + error.message);
      }
    }
  }

  // Guarda el arreglo de carritos en el archivo con formato legible
  async saveCarts(carts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    } catch (error) {
      throw new Error("Error al guardar carritos: " + error.message);
    }
  }

  // Crea un nuevo carrito con un id autogenerado y arreglo vacío de productos
  async createCart() {
    try {
      const carts = await this.getCarts();
      const newId = carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;
      const newCart = { id: newId, products: [] };
      carts.push(newCart);
      await this.saveCarts(carts);
      return newCart;
    } catch (error) {
      throw new Error("Error al crear carrito: " + error.message);
    }
  }

  // Retorna el carrito según el id
  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      return carts.find(cart => cart.id === id);
    } catch (error) {
      throw new Error("Error al obtener carrito: " + error.message);
    }
  }

  // Agrega un producto al carrito; si ya existe, incrementa su quantity
  async addProductToCart(cartId, productId) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex(cart => cart.id === cartId);
      if (cartIndex === -1) {
        throw new Error("Carrito no encontrado");
      }
      const cart = carts[cartIndex];
      const productIndex = cart.products.findIndex(p => p.product === productId);
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }
      carts[cartIndex] = cart;
      await this.saveCarts(carts);
      return cart;
    } catch (error) {
      throw new Error("Error al agregar producto al carrito: " + error.message);
    }
  }

  // Decrementa la cantidad de un producto en el carrito; si es 1, se elimina el producto del carrito.

  async decrementProductQuantity(cartId, productId) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex(cart => cart.id === cartId);
      if (cartIndex === -1) {
        throw new Error("Carrito no encontrado");
      }
      const cart = carts[cartIndex];
      const productIndex = cart.products.findIndex(p => p.product === productId);
      if (productIndex === -1) {
        throw new Error("Producto no encontrado en el carrito");
      }
      // Si la cantidad es mayor a 1, se decrementa; si es 1, se elimina el producto del carrito.
      if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity -= 1;
      } else {
        cart.products.splice(productIndex, 1);
      }
      carts[cartIndex] = cart;
      await this.saveCarts(carts);
      return cart;
    } catch (error) {
      throw new Error("Error al actualizar la cantidad: " + error.message);
    }
  }

  async finalizeCart(cartId) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex(cart => cart.id === cartId);
      if (cartIndex === -1) {
        throw new Error("Carrito no encontrado");
      }
      // Marcar el carrito como finalizado
      carts[cartIndex].finalized = true;
      await this.saveCarts(carts);
      return carts[cartIndex];
    } catch (error) {
      throw new Error("Error al finalizar el carrito: " + error.message);
    }
  }  

}

module.exports = CartManager;
