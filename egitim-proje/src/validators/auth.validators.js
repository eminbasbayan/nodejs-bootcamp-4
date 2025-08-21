const { body } = require('express-validator');

const registerValidators = [
  body('name')
    .notEmpty()
    .withMessage('İsim zorunlu')
    .isLength({ min: 2, max: 50 })
    .withMessage('İsim 2-50 karakter arasında olmalı'),
  body('email')
    .isEmail()
    .withMessage('Geçerli email giriniz')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalı')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir')
];

const loginValidators = [
  body('email')
    .isEmail()
    .withMessage('Geçerli email giriniz')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Şifre zorunlu')
];

const refreshValidators = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token zorunlu')
];

module.exports = {
  registerValidators,
  loginValidators,
  refreshValidators
};
