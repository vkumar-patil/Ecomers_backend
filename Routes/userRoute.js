const express = require("express");
const userController = require("../Controllers/userController");
const router = express.Router();
router.post("/Register", userController.register);
router.post("/login", userController.Login);
module.exports = router;
