// // In your Product Controller (or wherever ratings need to be aggregated):
// exports.getAverageRating = async (productId) => {
//     try {
//       const ratings = await Rating.find({ productId });
//       if (ratings.length === 0) return 0;

//       const totalRatings = ratings.length;
//       const sumRatings = ratings.reduce((acc, curr) => acc + curr.rating, 0);
//       return sumRatings / totalRatings;
//     } catch (error) {
//       throw new Error("Error calculating average rating");
//     }
//   };

const Rate = require("../Model/RatingModel");
exports.Addrating = async (req, res) => {
  try {
    const { productID, userID, rating, review } = req.body;
    const Rating = new Rate({ productID, userID, rating, review });
    await Rating.save();
    if (!Rating > 0) {
      res.status(400).send({ message: "rating not submited " });
    } else {
      res.status(200).send({ message: "rating Submited" });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
