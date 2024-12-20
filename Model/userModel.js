const { default: mongoose } = require("mongoose");
const UserSchema = mongoose.Schema({
  username: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  Admin: { type: Boolean, default: false },
});
module.exports = mongoose.model("User", UserSchema);
