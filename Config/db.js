const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.mongoDB_URI);
    console.log("mongodb connected", connect.Connection.host);
  } catch (error) {
    console.error(error);
  }
};
module.exports = connectDB;
