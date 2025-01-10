const Cart = require("../Model/CartModel");
const Product = require("../Model/AdminModel");

exports.addToCart = async (req, res) => {
  try {
    const { userid } = req.user; // JWT से User ID
    const { productID, quantity } = req.body;

    console.log("Add to Cart Request:", { userid, productID, quantity });

    // Input Validation
    if (!productID || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).send({ message: "Invalid input data" });
    }

    // Check if Product exists
    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Fetch User's Cart
    let cart = await Cart.findOne({ userID: userid });

    if (!cart) {
      // अगर Cart नहीं है तो एक नया बनाएं
      cart = new Cart({
        userID: userid,
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
      });
    }

    // Check if Product is already in the Cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productID.toString() === productID.toString()
    );

    if (itemIndex > -1) {
      // Product पहले से Cart में है
      return res
        .status(200)
        .send({ message: "Product is already in the cart", cart });
    }

    // Add Product to Cart
    cart.items.push({ productID, quantity });

    // Recalculate Total Quantity and Price
    cart.totalQuantity = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * product.price,
      0
    );

    console.log("Updated Cart Before Save:", cart);

    // Save Updated Cart
    await cart.save();
    res
      .status(200)
      .send({ message: "Product added to cart successfully", cart });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res
      .status(500)
      .send({ message: "Failed to update cart", error: error.message });
  }
};

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

//     if (typeof product.price !== "number" || isNaN(product.price)) {
//       return res.status(400).send({ message: "Invalid product price" });
//     }

//     let cart = await Cart.findOne({ userID: userid }).populate({
//       path: "items.productID",
//       select: "price", // Populate 'price' for calculations
//     });

//     if (!cart) {
//       cart = new Cart({
//         userID: userid,
//         items: [],
//         totalQuantity: 0,
//         totalPrice: 0,
//       });
//     }

//     const itemIndex = cart.items.findIndex(
//       (item) => item.productID.toString() === productID.toString()
//     );

//     if (itemIndex > -1) {
//       return res.status(200).send({
//         message: "Product is already in the cart",
//         cart,
//       });
//     }

//     cart.items.push({ productID, quantity });

//     cart.totalQuantity = cart.items.reduce((total, item) => {
//       return total + (item.quantity || 0);
//     }, 0);

//     cart.totalPrice = cart.items.reduce((total, item) => {
//       const itemPrice = item.productID?.price || 0; // Use fallback for price
//       const itemQuantity = item.quantity || 0;
//       console.log("Calculating Price:", { itemPrice, itemQuantity });
//       return total + itemQuantity * itemPrice;
//     }, 0);

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
    const { productID } = req.params; // Extract product ID from URL parameters
    const { quantity } = req.body; // New quantity from the request body
    const { userid } = req.user; // User ID from JWT

    // Input validation
    if (!productID) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    if (typeof quantity !== "number" || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    // Fetch the user's cart
    const cart = await Cart.findOne({ userID: userid }).populate({
      path: "items.productID",
      select: "price", // Select only the price field
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart
    const productIndex = cart.items.findIndex(
      (item) => item.productID._id.toString() === productID
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Update the quantity
    cart.items[productIndex].quantity = quantity;

    // Recalculate totals
    cart.totalQuantity = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * (item.productID?.price || 0),
      0
    );

    // Save the updated cart
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

    console.log("productID:", productID);
    console.log("userID:", userid);

    const cart = await Cart.findOne({ userID: userid });
    if (!cart) {
      console.log("Cart not found for user:", userid);
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.items.findIndex(
      (item) => item.productID.toString() === productID
    );
    if (productIndex === -1) {
      console.log("Product not found in cart for productID:", productID);
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items.splice(productIndex, 1);
    await cart.save();
    console.log("Updated cart:", cart);

    return res.status(200).json({
      message: "Product removed from cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Error in deleting cart item:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.ClearCart = async (req, res) => {
  const { userid } = req.user;
  const cart = await Cart.findOne({ userID: userid });
  if (!cart) {
    res.status(400).send({ message: "Cart Not Found" });
  }
  cart.items = [];
  await cart.save();
  res.status(200).send({ message: "cart clear successfull" });
};
