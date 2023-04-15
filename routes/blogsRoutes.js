const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createBlog,
  updateSingleBlog,
  getSingleBlog,
  getAllBlog,
  deleteSingleBlog,
  likeBlog,
  dislikeBlog,
  uploadImages,
} = require("../controller/blogCtrl");
const { uploadPhoto, blogImageResize } = require("../middlewares/uploadImages");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 2),
  blogImageResize,
  uploadImages
);
router.put("/likes", authMiddleware, likeBlog);
router.put("/dislikes", authMiddleware, dislikeBlog);

router.put("/:id", authMiddleware, isAdmin, updateSingleBlog);

router.get("/:id", getSingleBlog);
router.get("/", getAllBlog);

router.delete("/:id", authMiddleware, isAdmin, deleteSingleBlog);

module.exports = router;
