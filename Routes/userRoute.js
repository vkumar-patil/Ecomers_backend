const express = require("express");
const userController = require("../Controllers/userController");
const cartController = require("../Controllers/CartController");
const { authenticate } = require("../Midlware/Athontication");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.Login);
router.post("/add-to-cart", authenticate, cartController.addToCart);
router.get("/get-cart", authenticate, cartController.getCart);
router.put(
  "/update-cart/:productID",
  authenticate,
  cartController.updateCartProduct
);
router.put(
  "/delete-cart-item/:productID",
  authenticate,
  cartController.deleteCartItem
);

module.exports = router;
