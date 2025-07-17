const path = require('path');

// Birden fazla klasör ismini birleştirip düzgün bir dosya yolu oluşturur.
const yol = path.join('users', 'avatars', 'avatar.png');
console.log('join: ', yol);

// Mutlak (absolute) dosya yolunu üretir.
const tamYol = path.resolve('users', 'avatars', 'avatar.png');
console.log('resolve: ', tamYol);

// basename - Dosya yolundan sadece dosya adını alır
const dosyaAdi = path.basename("users/avatars/avatar.png")
console.log(dosyaAdi);

const klasorYolu = path.dirname("users/avatars/avatar.png");
console.log(klasorYolu);

const uzanti = path.extname(dosyaAdi)
console.log(uzanti);

console.log(__dirname);
console.log(__filename);





