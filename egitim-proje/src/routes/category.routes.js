const express = require('express');
const { 
  createCategory, 
  getCategories, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/category.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { 
  createCategoryValidators,
  updateCategoryValidators,
  deleteCategoryValidators
} = require('../validators/category.validators');

const router = express.Router();

// Routes
router.post('/', authenticate, authorize('admin'), createCategoryValidators, validate, createCategory);
router.get('/', getCategories);
router.patch('/:id', authenticate, authorize('admin'), updateCategoryValidators, validate, updateCategory);
router.delete('/:id', authenticate, authorize('admin'), deleteCategoryValidators, validate, deleteCategory);

module.exports = router;
