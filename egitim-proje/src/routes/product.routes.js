const express = require('express');
const { 
  createProduct, 
  getProducts, 
  getProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/product.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createProductValidators,
  updateProductValidators,
  getProductValidators,
  deleteProductValidators,
  getProductsValidators
} = require('../validators/product.validators');

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Ürünleri listele
 *     tags: [Products]
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
 *         name: category
 *         schema:
 *           type: string
 *         description: Kategori ID ile filtreleme
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum fiyat
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maksimum fiyat
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Ürün başlığında arama
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price, -price, createdAt, -createdAt, averageRating, -averageRating]
 *           default: -createdAt
 *         description: Sıralama kriteri
 *     responses:
 *       200:
 *         description: Ürünler başarıyla listelendi
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
 *                         products:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Product'
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
 *   post:
 *     summary: Ürün oluştur (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - stock
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "iPhone 15 Pro"
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 example: "Apple iPhone 15 Pro 256GB Doğal Titanyum"
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 54999.99
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 50
 *               category:
 *                 type: string
 *                 description: Kategori ID
 *                 example: "64a123456789abcdef123456"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *     responses:
 *       201:
 *         description: Ürün başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Ürün detayını getir
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ürün ID
 *     responses:
 *       200:
 *         description: Ürün detayı başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       404:
 *         description: Ürün bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     summary: Ürün güncelle (Admin)
 *     tags: [Products]
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
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "iPhone 15 Pro Max"
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 example: "Güncellenmiş ürün açıklaması"
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 59999.99
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 25
 *               category:
 *                 type: string
 *                 description: Kategori ID
 *                 example: "64a123456789abcdef123456"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 example: ["https://example.com/new-image1.jpg"]
 *     responses:
 *       200:
 *         description: Ürün başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
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
 *         description: Ürün bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Ürün sil (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ürün ID
 *     responses:
 *       200:
 *         description: Ürün başarıyla silindi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Yetkisiz erişim
 *       403:
 *         description: Yetki yok (Sadece admin)
 *       404:
 *         description: Ürün bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Routes
router.get('/', getProductsValidators, validate, getProducts);
router.get('/:id', getProductValidators, validate, getProduct);
router.post('/', authenticate, authorize('admin'), createProductValidators, validate, createProduct);
router.patch('/:id', authenticate, authorize('admin'), updateProductValidators, validate, updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProductValidators, validate, deleteProduct);

module.exports = router;
