const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  title: { type: String, require: true },
  price: { type: Number, require: true },
  description: { type: String, require: true },
  Image: { type: [String], require: true },
});
module.exports = mongoose.model("Product", productSchema);
