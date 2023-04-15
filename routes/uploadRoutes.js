const express = require("express");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  uploadPhoto,
  productImageResize,
} = require("../middlewares/uploadImages");
const { uploadImages, deleteImages } = require("../controller/uploadCtrl");
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImageResize,
  uploadImages
);
router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);

module.exports = router;
