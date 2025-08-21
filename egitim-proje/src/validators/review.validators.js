const { body, param, query } = require('express-validator');

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

module.exports = {
  createReviewValidators,
  getReviewsValidators
};
