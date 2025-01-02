const cart = require("../Model/CartModel");
const insertData = require("../Model/AdminModel");
exports.id = async (req, res) => {
  try {
    const { userID, productID, quantity } = req.body;
    const cartdata = await cart.findOne({ userID }).populate("items.productID");
    if (!cartdata) {
      cartdata = new cart({ userID, items: [] });
    }
    const itemindex = cartdata.items.findIndex(
      (item) => item.productID.toString() === productID
    );
    if (itemindex > -1) {
      cartdata.items[itemindex].quantity += quantity;
    } else {
      cartdata.items.push({ userID, productID, quantity });
    }
    await cartdata.save();
    res.status(200).send({ message: "cart create", cartdata });
  } catch (error) {
    res.status(500).send({ message: "cart not found", error });
  }
};
