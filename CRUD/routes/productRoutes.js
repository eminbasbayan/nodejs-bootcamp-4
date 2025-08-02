const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// tüm ürünleri getir
router.get("/", getAllProducts);

// ID ile getir
router.get("/:id", getProductById);

// yeni ürün oluştur
router.post("/", createProduct);

// ürünü güncelle
router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
