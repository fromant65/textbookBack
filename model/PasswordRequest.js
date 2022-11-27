const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passwordRequest = new Schema({
  username: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("PasswordRequest", passwordRequest);
