const express = require('express');
const { 
  createCategory, 
  getCategories, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/category.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { 
  createCategoryValidators,
  updateCategoryValidators,
  deleteCategoryValidators
} = require('../validators/category.validators');

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Kategori oluştur (Admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: "Elektronik"
 *     responses:
 *       201:
 *         description: Kategori başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       401:
 *         description: Yetkisiz erişim
 *       403:
 *         description: Yetki yok (Sadece admin)
 *   get:
 *     summary: Kategorileri listele
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Kategoriler başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   patch:
 *     summary: Kategori güncelle (Admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kategori ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: "Elektronik Ürünleri"
 *     responses:
 *       200:
 *         description: Kategori başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       404:
 *         description: Kategori bulunamadı
 *   delete:
 *     summary: Kategori sil (Admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kategori ID
 *     responses:
 *       200:
 *         description: Kategori başarıyla silindi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Kategori bulunamadı
 */

// Routes
router.post('/', authenticate, authorize('admin'), createCategoryValidators, validate, createCategory);
router.get('/', getCategories);
router.patch('/:id', authenticate, authorize('admin'), updateCategoryValidators, validate, updateCategory);
router.delete('/:id', authenticate, authorize('admin'), deleteCategoryValidators, validate, deleteCategory);

module.exports = router;
