const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/db");
const userRoute = require("./Routes/userRoute");
const app = express();
const port = 8001;
app.use(cors());
app.use(express.json());
app.use("/api/user", userRoute);
connectDB();
app.listen(port, () => {
  console.log("http://localhost:8001");
});
