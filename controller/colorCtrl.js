const Color = require("../models/colorsModel");
const asyncHandler = require("express-async-handler");
const { mongoValidateId } = require("../utils/validateMongoDB");

//create new Color 
const createColor = asyncHandler(async (req, res) => {
  try {
    const newColor = await Color.create(req.body);
    res.json(newColor);
  } catch (error) {
    throw new Error(error);
  }
});

//update a Color
const updateSingleColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const updatedColor = await Color.findOneAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedColor);
  } catch (error) {
    throw new Error(error);
  }
});

//delete Color
const deleteSingleColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const deleteColor = await Color.findOneAndDelete(id);
    res.json(deleteColor);
  } catch (error) {
    throw new Error(error);
  }
});

//get singleColor by id
const getSingleColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const findColorById = await Color.findById(id);
    res.json(findColorById);
  } catch (error) {
    throw new Error(error);
  }
});

//get ALL Color
const getAllColor = asyncHandler(async (req, res) => {
  try {
    const allColor = await Color.find();
    res.json(allColor);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createColor,
  updateSingleColor,
  deleteSingleColor,
  getSingleColor,
  getAllColor
};
