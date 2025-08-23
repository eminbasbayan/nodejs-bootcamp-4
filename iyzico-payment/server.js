const express = require("express");
const bodyParser = require("body-parser");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send(`
      <h2>iyzico Ödeme Test</h2>
      <form action="/api/pay" method="POST">
        <input type="text" name="cardNumber" placeholder="Kart Numarası" value="5528790000000008" /><br/>
        <input type="text" name="expireMonth" placeholder="Ay" value="12" /><br/>
        <input type="text" name="expireYear" placeholder="Yıl" value="2030" /><br/>
        <input type="text" name="cvc" placeholder="CVC" value="123" /><br/>
        <button type="submit">Ödeme Yap</button>
      </form>
    `);
});

// Ödeme rotaları
app.use("/api", paymentRoutes);

// Sunucu başlat
app.listen(3000, () => {
  console.log("Server çalışıyor: http://localhost:3000");
});
