const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const { mongoValidateId } = require("../utils/validateMongoDB");

//create new Brand 
const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
});

//update a Brand
const updateSingleBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const updatedBrand = await Brand.findOneAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedBrand);
  } catch (error) {
    throw new Error(error);
  }
});

//delete Brand
const deleteSingleBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const deleteBrand = await Brand.findOneAndDelete(id);
    res.json(deleteBrand);
  } catch (error) {
    throw new Error(error);
  }
});

//get singleBrand by id
const getSingleBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const findBrandById = await Brand.findById(id);
    res.json(findBrandById);
  } catch (error) {
    throw new Error(error);
  }
});

//get ALL Brand
const getAllBrand = asyncHandler(async (req, res) => {
  try {
    const allBrand = await Brand.find();
    res.json(allBrand);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  updateSingleBrand,
  deleteSingleBrand,
  getSingleBrand,
  getAllBrand
};
