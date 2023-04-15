const express = require("express");
const {
  createBrand,
  updateSingleBrand,
  getSingleBrand,
  getAllBrand,
  deleteSingleBrand,
} = require("../controller/brandCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBrand);
router.put("/:id", authMiddleware, isAdmin, updateSingleBrand);

router.get("/:id", getSingleBrand);
router.get("/", getAllBrand);

router.delete("/:id", authMiddleware, isAdmin, deleteSingleBrand);

module.exports = router;
