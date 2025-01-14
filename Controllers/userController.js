const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../Model/userModel");
const jwt = require("jsonwebtoken");

const jwt_secret = process.env.JWT_SECRET;

// Register User
exports.register = async (req, res) => {
  try {
    const { username, contact, email, password } = req.body;

    if (!username || !contact || !email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      contact,
      email,
      password: hashPassword,
    });
    await newUser.save();

    res.status(201).send({ message: "User registration successful" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "User registration failed", error: error.message });
  }
};

// Login User
exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const payload = {
      userid: user.id,
      username: user.username,
      contact: user.contact,
      email: user.email,
      Admin: user.Admin,
    };

    const token = jwt.sign(payload, jwt_secret, { expiresIn: "1d" });

    res.status(200).send({
      message: "User login successful",
      token,
      user: payload,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "User login failed", error: error.message });
  }
};
