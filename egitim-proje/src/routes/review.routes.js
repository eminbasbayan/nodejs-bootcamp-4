const express = require('express');
const { createReview, getProductReviews } = require('../controllers/review.controller');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createReviewValidators,
  getReviewsValidators
} = require('../validators/review.validators');

const router = express.Router();

/**
 * @swagger
 * /api/products/{id}/reviews:
 *   post:
 *     summary: Ürüne yorum yap
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ürün ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *                 description: Puan (1-5 arası)
 *               comment:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 500
 *                 example: "Bu ürün gerçekten harika! Kalitesi çok iyi ve hızlı kargo."
 *                 description: Yorum metni
 *     responses:
 *       201:
 *         description: Yorum başarıyla eklendi
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Review'
 *       400:
 *         description: Hatalı istek - Zaten yorum yapılmış veya satın alınmamış ürün
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Yetkisiz erişim
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ürün bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     summary: Ürün yorumlarını listele
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ürün ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Sayfa başına öğe sayısı
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Puan ile filtreleme
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [createdAt, -createdAt, rating, -rating]
 *           default: -createdAt
 *         description: Sıralama kriteri
 *     responses:
 *       200:
 *         description: Yorumlar başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         reviews:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Review'
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             page:
 *                               type: integer
 *                             pages:
 *                               type: integer
 *                             total:
 *                               type: integer
 *                             limit:
 *                               type: integer
 *                         stats:
 *                           type: object
 *                           properties:
 *                             averageRating:
 *                               type: number
 *                               minimum: 0
 *                               maximum: 5
 *                               description: Ortalama puan
 *                             totalReviews:
 *                               type: integer
 *                               description: Toplam yorum sayısı
 *                             ratingDistribution:
 *                               type: object
 *                               properties:
 *                                 5:
 *                                   type: integer
 *                                 4:
 *                                   type: integer
 *                                 3:
 *                                   type: integer
 *                                 2:
 *                                   type: integer
 *                                 1:
 *                                   type: integer
 *       404:
 *         description: Ürün bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Routes
router.post('/:id/reviews', authenticate, createReviewValidators, validate, createReview);
router.get('/:id/reviews', getReviewsValidators, validate, getProductReviews);

module.exports = router;
