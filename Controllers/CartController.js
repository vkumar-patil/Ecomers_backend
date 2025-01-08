const Cart = require("../Model/CartModel");
const Product = require("../Model/AdminModel");
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

    if (typeof product.price !== "number" || isNaN(product.price)) {
      return res.status(400).send({ message: "Invalid product price" });
    }

    let cart = await Cart.findOne({ userID: userid }).populate({
      path: "items.productID",
      select: "price", // Populate 'price' for calculations
    });

    if (!cart) {
      cart = new Cart({
        userID: userid,
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productID.toString() === productID.toString()
    );

    if (itemIndex > -1) {
      return res.status(200).send({
        message: "Product is already in the cart",
        cart,
      });
    }

    cart.items.push({ productID, quantity });

    cart.totalQuantity = cart.items.reduce((total, item) => {
      return total + (item.quantity || 0);
    }, 0);

    cart.totalPrice = cart.items.reduce((total, item) => {
      const itemPrice = item.productID?.price || 0; // Use fallback for price
      const itemQuantity = item.quantity || 0;
      console.log("Calculating Price:", { itemPrice, itemQuantity });
      return total + itemQuantity * itemPrice;
    }, 0);

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

// Add to Cart
// exports.addToCart = async (req, res) => {
//   try {
//     const { userid } = req.user; // Extracted from JWT
//     const { productID, quantity } = req.body;

//     console.log("Add to Cart Request:", { userid, productID, quantity });

//     if (!productID || typeof quantity !== "number" || quantity <= 0) {
//       return res.status(400).send({ message: "Invalid input data" });
//     }

//     const product = await Product.findById(productID);
//     if (!product) {
//       return res.status(404).send({ message: "Product not found" });
//     }

//     let cart = await Cart.findOne({ userID: userid }).populate(
//       "items.productID"
//     );
//     console.log("Existing Cart:", cart);

//     if (!cart) {
//       cart = new Cart({ userID: userid, items: [] });
//     }

//     const itemIndex = cart.items.findIndex(
//       (item) => item.productID.toString() === productID
//     );
//     if (itemIndex > -1) {
//       cart.items[itemIndex].quantity += quantity;
//     } else {
//       cart.items.push({ productID, quantity });
//     }

//     console.log("Updated Cart Before Save:", cart);

//     await cart.save();
//     res.status(200).send({ message: "Cart updated successfully", cart });
//   } catch (error) {
//     console.error("Error in addToCart:", error);
//     res
//       .status(500)
//       .send({ message: "Failed to update cart", error: error.message });
//   }
// };

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
// controllers/cartController.js

exports.updateCartProduct = async (req, res) => {
  try {
    const { productID } = req.params;
    const { quantity } = req.body;

    if (!productID) {
      return res
        .status(400)
        .json({ message: "Product ID is missing or invalid" });
    }
    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ userID: req.user.id }).populate({
      path: "items.productID",
      select: "price",
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.items.findIndex(
      (item) => item.productID._id.toString() === productID.toString()
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items[productIndex].quantity = quantity;

    // Recalculate total price and quantity
    cart.totalQuantity = cart.items.reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );
    cart.totalPrice = cart.items.reduce(
      (total, item) =>
        total + (item.quantity || 0) * (item.productID?.price || 0),
      0
    );

    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", data: cart });
  } catch (error) {
    console.error("Error updating cart product:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Delete a specific item from the cart
exports.deleteCartItem = async (req, res) => {
  try {
    const { productID } = req.params;
    const { userid } = req.user;

    if (!productID) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cart = await Cart.findOne({ userID: userid }).populate(
      "items.productID"
    );
    console.log("Fetched Cart:", cart);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filter out the item to delete
    const updatedItems = cart.items.filter(
      (item) => item.productID.toString() !== productID
    );

    if (updatedItems.length === cart.items.length) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items = updatedItems;

    // Recalculate totals
    cart.totalQuantity = updatedItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cart.totalPrice = updatedItems.reduce(
      (total, item) => total + item.quantity * (item.productID?.price || 0),
      0
    );

    await cart.save();
    res.status(200).json({ message: "Item removed from cart", data: cart });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
