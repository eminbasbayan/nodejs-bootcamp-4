const EventEmitter = require('node:events');

class PizzaShop extends EventEmitter {
  constructor() {
    super();
    this.orderNumber = 0;
  }

  placeOrder(size, topping) {
    this.orderNumber++;
    this.emit('order', size, topping);
  }

  displayOrderNumber() {
    console.log(`Mevcut sipariş numarası: ${this.orderNumber}`);
  }
}

module.exports = PizzaShop;
