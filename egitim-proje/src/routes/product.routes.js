const express = require('express');
const { 
  createProduct, 
  getProducts, 
  getProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/product.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createProductValidators,
  updateProductValidators,
  getProductValidators,
  deleteProductValidators,
  getProductsValidators
} = require('../validators/product.validators');

const router = express.Router();

// Routes
router.get('/', getProductsValidators, validate, getProducts);
router.get('/:id', getProductValidators, validate, getProduct);
router.post('/', authenticate, authorize('admin'), createProductValidators, validate, createProduct);
router.patch('/:id', authenticate, authorize('admin'), updateProductValidators, validate, updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProductValidators, validate, deleteProduct);

module.exports = router;
