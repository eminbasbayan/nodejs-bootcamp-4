// Express ve Morgan modüllerini dahil ediyoruz
const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 3000;

//  NPM üzerindeki Log Middleware Kullanım Örneği
app.use(morgan("dev"));

// Middleware İşlenme Sırası
app.use((req, res, next) => {
  console.log("Middleware 1 çalıştı");
  next();
});

app.use((req, res, next) => {
  console.log("Middleware 2 çalıştı");
  next();
});

// Veri alımı için GET metodu kullanılıyor
app.get("/user", (req, res) => {
  res.send("Hoş geldin!");
});

// User detaylarını almak için GET metodu kullanılıyor
app.get("/user/:username", (req, res) => {
  res.send(`User details for ${req.params.username}`);
});

// Yeni bir user oluşturma işlemi için POST metodu kullanılıyor
app.post("/user", (req, res) => {
  res.send("User created");
});

// Güncelleme işlemi için PUT metodu kullanılıyor
app.put("/user/:username", (req, res) => {
  res.send(`User with ID ${req.params.username} updated`);
});

// Silme işlemi için DELETE metodu kullanılıyor
app.delete("/user/:username", (req, res) => {
  res.send(`User with ID ${req.params.username} deleted`);
});

// 404 middleware: Tanımlı olmayan route'lar için
app.use((req, res, next) => {
  res.status(404).send("404 - Sayfa bulunamadı");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
