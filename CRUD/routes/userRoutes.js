const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// Tüm kullanıcıları geitr
router.get("/", getAllUsers);

// ID ile kullanıcıları getir
router.get("/:id", getUserById);

// yeni kullanıcı oluştur
router.post("/", createUser);

// kullanıcıları güncelle
router.put("/:id", updateUser);

// kullanıcıları sil
router.delete("/:id", deleteUser);

module.exports = router;
