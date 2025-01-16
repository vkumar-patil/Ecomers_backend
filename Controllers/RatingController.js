// In your Product Controller (or wherever ratings need to be aggregated):
exports.getAverageRating = async (productId) => {
    try {
      const ratings = await Rating.find({ productId });
      if (ratings.length === 0) return 0;
  
      const totalRatings = ratings.length;
      const sumRatings = ratings.reduce((acc, curr) => acc + curr.rating, 0);
      return sumRatings / totalRatings;
    } catch (error) {
      throw new Error("Error calculating average rating");
    }
  };
  