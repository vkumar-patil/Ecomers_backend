const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/db");
const userRoute = require("./Routes/userRoute");
const AdminRouts = require("./Routes/AdminRouts");
const app = express();
const fs = require("fs");
const path = require("path");
const port = 8001;

const uploadDir = path.join(__dirname, "./uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Uploads folder created successfully!");
}

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/Admin", AdminRouts);
connectDB();
app.listen(port, () => {
  console.log("http://localhost:8001");
});
