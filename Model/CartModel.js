const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  items: [
    {
      productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
  totalQuantity: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
});

module.exports = mongoose.model("Cart", CartSchema);
