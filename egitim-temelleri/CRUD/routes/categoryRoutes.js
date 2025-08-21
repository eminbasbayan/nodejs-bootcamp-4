const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

//tüm kategorileri getir
router.get("/", getAllCategories);

// ID ile kategorileri çağır
router.get("/:id", getCategoryById);

// yeni kategori oluştur
router.post("/", createCategory);

// kategori güncelle
router.put("/:id", updateCategory);

// kategorileri sil
router.delete("/:id", deleteCategory);

module.exports = router;
