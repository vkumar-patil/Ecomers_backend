const Cart = require("../Model/CartModel");
const Product = require("../Model/AdminModel");

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { userid } = req.user; // Extracted from JWT
    const { productID, quantity } = req.body;

    console.log("Add to Cart Request:", { userid, productID, quantity });

    if (!productID || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).send({ message: "Invalid input data" });
    }

    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userID: userid }).populate(
      "items.productID"
    );
    console.log("Existing Cart:", cart);

    if (!cart) {
      cart = new Cart({ userID: userid, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productID.toString() === productID
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productID, quantity });
    }

    console.log("Updated Cart Before Save:", cart);

    await cart.save();
    res.status(200).send({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res
      .status(500)
      .send({ message: "Failed to update cart", error: error.message });
  }
};

// Get Cart
exports.getCart = async (req, res) => {
  try {
    const { userid } = req.user;

    const cart = await Cart.findOne({ userID: userid }).populate(
      "items.productID"
    );
    console.log("Fetched Cart:", cart);

    if (!cart) {
      return res.status(404).send({ message: "Cart not found" });
    }

    res.status(200).send({ message: "Cart fetched successfully", data: cart });
  } catch (error) {
    console.error("Error in getCart:", error);
    res
      .status(500)
      .send({ message: "Failed to fetch cart", error: error.message });
  }
};
