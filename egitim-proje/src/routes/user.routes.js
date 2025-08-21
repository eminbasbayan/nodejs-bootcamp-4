const express = require('express');
const { body, param } = require('express-validator');
const { getProfile, getAllUsers, updateUserRole } = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

// Validasyon kuralları
const updateRoleValidators = [
  param('id')
    .isMongoId()
    .withMessage('Geçersiz kullanıcı ID'),
  body('role')
    .isIn(['customer', 'admin'])
    .withMessage('Rol customer veya admin olmalıdır')
];

// Routes
router.get('/me', authenticate, getProfile);
router.get('/', authenticate, authorize('admin'), getAllUsers);
router.patch('/:id', authenticate, authorize('admin'), updateRoleValidators, validate, updateUserRole);

module.exports = router;
