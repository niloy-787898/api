const express = require("express");
const {
  createBlogCatagory,
  updateSingleBlogCatagory,
  getSingleBlogCatagory,
  deleteSingleBlogCatagory,
  getAllBlogCatagory,
} = require("../controller/blogcatagoryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlogCatagory);
router.put("/:id", authMiddleware, isAdmin, updateSingleBlogCatagory);

router.get("/:id", getSingleBlogCatagory);
router.get("/", getAllBlogCatagory);

router.delete("/:id", authMiddleware, isAdmin, deleteSingleBlogCatagory);

module.exports = router;
