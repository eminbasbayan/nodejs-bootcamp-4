const express = require('express');
const { getProfile, getAllUsers, updateUserRole } = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { updateRoleValidators } = require('../validators/user.validators');

const router = express.Router();

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Kullanıcı profilini getir
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı profili başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Yetkisiz erişim
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Tüm kullanıcıları listele (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         name: role
 *         schema:
 *           type: string
 *           enum: [customer, admin]
 *         description: Role göre filtreleme
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: İsim veya e-posta ile arama
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [name, -name, email, -email, createdAt, -createdAt]
 *           default: -createdAt
 *         description: Sıralama kriteri
 *     responses:
 *       200:
 *         description: Kullanıcılar başarıyla listelendi
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
 *                         users:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/User'
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
 *                             totalCustomers:
 *                               type: integer
 *                               description: Toplam müşteri sayısı
 *                             totalAdmins:
 *                               type: integer
 *                               description: Toplam admin sayısı
 *       401:
 *         description: Yetkisiz erişim
 *       403:
 *         description: Yetki yok (Sadece admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Kullanıcı rolünü güncelle (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kullanıcı ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [customer, admin]
 *                 example: "admin"
 *                 description: Yeni kullanıcı rolü
 *     responses:
 *       200:
 *         description: Kullanıcı rolü başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Hatalı istek - Kendi rolünüzü değiştiremezsiniz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Yetkisiz erişim
 *       403:
 *         description: Yetki yok (Sadece admin)
 *       404:
 *         description: Kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Routes
router.get('/me', authenticate, getProfile);
router.get('/', authenticate, authorize('admin'), getAllUsers);
router.patch('/:id', authenticate, authorize('admin'), updateRoleValidators, validate, updateUserRole);

module.exports = router;
