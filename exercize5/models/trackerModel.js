const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    _id: {
      type: String,
      required: true
    },
  });

const User = mongoose.model("User", userSchema);

module.exports = User;