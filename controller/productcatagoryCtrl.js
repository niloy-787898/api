const ProductCatagory = require("../models/productcatgoryModel");
const asyncHandler = require("express-async-handler");
const { mongoValidateId } = require("../utils/validateMongoDB");

//create new Catagory
const createProductCatagory = asyncHandler(async (req, res) => {
  try {
    const newProductCatagory = await ProductCatagory.create(req.body);
    res.json(newProductCatagory);
  } catch (error) {
    throw new Error(error);
  }
});

//update a ProductCatagory
const updateSingleProductCatagory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const updatedProductCatagory = await ProductCatagory.findOneAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedProductCatagory);
  } catch (error) {
    throw new Error(error);
  }
});

//delete Blog
const deleteSingleProductCatagory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const deleteProductCatagory = await ProductCatagory.findOneAndDelete(id);
    res.json(deleteProductCatagory);
  } catch (error) {
    throw new Error(error);
  }
});

//get singleProductCatagory by id
const getSingleProductCatagory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const findProductCatagoryById = await ProductCatagory.findById(id);
    res.json(findProductCatagoryById);
  } catch (error) {
    throw new Error(error);
  }
});

//get ALL ProductCatagory
const getAllProductCatagory = asyncHandler(async (req, res) => {
  try {
    const allProductCatagory = await ProductCatagory.find();
    res.json(allProductCatagory);
  } catch (error) {
    throw new Error(error);
  }
});


module.exports = {
  createProductCatagory,
  updateSingleProductCatagory,
  deleteSingleProductCatagory,
  getSingleProductCatagory,
  getAllProductCatagory
};
