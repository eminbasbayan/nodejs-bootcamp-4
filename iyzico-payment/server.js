const express = require("express");
const bodyParser = require("body-parser");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>İyzico Ödeme Test</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 0; 
          padding: 20px; 
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .container { 
          background: white; 
          padding: 40px; 
          border-radius: 20px; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          max-width: 600px;
          text-align: center;
        }
        h1 { 
          color: #333; 
          margin-bottom: 30px;
          font-size: 2.5rem;
        }
        .option-card {
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 15px;
          padding: 30px;
          margin: 20px 0;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .option-card:hover {
          border-color: #4facfe;
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(79, 172, 254, 0.2);
        }
        .option-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 10px;
        }
        .option-description {
          color: #7f8c8d;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        .checkout-form {
          display: grid;
          gap: 15px;
          margin-top: 20px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        input {
          padding: 12px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
        }
        input:focus {
          outline: none;
          border-color: #4facfe;
        }
        .btn {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(79, 172, 254, 0.3);
        }
        .btn-secondary {
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
        }
        @media (max-width: 768px) {
          .form-row { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🛒 İyzico Ödeme Sistemi</h1>
        
        <!-- İyzico Checkout Form -->
        <div class="option-card" onclick="openCheckoutForm()">
          <div class="option-title">🎯 İyzico Checkout Form</div>
          <div class="option-description">
            İyzico'nun hazır ödeme sayfasını kullanarak güvenli ödeme yapın.
            <br><strong>Önerilen yöntem</strong> - Tam güvenlik ve tüm ödeme seçenekleri.
          </div>
          
          <div class="checkout-form">
            <input type="text" id="customerName" placeholder="Ad Soyad" value="Ali Veli" />
            <div class="form-row">
              <input type="email" id="customerEmail" placeholder="E-posta" value="ali@example.com" />
              <input type="tel" id="customerPhone" placeholder="Telefon" value="+905555555555" />
            </div>
            <input type="number" id="price" placeholder="Tutar (₺)" value="100" step="0.01" min="1" />
            <button class="btn" onclick="createCheckoutForm(event)">
              🔒 İyzico ile Güvenli Ödeme
            </button>
          </div>
        </div>

        <!-- Direkt API Ödemesi -->
        <div class="option-card">
          <div class="option-title">💳 Direkt API Ödemesi</div>
          <div class="option-description">
            Kart bilgilerini doğrudan girerek ödeme yapın.
            <br><em>Test amaçlı - Üretim ortamında önerilmez.</em>
          </div>
          
          <form action="/api/payment" method="POST" style="margin-top: 20px;">
            <div class="checkout-form">
              <input type="text" name="cardNumber" placeholder="Kart Numarası" value="5528790000000008" />
              <div class="form-row">
                <input type="text" name="expireMonth" placeholder="Ay (MM)" value="12" />
                <input type="text" name="expireYear" placeholder="Yıl (YYYY)" value="2030" />
              </div>
              <input type="text" name="cvc" placeholder="CVC" value="123" />
              <button type="submit" class="btn btn-secondary">
                💳 Direkt Ödeme Yap
              </button>
            </div>
          </form>
        </div>
      </div>

      <script>
        async function createCheckoutForm(event) {
          event.preventDefault();
          
          const customerName = document.getElementById('customerName').value;
          const customerEmail = document.getElementById('customerEmail').value;
          const customerPhone = document.getElementById('customerPhone').value;
          const price = document.getElementById('price').value;
          
          try {
            const response = await fetch('/api/checkout/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                customerName,
                customerEmail,
                customerPhone,
                price: price.toString(),
                paidPrice: price.toString()
              })
            });
            
            const data = await response.json();
            
            if (data.success) {
              // İyzico ödeme sayfasına yönlendir
              window.open(data.data.checkoutFormUrl, '_blank');
            } else {
              alert('Hata: ' + data.errorMessage);
            }
          } catch (error) {
            alert('Bağlantı hatası: ' + error.message);
          }
        }
        
        function openCheckoutForm() {
          // Card click handling if needed
        }
      </script>
    </body>
    </html>
  `);
});

// Ödeme rotaları
app.use("/api", paymentRoutes);

// Sunucu başlat
app.listen(3000, () => {
  console.log("Server çalışıyor: http://localhost:3000");
});
