const { generateToken } = require("../config/jsonWebToken");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const { mongoValidateId } = require("../utils/validateMongoDB");
const { genarateeRfreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto");
const uniqid = require("uniqid");
const { json } = require("body-parser");

//regester new user
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exist");
  }
});

//login user function
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email: email });

  if (findUser && (await findUser.isPasswordmatched(password))) {
    const refreshToken = await genarateeRfreshToken(findUser?.id);
    const updateUser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      {
        naw: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      id: findUser?.id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?.id),
    });
  } else {
    throw new Error("Invalid credential");
  }
});

//login Admin function
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not Authorised");
  if (findAdmin && (await findAdmin.isPasswordmatched(password))) {
    const refreshToken =  genarateeRfreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

//reftsh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.refreshToken)
    throw new Error("No refresh Token Found Or Not Matched In cookie");

  const refreshToken = cookie.refreshToken;

  const user = await User.findOne({
    refreshToken,
  });
  if (!user) throw new Error("No Refersh In DB");
  jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("Can't Refresh User Token");
    }
    const accesToken = genarateeRfreshToken(user?.id);
    res.json({ accesToken });
  });
});

//logout User
const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken)
    throw new Error("No refresh Token Found Or Not Matched In cookie");
  const refreshToken = cookie.refreshToken;

  const user = await User.findOne({
    refreshToken,
  });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204);
});

// Update a User
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  mongoValidateId(id);
  try {
    const UpdateUserInfo = await User.findByIdAndUpdate(
      id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(UpdateUserInfo);
  } catch (error) {
    throw new Error(error);
  }
});

//save Address
const saveAddress = asyncHandler(async (req, res) => {
  const { id } = req.user;
  mongoValidateId(id);
  try {
    const UpdateUserInfo = await User.findByIdAndUpdate(
      id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(UpdateUserInfo);
  } catch (error) {
    throw new Error(error);
  }
});

//get ALL User
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUser = await User.find().populate("wishlist");
    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

//get single id
const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const getUserById = await User.findById(id);
    res.json({
      getUserById,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Delete User
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const deleteUserById = await User.findByIdAndDelete(id);
    res.json({
      deleteUserById,
    });
  } catch (error) {
    throw new Error(error);
  }
});
//block user
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const blockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        naw: true,
      }
    );
    res.json(blockUser);
  } catch (error) {
    throw new Error(error);
  }
});
//unblock user
const unBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const unBlockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        naw: true,
      }
    );
    res.json(unBlockUser);
  } catch (error) {
    throw new Error(error);
  }
});

//update Password
const updatePassword = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { password } = req.body;
  mongoValidateId(id);
  const user = await User.findById(id);
  if (password) {
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword);
  } else {
    res.json(user);
  }
});

//forget password
const forgetPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User Not found with this email");
  }
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetUrl = `Hi , Please follow this link to reset your password. the link is valid 10 minute till now. <a href="http://localhost:5000/api/user/reset-password/${token}">Click here</a>`;

    //create data object for email
    const data = {
      to: email,
      subject: "Forget Password Link",
      text: "Hey User",
      html: resetUrl,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

//reset password token
const resetPasswordToken = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpired: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token Expired, Please Try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpired = undefined;
  user.save();
  res.json(user);
});

//get all wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const { id } = req.user;
  mongoValidateId(id);
  try {
    const findUser = await User.findById(id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

//user Cart
const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { id } = req.user;
  mongoValidateId(id);
  try {
    let products = [];
    const user = await User.findById(id);
    //check if user is already in cart
    const aleadyExistCart = await Cart.findOne({ orderBy: user.id });
    console.log(aleadyExistCart);
    // if (aleadyExistCart) {
    //   aleadyExistCart.remove();
    // }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i].id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i].id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    let newcart = await new Cart({
      products,
      cartTotal,
      orderBy: user.id,
    }).save();
    res.json(newcart);
    console.log(products, cartTotal);
  } catch (error) {
    throw new Error(error);
  }
});

//get all cart
const getUserCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  mongoValidateId(id);
  try {
    const cart = await Cart.findOne({ orderBy: id }).populate(
      "products.product"
      // "id title price totalAfterDiscount"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

//remove from cart
const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  mongoValidateId(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderBy: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

//apply coupon
const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  mongoValidateId(_id);
  try {
    const validCoupon = await Coupon.findOne({ name: coupon });
    console.log(validCoupon);
    if (validCoupon === null) {
      throw new Error("Invalid Coupon");
    }
    const user = await User.findOne({ _id });
    let { cartTotal } = await Cart.findOne({ orderBy: user._id }).populate(
      "products.product"
    );
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    await Cart.findOneAndUpdate(
      { orderBy: user._id },
      { totalAfterDiscount },
      {
        new: true,
      }
    );
    res.json(totalAfterDiscount);
  } catch (error) {
    throw new Error(error);
  }
});

//create order
const craeteOrder = asyncHandler(async (req, res) => {
  const { cashOnDelevary, couponApplied } = req.body;
  const { _id } = req.user;
  mongoValidateId(_id);
  try {
    if (!cashOnDelevary) throw new Error("Create Cash On Delevary Failed");
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderBy: user._id });
    let finalAmmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmmount = userCart.totalAfterDiscount;
    } else {
      finalAmmount = userCart.cartTotal;
    }
    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmmount,
        status: "Cash On Delevary",
        created: Date.now,
        currency: "usd",
      },
      orderBy: user._id,
      orderStatus: "Cash On Delevary",
    }).save();

    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });

    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "success" });
  } catch (error) {
    throw new Error(error);
  }
});

//get sigle order
const getOrders = asyncHandler(async (req, res) => {
  const { id } = req.user;
  mongoValidateId(id);
  try {
    const userorders = await Order.findOne({ orderBy: id })
      .populate("products.product")
      .populate("orderBy")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
});

//get all order
const getAllOrder = asyncHandler(async (req, res) => {

  try {
    const userOrder = await Order.find()
      .populate("products.product")
      .populate("orderBy")
      .exec();
    res.json(userOrder);
  } catch (error) {
    throw new Error(error);
  }

});

//update Order
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const findOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent:{
          status:status,
        }
      },
      { new: true }
    );
    res.json(findOrder)
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logoutUser,
  updatePassword,
  forgetPasswordToken,
  resetPasswordToken,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  craeteOrder,
  getOrders,
  getAllOrder,
  updateOrderStatus,
};
