const express = require("express");
const {
  createColor,
  updateSingleColor,
  getSingleColor,
  getAllColor,
  deleteSingleColor,
} = require("../controller/colorCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createColor);
router.put("/:id", authMiddleware, isAdmin, updateSingleColor);

router.get("/:id", getSingleColor);
router.get("/", getAllColor);

router.delete("/:id", authMiddleware, isAdmin, deleteSingleColor);

module.exports = router;
