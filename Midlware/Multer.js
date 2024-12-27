const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Ensure path is correct
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append a unique timestamp to avoid name conflicts
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
