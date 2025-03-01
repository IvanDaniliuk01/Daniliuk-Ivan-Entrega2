const express = require('express');
const router = express.Router();
const cartsController = require('../controllers/carts.controller');

router.post('/', cartsController.createCart);
router.get('/:cid', cartsController.getCartById);
router.post('/:cid/product/:pid', cartsController.addProductToCart);
router.put('/:cid/product/:pid', cartsController.decrementProductInCart);
router.put('/:cid/finalize', cartsController.finalizeCart);


module.exports = router;
