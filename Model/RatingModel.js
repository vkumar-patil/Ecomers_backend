// models/Rating.js
// const mongoose = require("mongoose");

// const ratingSchema = new mongoose.Schema(
//   {
//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },
//     rating: {
//       type: Number,
//       required: true,
//       min: 1,
//       max: 5,
//     },
//     review: {
//       type: String,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Rating = mongoose.model("Rating", ratingSchema);

// module.exports = Rating;

const mongoose = require("mongoose");
const RateSchema = mongoose.Schema(
  {
    productID: { type: mongoose.Schema.ObjectId, ref: Product, require: true },
    userID: { type: String, require: true },
    rating: { type: Number, require: true, min: 1, max: 5 },
    review: { type: String, require: true },
  },
  { timestamps: true }
);
exports.module = mongoose.model("Rate", RateSchema);
