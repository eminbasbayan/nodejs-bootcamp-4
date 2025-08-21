const express = require('express');
const { 
  createOrder, 
  getMyOrders, 
  getAllOrders, 
  updateOrderStatus 
} = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createOrderValidators,
  updateOrderStatusValidators,
  paginationValidators
} = require('../validators/order.validators');

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Sipariş oluştur
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - shippingAddress
 *               - payment
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product
 *                     - quantity
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: Ürün ID
 *                       example: "64a123456789abcdef123456"
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *               shippingAddress:
 *                 type: object
 *                 required:
 *                   - fullName
 *                   - phone
 *                   - addressLine
 *                   - city
 *                   - country
 *                   - postalCode
 *                 properties:
 *                   fullName:
 *                     type: string
 *                     example: "Ali Veli"
 *                   phone:
 *                     type: string
 *                     example: "+905551234567"
 *                   addressLine:
 *                     type: string
 *                     example: "Atatürk Caddesi No: 123"
 *                   city:
 *                     type: string
 *                     example: "İstanbul"
 *                   country:
 *                     type: string
 *                     example: "Türkiye"
 *                   postalCode:
 *                     type: string
 *                     example: "34000"
 *               payment:
 *                 type: object
 *                 required:
 *                   - method
 *                 properties:
 *                   method:
 *                     type: string
 *                     enum: [cod, card]
 *                     example: "cod"
 *                     description: "Ödeme yöntemi - cod: kapıda ödeme, card: kart"
 *     responses:
 *       201:
 *         description: Sipariş başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Order'
 *       400:
 *         description: Hatalı istek
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
 */

/**
 * @swagger
 * /api/orders/my:
 *   get:
 *     summary: Kendi siparişlerini listele
 *     tags: [Orders]
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
 *     responses:
 *       200:
 *         description: Siparişler başarıyla listelendi
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
 *                         orders:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Order'
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
 *       401:
 *         description: Yetkisiz erişim
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Tüm siparişleri listele (Admin)
 *     tags: [Orders]
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
 *     responses:
 *       200:
 *         description: Siparişler başarıyla listelendi
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
 *                         orders:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Order'
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
 * /api/orders/{id}:
 *   patch:
 *     summary: Sipariş durumunu güncelle (Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sipariş ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *                 example: "processing"
 *                 description: Yeni sipariş durumu
 *     responses:
 *       200:
 *         description: Sipariş durumu başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Order'
 *       400:
 *         description: Hatalı istek
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Yetkisiz erişim
 *       403:
 *         description: Yetki yok (Sadece admin)
 *       404:
 *         description: Sipariş bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Routes
router.post('/', authenticate, createOrderValidators, validate, createOrder);
router.get('/my', authenticate, paginationValidators, validate, getMyOrders);
router.get('/', authenticate, authorize('admin'), paginationValidators, validate, getAllOrders);
router.patch('/:id', authenticate, authorize('admin'), updateOrderStatusValidators, validate, updateOrderStatus);

module.exports = router;
