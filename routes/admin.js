const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();
const { body } = require('express-validator');

const {
  validationProducts,
} = require('../middleware/forms-validation.middleware');

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  '/add-product',
  isAuth,
  validationProducts,
  adminController.postAddProduct
);

// /admin/edit-product/:productId => GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

// /admin/edit-product/:productId => POST
router.post(
  '/edit-product',
  isAuth,
  validationProducts,
  adminController.postEditProduct
);

// // /admin/delete-product => POST
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
