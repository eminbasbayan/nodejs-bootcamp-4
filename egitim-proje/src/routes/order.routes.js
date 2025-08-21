const express = require('express');
const { 
  createOrder, 
  getMyOrders, 
  getAllOrders, 
  updateOrderStatus 
} = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createOrderValidators,
  updateOrderStatusValidators,
  paginationValidators
} = require('../validators/order.validators');

const router = express.Router();

// Routes
router.post('/', authenticate, createOrderValidators, validate, createOrder);
router.get('/my', authenticate, paginationValidators, validate, getMyOrders);
router.get('/', authenticate, authorize('admin'), paginationValidators, validate, getAllOrders);
router.patch('/:id', authenticate, authorize('admin'), updateOrderStatusValidators, validate, updateOrderStatus);

module.exports = router;
