const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
// Kullanıcılar bellekte tutulacak
const users = [];

// Auth middleware
function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token gerekli" });
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Geçersiz token" });
      req.user = user;
      next();
    });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
}

// Kayıt işlemi
app.post("/register", (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Kullanıcı adı ve şifre gerekli" });
    if (users.find((u) => u.username === username)) {
      return res.status(409).json({ message: "Kullanıcı zaten var" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ username, password: hashedPassword });
    res.json({ message: "Kayıt başarılı" });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Giriş yap (Login)
app.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);
    if (!user) return res.status(401).json({ message: "Kullanıcı bulunamadı" });
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Şifre hatalı" });
    }
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Protected route
app.get("/profile", authenticateToken, (req, res) => {
  try {
    res.json({ message: `Hoş geldin, ${req.user.username}` });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
