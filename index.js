const fs = require('node:fs');
const fsPromise = require("node:fs/promises")

// Dosya Yazma İşlemi
// fs.writeFile('fatura.txt', 'Merhaba async dünya!', (err) => {
//   if (err) throw err;

//   console.log('Dosya oluşturuldu ve yazıldı.');
// });

// try {
//   fs.writeFileSync('dosya-sync.txt', 'Merhaba sync dünya!');
// } catch (error) {
//   console.log(error);
// }

// fs.appendFile('dosya.txt', '\nYeni satır eklendi (async)', (err) => {
//   if (err) throw err;

//   console.log('Veri eklendi.');
// });

// try {
//   fs.appendFileSync('dosya-sync.txt', '\nYeni satır eklendi (sync)');
//   console.log('Sync veri eklendi!');
// } catch (error) {
//   console.log(error);
// }

// fs.readFile('dosya.txt', 'utf8', (err, data) => {
//   if (err) throw err;

//   console.log('Dosya içeriği:', data);
// });

// try {
//   const icerik = fs.readFileSync('dosya.txt', 'utf8');
//   console.log('Sync içeriği:', icerik);
// } catch (err) {
//   console.error(err);
// }

// fs.unlink('new.txt', (err) => {
//   if (err) throw err;
//   console.log('Dosya silindi.');
// });

// try {
//   fs.unlinkSync('new-sync.txt');
//   console.log('Dosya sync silindi.');
// } catch (err) {
//   console.error(err);
// }

// fs.rename('dosya.txt', 'yeni.txt', (err) => {
//   if (err) throw err;
//   console.log('Dosya adı değiştirildi.');
// });

// fs.mkdir('yeniklasor', (err) => {
//   if (err) throw err;
//   console.log('Klasör oluşturuldu.');
// });

// if (fs.existsSync('dosya-sync.txt')) {
//   console.log('Dosya mevcut.');
// } else {
//   console.log('Dosya bulunamadı.');
// }

// fs.stat('dosya-sync.txt', (err, stats) => {
//   if (err) throw err;
//   console.log('Bilgi:', stats);
// });

// fs.readdir('./', (err, dosyalar) => {
//   if (err) throw err;
//   console.log('Dosyalar:', dosyalar);
// });


// try {
//   await fsPromise.writeFile('dosya.txt', 'Merhaba async/await!');
//   console.log('Dosya oluşturuldu ve yazıldı.');
// } catch (err) {
//   console.error('Yazma hatası:', err);
// }