const express = require("express");
const {
  createCoupon,
  updateSingleCoupon,
  deleteSingleCoupon,
  getSingleCoupon,
  getAllCoupon,
} = require("../controller/couponCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCoupon);
router.put("/:id", authMiddleware, isAdmin, updateSingleCoupon);

router.get("/:id", getSingleCoupon);
router.get("/", getAllCoupon);

router.delete("/:id", authMiddleware, isAdmin, deleteSingleCoupon);

module.exports = router;
