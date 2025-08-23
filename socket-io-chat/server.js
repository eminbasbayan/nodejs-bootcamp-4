const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Statik dosyaları sun
app.use(express.static(__dirname));

// Ana sayfa route'u
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log("Bir kullanıcı bağlandı ✅");

  socket.on("chat message", (msg) => {
    console.log("Mesaj:", msg);

    // Tüm kullanıcılara gönder (broadcast)
    io.emit("chat message", msg);
  });

  // Ayrıldığında
  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı ❌");
  });
});

server.listen(3000, () => {
  console.log("Server çalışıyor: http://localhost:3000");
});
