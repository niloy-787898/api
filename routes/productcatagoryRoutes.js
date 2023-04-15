const express = require("express");
const {
  createProductCatagory,
  updateSingleProductCatagory,
  getSingleProductCatagory,
  deleteSingleProductCatagory,
  getAllProductCatagory,
} = require("../controller/productcatagoryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProductCatagory);
router.put("/:id", authMiddleware, isAdmin, updateSingleProductCatagory);

router.get("/:id", getSingleProductCatagory);
router.get("/", getAllProductCatagory);

router.delete("/:id", authMiddleware, isAdmin, deleteSingleProductCatagory);

module.exports = router;
