const express = require("express");
const router = express.Router();
const AdminController = require("../Controllers/AdminController");
const upload = require("../Midlware/Multer");
router.post("/AddProduct", upload.array("Image", 10), AdminController.RowData);
router.get("/getProduct", upload.array("Image", 10), AdminController.getData);

module.exports = router;
