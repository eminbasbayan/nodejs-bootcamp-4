const express = require('express');
const { createReview, getProductReviews } = require('../controllers/review.controller');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createReviewValidators,
  getReviewsValidators
} = require('../validators/review.validators');

const router = express.Router();

// Routes
router.post('/:id/reviews', authenticate, createReviewValidators, validate, createReview);
router.get('/:id/reviews', getReviewsValidators, validate, getProductReviews);

module.exports = router;
