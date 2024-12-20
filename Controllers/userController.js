const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../Model/userModel");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.jwt_secret;
exports.register = async (req, res) => {
  try {
    const { username, contact, email, password } = req.body;
    if (!username || !contact || !email || !password) {
      res.status(401).send({ message: "all feilds are requird" });
    }
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      res.status(401).send({ message: "user alredy exist" });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const newuser = await new User({
      username,
      contact,
      email,
      password: hashpassword,
    });
    await newuser.save();
    res.status(200).send("User Registration Done");
  } catch (error) {
    res.status(400).send({ message: "User registration fail", error: error });
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if ((!email, !password)) {
      res.status(401).send("invallid credencial");
    }
    const user = await User.findOne({ email });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).send("invalid password");
    }
    const token = jwt.sign(
      {
        userid: user.id,
        user: user.username,
        contact: user.contact,
        email: user.email,
        Admin: user.Admin,
      },
      jwt_secret,
      { expiresIn: "1hrs" }
    );
    if (user) {
      res.status(200).send({
        message: "user login successful",
        token,
        user: {
          userid: user.id,
          user: user.username,
          contact: user.contact,
          email: user.email,
          Admin: user.Admin,
        },
        success: true,
      });
    }
  } catch (error) {
    res.status(400).send({ message: "user login failed" });
  }
};
