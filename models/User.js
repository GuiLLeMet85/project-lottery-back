const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  userPicture: {
    type: String,
    default: 'https://res.cloudinary.com/dnxl4zry6/image/upload/v1663025902/userProfile/es9pkrvyvdv2dtzotvjk.png'
  },
  phoneNum: {
    type: Number
  },
  role: {
    type: String,
    default: 'user'
  }
},
  {
    timestamps: true
  });

module.exports = model("User", userSchema);