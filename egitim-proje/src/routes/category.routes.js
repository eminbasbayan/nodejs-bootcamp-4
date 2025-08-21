const express = require('express');
const { body, param } = require('express-validator');
const { 
  createCategory, 
  getCategories, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/category.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

// Validasyon kuralları
const createCategoryValidators = [
  body('name')
    .notEmpty()
    .withMessage('Kategori adı zorunlu')
    .isLength({ min: 2, max: 50 })
    .withMessage('Kategori adı 2-50 karakter arasında olmalı')
    .trim()
];

const updateCategoryValidators = [
  param('id')
    .isMongoId()
    .withMessage('Geçersiz kategori ID'),
  body('name')
    .notEmpty()
    .withMessage('Kategori adı zorunlu')
    .isLength({ min: 2, max: 50 })
    .withMessage('Kategori adı 2-50 karakter arasında olmalı')
    .trim()
];

const deleteCategoryValidators = [
  param('id')
    .isMongoId()
    .withMessage('Geçersiz kategori ID')
];

// Routes
router.post('/', authenticate, authorize('admin'), createCategoryValidators, validate, createCategory);
router.get('/', getCategories);
router.patch('/:id', authenticate, authorize('admin'), updateCategoryValidators, validate, updateCategory);
router.delete('/:id', authenticate, authorize('admin'), deleteCategoryValidators, validate, deleteCategory);

module.exports = router;
