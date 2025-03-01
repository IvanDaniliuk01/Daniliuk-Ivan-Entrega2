const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');


// Routers
const productsRouter = require('./routes/products.routes');
const cartsRouter = require('./routes/carts.routes');
const viewsRouter = require('./routes/views.router');

const app = express();
const PORT = 8080;

// Configurar middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos (por ejemplo, para el socket.io client)
app.use(express.static(path.join(__dirname, 'public')));

// Montar routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Crear el servidor HTTP y configurar Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configurar eventos de Socket.io
const ProductManager = require('./managers/ProductManager');
const productManager = new ProductManager('./products.json');
const CartManager = require('./managers/CartManager');
const cartManager = new CartManager('./carts.json');

io.on('connection', (socket) => {

    // Al conectarse, se puede enviar la lista actual de productos
    (async () => {
      try {
        const products = await productManager.getProducts();
        socket.emit('updateProducts', products);
      } catch (error) {
        socket.emit('error', error.message);
      }
    })();

    // Escuchar evento para agregar un producto
    socket.on('addProduct', async (productData) => {
      try {
        // Se espera que productData contenga todos los campos obligatorios
        await productManager.addProduct(productData);
        const products = await productManager.getProducts();
        // Emitir a todos los clientes la lista actualizada
        io.emit('updateProducts', products);
      } catch (error) {
        socket.emit('error', error.message);
      }
    });

    // Escuchar evento para eliminar un producto
    socket.on('deleteProduct', async (productId) => {
      try {
        await productManager.deleteProduct(productId);
        const products = await productManager.getProducts();
        io.emit('updateProducts', products);
      } catch (error) {
        socket.emit('error', error.message);
      }
    });

    //Evento para actualizar un producto
    socket.on('updateProduct', async (updateData) => {
      try {
        // updateData debe contener 'id' y los campos a actualizar
        const { id, ...fields } = updateData;
        await productManager.updateProduct(id, fields);
        const products = await productManager.getProducts();
        io.emit('updateProducts', products);
      } catch (error) {
        socket.emit('error', error.message);
      }
    });

    // Evento para crear un carrito
    socket.on('createCart', async () => {
      try {
        const newCart = await cartManager.createCart();
        // Emitir solo al cliente que creó el carrito (o a todos, según convenga)
        socket.emit('cartCreated', newCart);
      } catch (error) {
        socket.emit('error', error.message);
      }
    });
    
    // Evento para agregar un producto al carrito
    socket.on('addToCart', async (data) => {
      try {
        const { cartId, productId } = data;
        await cartManager.addProductToCart(cartId, productId);
        const updatedCart = await cartManager.getCartById(cartId);
        // Emitir la actualización a todos los clientes (o al que corresponda)
        io.emit('cartUpdated', updatedCart);
      } catch (error) {
        socket.emit('error', error.message);
      }
    });

    // Evento para decrementar la cantidad de un producto en el carrito
    socket.on('decrementFromCart', async (data) => {
      try {
        const { cartId, productId } = data;
        const updatedCart = await cartManager.decrementProductQuantity(cartId, productId);
      io.emit('cartUpdated', updatedCart);
    } catch (error) {
      socket.emit('error', error.message);
      }
    });

    // Evento para finalizar un carrito
    socket.on('finalizeCart', async (data) => {
      try {
        const { cartId } = data;
        const updatedCart = await cartManager.finalizeCart(cartId);
        io.emit('cartUpdated', updatedCart);
      } catch (error) {
        socket.emit('error', error.message);
      }
    });
  
    socket.on('disconnect', () => {
    });
});

// Iniciar el servidor en el puerto 8080
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});