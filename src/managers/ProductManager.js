const fs = require('fs').promises;

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  // Lee el archivo de productos y retorna un arreglo
  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return []; // Si no existe el archivo, retorna un arreglo vacío. Esto se ejecuta únicamente por primera vez.
      } else {
        throw new Error("Error al leer productos: " + error.message);
      }
    }
  }

  // Guarda el arreglo de productos en el archivo con formato legible
  async saveProducts(products) {
    try {
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    } catch (error) {
      throw new Error("Error al guardar productos: " + error.message);
    }
  }

  // Agrega un nuevo producto validando que todos los campos requeridos estén presentes
  async addProduct(product) {
    try {
      const { title, description, code, price, status, stock, category, thumbnails } = product;
      if (!title || !description || !code || price === undefined || status === undefined || stock === undefined || !category || !thumbnails) {
        throw new Error("Todos los campos son obligatorios");
      }

      const products = await this.getProducts();
      // Validar que no se repita el campo code
      if (products.some(p => p.code === code)) {
        throw new Error(`El código ${code} ya existe`);
      }

      // Generar id autoincrementable
      const newId = products.length === 0 ? 1 : products[products.length - 1].id + 1;
      const newProduct = { id: newId, title, description, code, price, status, stock, category, thumbnails };
      products.push(newProduct);
      await this.saveProducts(products);
      return newProduct;
    } catch (error) {
        throw new Error("Error al agregar producto: " + error.message);
      }
  }


  // Retorna un producto según su id
  async getProductById(id) {
    try {
      const products = await this.getProducts();
      return products.find(p => p.id === id);
    } catch (error) {
      throw new Error("Error al obtener producto: " + error.message);
    }
  }

  // Actualiza un producto (excepto el id)
  async updateProduct(id, updatedFields) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error("Producto no encontrado");
      }
      if (updatedFields.id) delete updatedFields.id;
      products[index] = { ...products[index], ...updatedFields };
      await this.saveProducts(products);
      return products[index];
    } catch (error) {
      throw new Error("Error al actualizar producto: " + error.message);
    }
  }

  // Elimina el producto con el id especificado
  async deleteProduct(id) {
    try {
      let products = await this.getProducts();
      const initialLength = products.length;
      products = products.filter(p => p.id !== id);
      if (products.length === initialLength) {
        throw new Error("Producto no encontrado");
      }
      await this.saveProducts(products);
      return true;
    } catch (error) {
      throw new Error("Error al eliminar producto: " + error.message);
    }
  }
}

module.exports = ProductManager;
