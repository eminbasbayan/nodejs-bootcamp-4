const express = require('express');
const app = express();
const port = 3000;


// Veri alımı için GET metodu kullanılıyor
app.get('/user', (req, res) => {
  res.send('Hoş geldin!');
});

// User detaylarını almak için GET metodu kullanılıyor
app.get('/user/:username', (req, res) => {
  res.send(`User details for ${req.params.username}`);
});

// Yeni bir user oluşturma işlemi için POST metodu kullanılıyor
app.post("/user", (req, res) => {
  res.send('User created');
});


// Güncelleme işlemi için PUT metodu kullanılıyor
app.put('/user/:username', (req, res) => {
  res.send(`User with ID ${req.params.username} updated`);
});

// Silme işlemi için DELETE metodu kullanılıyor
app.delete('/user/:username', (req, res) => {
  res.send(`User with ID ${req.params.username} deleted`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
