const cart = require("../Model/CartModel");
const Product = require("../Model/AdminModel");

exports.addToCart = async (req, res) => {
  try {
    const { userID, productID, quantity } = req.body;

    if (
      !userID ||
      !productID ||
      typeof quantity !== "number" ||
      quantity <= 0
    ) {
      return res
        .status(400)
        .send({ message: "Invalid input. All fields are required and valid." });
    }

    // Verify product exists
    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    let cartdata = await cart.findOne({ userID }).populate("items.productID");
    if (!cartdata) {
      cartdata = new cart({ userID, items: [] });
    }

    const itemIndex = cartdata.items.findIndex(
      (item) => item.productID.toString() === productID
    );

    if (itemIndex > -1) {
      cartdata.items[itemIndex].quantity += quantity;
    } else {
      cartdata.items.push({ productID, quantity });
    }

    await cartdata.save();
    res.status(200).send({ message: "Cart updated successfully", cartdata });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).send({ message: "Failed to update cart", error });
  }
};

exports.getCart = async (req, res) => {
  const cartDATA = await cart.findOne({ userID: req.user._id });
  res.status(200).send({ message: "data get successful", data: cartDATA });
};
