const express = require("express");
const path = require("path");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// İyzico Checkout Form oluştur
router.post("/checkout/create", paymentController.createCheckoutForm);

// İyzico Checkout Form callback
router.post("/checkout/callback", paymentController.handleCheckoutCallback);

// Başarılı ödeme sayfası
router.get("/checkout/success", (req, res) => {
  const { paymentId, amount } = req.query;
  res.send(`
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ödeme Başarılı</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          background: linear-gradient(135deg, #4CAF50, #8BC34A);
          margin: 0; padding: 20px; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          min-height: 100vh;
        }
        .container { 
          background: white; 
          padding: 40px; 
          border-radius: 15px; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          text-align: center; 
          max-width: 500px;
        }
        .success-icon { 
          font-size: 4rem; 
          color: #4CAF50; 
          margin-bottom: 20px;
        }
        h1 { 
          color: #2E7D32; 
          margin-bottom: 20px;
        }
        .details { 
          background: #E8F5E8; 
          padding: 20px; 
          border-radius: 10px; 
          margin: 20px 0;
        }
        .back-btn {
          background: #4CAF50;
          color: white;
          padding: 12px 30px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          margin-top: 20px;
        }
        .back-btn:hover { background: #45a049; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="success-icon">✅</div>
        <h1>Ödeme Başarılı!</h1>
        <p>Ödemeniz başarıyla tamamlanmıştır.</p>
        <div class="details">
          <p><strong>Ödeme ID:</strong> ${paymentId || 'N/A'}</p>
          <p><strong>Tutar:</strong> ₺${amount || 'N/A'}</p>
          <p><strong>Durum:</strong> <span style="color: #4CAF50;">✓ Tamamlandı</span></p>
        </div>
        <button class="back-btn" onclick="window.location.href='/'">Ana Sayfaya Dön</button>
      </div>
    </body>
    </html>
  `);
});

// Başarısız ödeme sayfası
router.get("/checkout/failure", (req, res) => {
  const { error } = req.query;
  res.send(`
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ödeme Başarısız</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          background: linear-gradient(135deg, #f44336, #ff5722);
          margin: 0; padding: 20px; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          min-height: 100vh;
        }
        .container { 
          background: white; 
          padding: 40px; 
          border-radius: 15px; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          text-align: center; 
          max-width: 500px;
        }
        .error-icon { 
          font-size: 4rem; 
          color: #f44336; 
          margin-bottom: 20px;
        }
        h1 { 
          color: #c62828; 
          margin-bottom: 20px;
        }
        .details { 
          background: #ffebee; 
          padding: 20px; 
          border-radius: 10px; 
          margin: 20px 0;
        }
        .back-btn {
          background: #f44336;
          color: white;
          padding: 12px 30px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          margin-top: 20px;
        }
        .back-btn:hover { background: #d32f2f; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="error-icon">❌</div>
        <h1>Ödeme Başarısız</h1>
        <p>Ödeme işlemi tamamlanamadı.</p>
        <div class="details">
          <p><strong>Hata:</strong> ${decodeURIComponent(error || 'Bilinmeyen hata')}</p>
          <p><strong>Durum:</strong> <span style="color: #f44336;">✗ Başarısız</span></p>
        </div>
        <button class="back-btn" onclick="window.location.href='/'">Tekrar Dene</button>
      </div>
    </body>
    </html>
  `);
});

// Direkt ödeme route'u (eski sistem)
router.post("/payment", paymentController.makePayment);

module.exports = router;
