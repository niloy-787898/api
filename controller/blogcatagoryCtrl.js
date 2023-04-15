const BlogCatagory = require("../models/blogcatgoryModel");
const asyncHandler = require("express-async-handler");
const { mongoValidateId } = require("../utils/validateMongoDB");

//create new Catagory
const createBlogCatagory = asyncHandler(async (req, res) => {
  try {
    const newBlogCatagory = await BlogCatagory.create(req.body);
    res.json(newBlogCatagory);
  } catch (error) {
    throw new Error(error);
  }
});

//update a BlogCatagory
const updateSingleBlogCatagory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const updatedBlogCatagory = await BlogCatagory.findOneAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedBlogCatagory);
  } catch (error) {
    throw new Error(error);
  }
});

//delete Blog
const deleteSingleBlogCatagory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const deleteBlogCatagory = await BlogCatagory.findOneAndDelete(id);
    res.json(deleteBlogCatagory);
  } catch (error) {
    throw new Error(error);
  }
});

//get singleBlogCatagory by id
const getSingleBlogCatagory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const findBlogCatagoryById = await BlogCatagory.findById(id);
    res.json(findBlogCatagoryById);
  } catch (error) {
    throw new Error(error);
  }
});

//get ALL BlogCatagory
const getAllBlogCatagory = asyncHandler(async (req, res) => {
  try {
    const allBlogCatagory = await BlogCatagory.find();
    res.json(allBlogCatagory);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlogCatagory,
  updateSingleBlogCatagory,
  deleteSingleBlogCatagory,
  getSingleBlogCatagory,
  getAllBlogCatagory
};
