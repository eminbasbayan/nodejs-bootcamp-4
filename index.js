// const EventEmitter = require('node:events');
// const myEmitter = new EventEmitter();

// // Olay dinleyicisini tanımlıyoruz
// myEmitter.on('zilCaldi', () => {
//   console.log('Kapıyı Aç!');
// });

// // Olayı tetikliyoruz!
// myEmitter.emit("zilCaldi")

/* ****************** */

// const EventEmitter = require('node:events');
// const siparis = new EventEmitter();

// siparis.once('siparisGeldi', (isim, miktar) => {
//   console.log(`${miktar} adet ${isim} hazırla!`);
// });

/* ****************** */

// const EventEmitter = require('node:events');
// const app = new EventEmitter();

// app.on("error", (err)=>{
//     console.log("Hata oluştu:", err.message);

// })

// app.emit("error", new Error("Veritabanı bağlantısı yok!"))

/* ****************** */

// const EventEmitter = require('node:events');
// const eposta = new EventEmitter();

// const email = "user@example.com"

// eposta.on('gonderildi', (email) => {
//   console.log('E-posta gönderildi!', email);
// });

// eposta.on('gonderildi', (email) => {
//   const adminEposta = 'eminbasbayan@bilgentech.com';
//   if (email === adminEposta) {
//     console.log('Kayıt loglandı!', email);
//   }
// });

// eposta.emit('gonderildi', email);

/* ****************** */

const PizzaShop = require('./PizzaShop');
const pizzaShop = new PizzaShop();

const DrinkMachine = require('./DrinkMachine');
const drinkMachine = new DrinkMachine();

pizzaShop.on('order', (size, topping) => {
  console.log(`Sipariş alındı! ${size} boyutunda, ${topping} malzemeli pizza!`);
});

pizzaShop.on('order', (size, topping) => {
  drinkMachine.serveDrink(size);
});

pizzaShop.placeOrder('large', 'mantar');
pizzaShop.displayOrderNumber();
