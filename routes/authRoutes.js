const express = require("express");
const router = express.Router();
const {
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
  getAllOrder,
  updateOrderStatus,
  getOrders,
} = require("../controller/userCntrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/regester", createUser);
router.post("/forget-password-token", forgetPasswordToken);
router.put("/reset-password/:token", resetPasswordToken);

router.put("/update-password", authMiddleware, updatePassword);
router.post("/login", loginUser);
router.post("/login-admin", loginAdmin);
router.post("/cart", authMiddleware, userCart);
router.post("/cart/coupon", authMiddleware, applyCoupon);
router.post("/cart/create-order", authMiddleware, craeteOrder);

router.get("/all-user", getAllUser);
router.get("/refresh-token", handleRefreshToken);
router.get("/logout", logoutUser);
router.get("/all-wishlist", authMiddleware, getWishlist);
router.get("/all-cart", authMiddleware, getUserCart);
router.get("/get-orders", authMiddleware, getOrders);
router.get("/all-order", authMiddleware, isAdmin, getAllOrder);
router.get("/:id", authMiddleware, isAdmin, getSingleUser);

router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/:id", deleteUser);

router.put(
  "/order/update-order/:id",
  authMiddleware,
  isAdmin,
  updateOrderStatus
);
router.put("/edit-user", authMiddleware, updateUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);

module.exports = router;
