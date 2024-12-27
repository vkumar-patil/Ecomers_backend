const mongoose = require("mongoose");
const insertDateSchema = mongoose.Schema({
  title: { type: String, require: true },
  price: { type: String, require: true },
  description: { type: String, require: true },
  Image: { type: [String], require: true },
});
module.exports = mongoose.model("insertData", insertDateSchema);
