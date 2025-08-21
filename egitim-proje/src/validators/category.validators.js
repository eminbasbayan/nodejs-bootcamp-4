const { body, param } = require('express-validator');

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

module.exports = {
  createCategoryValidators,
  updateCategoryValidators,
  deleteCategoryValidators
};
