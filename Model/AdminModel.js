const mongoose = require("mongoose");
const insertDateSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.ObjectId },
  title: { type: String, require: true },
  price: { type: Number, require: true },
  description: { type: String, require: true },
  Image: { type: [String], require: true },
});
module.exports = mongoose.model("insertData", insertDateSchema);
