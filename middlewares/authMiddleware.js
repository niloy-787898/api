const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decodeToken?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Authorized Token Expired,Please Login Again", error);
    }
  } else {
    throw new Error("There is no token attached with header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    const {email} = req.user;
    const adminUser = await User.findOne({email});
    if(adminUser?.role !== "admin"){
        throw new Error("You are Not an Admin")
    }else{
        next();
    }
 
});

module.exports = { authMiddleware, isAdmin };
