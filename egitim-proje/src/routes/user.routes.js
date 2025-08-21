const express = require('express');
const { getProfile, getAllUsers, updateUserRole } = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { updateRoleValidators } = require('../validators/user.validators');

const router = express.Router();

// Routes
router.get('/me', authenticate, getProfile);
router.get('/', authenticate, authorize('admin'), getAllUsers);
router.patch('/:id', authenticate, authorize('admin'), updateRoleValidators, validate, updateUserRole);

module.exports = router;
