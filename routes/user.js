const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {isAuthenticated} = require('../middlewares/jwt')
const User = require("../models/User");
const fileUploader = require('../config/cloudinary.config');

// @desc    List all users
// @route   Get /user/usersList
// @access  Admin
router.get('/usersList', isAuthenticated, async (req,res,next)=>{
  try {
      const usersList = await User.find({});
      res.status(200).json({ data: usersList })
  } catch (error) {
      next(error)
  }
})

// @desc    List all users
// @route   Get /user/me
// @access  Private
router.get('/me', isAuthenticated, async (req,res,next)=>{
  const { _id } = req.payload;
  try {
      const user = await User.findById(_id);
      res.status(200).json({ data: user })
  } catch (error) {
      next(error)
  }
})

// @desc    Edit user from the Database
// @route   PUT /user/edit
// @access  Private

router.put('/edit', isAuthenticated, async (req, res, next) => {
  const { email, username } = req.body;
  // Check if email or password or name are provided as empty string 
  if (email === "" || username === "") {
    return next(new ErrorResponse('Please fill all the fields to register', 400))
  }
  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return next(new ErrorResponse('Email is not a valid format', 400))
  }
  try {
    const user = await User.findById(req.payload._id);
    if (!user) {
      next(new ErrorResponse('No user found', 404));
      return;
    } else {
      const updatedUser = await User.findByIdAndUpdate(req.payload._id, req.body, { new: true });
      res.status(200).json({ data: updatedUser })
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Delete a user
// @route   DELETE /user/delete
// @access  Private

router.delete('/delete', isAuthenticated, async (req, res, next) => {
  const userId = req.payload._id;
  try {
    const deleteUser = await User.findByIdAndDelete(userId);
      res.status(202).json({ data: deleteUser })
    }
    catch (error) {
    next(error);
  }
});

// @desc    Upload a picture to Cloudinary
// @route   POST /api/v1/user/upload
// @access  Private
router.post("/upload", fileUploader.single("userPicture"), (req, res, next) => {
  if (!req.file) {
    next(new ErrorResponse('Error uploading the image', 500));
    return;
  }
  res.json({ fileUrl: req.file.path });
});


module.exports = router;