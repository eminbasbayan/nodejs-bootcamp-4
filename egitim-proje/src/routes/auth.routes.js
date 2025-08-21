const express = require('express');
const { body } = require('express-validator');
const { register, login, refresh, logout } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

// Validasyon kuralları
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

// Routes
router.post('/register', registerValidators, validate, register);
router.post('/login', loginValidators, validate, login);
router.post('/refresh', refreshValidators, validate, refresh);
router.post('/logout', authenticate, logout);

module.exports = router;
