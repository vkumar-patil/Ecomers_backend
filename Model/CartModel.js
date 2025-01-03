const mongoose = require("mongoose");
const CartSchema = mongoose.Schema({
  userID: { type: String, require: true },
  items: [
    {
      productID: { type: mongoose.Schema.ObjectId, ref: "Product" },
      quantity: { type: Number, require: true },
    },
  ],
  updateDAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("cart", CartSchema);
