const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const auth = require("../middlewares/auth");

// tüm ürünleri getir
router.get("/", getAllProducts);

// ID ile getir
router.get("/:id", getProductById);

// yeni ürün oluştur
router.post("/", auth, createProduct);

// ürünü güncelle
router.put("/:id", auth, updateProduct);

router.delete("/:id", auth, deleteProduct);

module.exports = router;
