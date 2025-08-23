const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Ödeme route’u
router.post("/pay", paymentController.makePayment);

module.exports = router;
