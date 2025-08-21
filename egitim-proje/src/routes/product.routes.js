const express = require('express');
const { body, param, query } = require('express-validator');
const { 
  createProduct, 
  getProducts, 
  getProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/product.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

// Validasyon kuralları
const createProductValidators = [
  body('title')
    .notEmpty()
    .withMessage('Ürün başlığı zorunlu')
    .isLength({ min: 2, max: 100 })
    .withMessage('Ürün başlığı 2-100 karakter arasında olmalı')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Açıklama 1000 karakterden fazla olamaz')
    .trim(),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Fiyat 0 veya pozitif bir sayı olmalıdır'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stok 0 veya pozitif bir tamsayı olmalıdır'),
  body('category')
    .isMongoId()
    .withMessage('Geçersiz kategori ID'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Resimler bir dizi olmalıdır'),
  body('images.*')
    .optional()
    .isURL()
    .withMessage('Geçersiz resim URL\'si')
];

const updateProductValidators = [
  param('id')
    .isMongoId()
    .withMessage('Geçersiz ürün ID'),
  body('title')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Ürün başlığı 2-100 karakter arasında olmalı')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Açıklama 1000 karakterden fazla olamaz')
    .trim(),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Fiyat 0 veya pozitif bir sayı olmalıdır'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stok 0 veya pozitif bir tamsayı olmalıdır'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Geçersiz kategori ID'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Resimler bir dizi olmalıdır'),
  body('images.*')
    .optional()
    .isURL()
    .withMessage('Geçersiz resim URL\'si')
];

const getProductValidators = [
  param('id')
    .isMongoId()
    .withMessage('Geçersiz ürün ID')
];

const deleteProductValidators = [
  param('id')
    .isMongoId()
    .withMessage('Geçersiz ürün ID')
];

const getProductsValidators = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Sayfa numarası 1 veya daha büyük olmalıdır'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit 1-100 arasında olmalıdır'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum fiyat 0 veya pozitif olmalıdır'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maksimum fiyat 0 veya pozitif olmalıdır'),
  query('category')
    .optional()
    .isMongoId()
    .withMessage('Geçersiz kategori ID'),
  query('sort')
    .optional()
    .matches(/^(title|price|createdAt|averageRating):(asc|desc)$/)
    .withMessage('Geçersiz sıralama formatı. Örnek: price:asc'),
  query('q')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Arama terimi 1-100 karakter arasında olmalıdır')
    .trim()
];

// Routes
router.get('/', getProductsValidators, validate, getProducts);
router.get('/:id', getProductValidators, validate, getProduct);
router.post('/', authenticate, authorize('admin'), createProductValidators, validate, createProduct);
router.patch('/:id', authenticate, authorize('admin'), updateProductValidators, validate, updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProductValidators, validate, deleteProduct);

module.exports = router;
