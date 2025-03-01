# Documentación de la API

## Productos

### Endpoints:
- **GET** `/api/products`  
  Llama a: `router.get('/', productsController.getAllProducts)`  
  **Descripción:** Lista todos los productos.

- **GET** `/api/products/:pid`  
  Llama a: `router.get('/:pid', productsController.getProductById)`  
  **Descripción:** Consulta el producto con id `:pid`.

- **POST** `/api/products`  
  Llama a: `router.post('/', productsController.addProduct)`  
  **Descripción:** Agrega un producto.  
  **Body:** JSON con los campos:  
  - `title` (string)
  - `description` (string)
  - `code` (string, único)
  - `price` (number)
  - `status` (boolean)
  - `stock` (number)
  - `category` (string)
  - `thumbnails` (array de strings)

- **PUT** `/api/products/:pid`  
  Llama a: `router.put('/:pid', productsController.updateProduct)`  
  **Descripción:** Actualiza el producto con id `:pid`.  
  **Nota:** No se puede modificar el `id`.

- **DELETE** `/api/products/:pid`  
  Llama a: `router.delete('/:pid', productsController.deleteProduct)`  
  **Descripción:** Elimina el producto con id `:pid`.

## Carrito

### Endpoints:
- **POST** `/api/carts`  
  Llama a: `router.post('/', cartsController.createCart)`  
  **Descripción:** Crea un nuevo carrito.

- **GET** `/api/carts/:cid`  
  Llama a: `router.get('/:cid', cartsController.getCartById)`  
  **Descripción:** Consulta el carrito con id `:cid`.

- **POST** `/api/carts/:cid/product/:pid`  
  Llama a: `router.post('/:cid/product/:pid', cartsController.addProductToCart)`  
  **Descripción:** Agrega el producto con id `:pid` al carrito con id `:cid`.

- **PUT** `/api/carts/:cid/product/:pid`  
  Llama a: `router.put('/:cid/product/:pid', cartsController.decrementProductInCart)`  
  **Descripción:** Decrementa la cantidad de un producto en el carrito (o lo elimina si la cantidad es 1).

- **PUT** `/api/carts/:cid/finalize`  
  Llama a: `router.put('/:cid/finalize', cartsController.finalizeCart)`  
  **Descripción:** Finaliza el carrito (marca el carrito como finalizado y permite reiniciar su creación).
