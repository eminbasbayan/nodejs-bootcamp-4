const { body, param, query } = require('express-validator');

const createOrderValidators = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Sipariş öğeleri en az 1 adet olmalıdır'),
  body('items.*.product')
    .isMongoId()
    .withMessage('Geçersiz ürün ID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Miktar 1 veya daha büyük olmalıdır'),
  body('shippingAddress.fullName')
    .notEmpty()
    .withMessage('Ad soyad zorunlu')
    .isLength({ min: 2, max: 100 })
    .withMessage('Ad soyad 2-100 karakter arasında olmalı')
    .trim(),
  body('shippingAddress.phone')
    .notEmpty()
    .withMessage('Telefon numarası zorunlu')
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Geçersiz telefon numarası formatı'),
  body('shippingAddress.addressLine')
    .notEmpty()
    .withMessage('Adres satırı zorunlu')
    .isLength({ min: 10, max: 200 })
    .withMessage('Adres 10-200 karakter arasında olmalı')
    .trim(),
  body('shippingAddress.city')
    .notEmpty()
    .withMessage('Şehir zorunlu')
    .isLength({ min: 2, max: 50 })
    .withMessage('Şehir 2-50 karakter arasında olmalı')
    .trim(),
  body('shippingAddress.country')
    .notEmpty()
    .withMessage('Ülke zorunlu')
    .isLength({ min: 2, max: 50 })
    .withMessage('Ülke 2-50 karakter arasında olmalı')
    .trim(),
  body('shippingAddress.postalCode')
    .notEmpty()
    .withMessage('Posta kodu zorunlu')
    .matches(/^[0-9]{5}$/)
    .withMessage('Posta kodu 5 haneli olmalıdır'),
  body('payment.method')
    .optional()
    .isIn(['cod', 'card'])
    .withMessage('Ödeme yöntemi cod veya card olmalıdır')
];

const updateOrderStatusValidators = [
  param('id')
    .isMongoId()
    .withMessage('Geçersiz sipariş ID'),
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Geçersiz sipariş durumu')
];

const paginationValidators = [
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
  createOrderValidators,
  updateOrderStatusValidators,
  paginationValidators
};
