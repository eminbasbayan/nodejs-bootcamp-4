const express = require('express');
const { body, param, query } = require('express-validator');
const { createReview, getProductReviews } = require('../controllers/review.controller');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

// Validasyon kuralları
const createReviewValidators = [
  param('id')
    .isMongoId()
    .withMessage('Geçersiz ürün ID'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Puan 1-5 arasında olmalıdır'),
  body('comment')
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage('Yorum 5-500 karakter arasında olmalı')
    .trim()
];

const getReviewsValidators = [
  param('id')
    .isMongoId()
    .withMessage('Geçersiz ürün ID'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Sayfa numarası 1 veya daha büyük olmalıdır'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit 1-50 arasında olmalıdır')
];

// Routes
router.post('/:id/reviews', authenticate, createReviewValidators, validate, createReview);
router.get('/:id/reviews', getReviewsValidators, validate, getProductReviews);

module.exports = router;
