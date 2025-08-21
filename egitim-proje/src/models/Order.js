const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: String,
  price: Number,
  quantity: { type: Number, default: 1 }
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine: String,
      city: String,
      country: String,
      postalCode: String
    },
    payment: {
      method: { type: String, enum: ['cod', 'card'], default: 'cod' },
      status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' }
    },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    totalAmount: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
