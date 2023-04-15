const Enquary = require("../models/enqModel");
const asyncHandler = require("express-async-handler");
const { mongoValidateId } = require("../utils/validateMongoDB");

//create new Enquary 
const createEnquary = asyncHandler(async (req, res) => {
  try {
    const newEnquary = await Enquary.create(req.body);
    res.json(newEnquary);
  } catch (error) {
    throw new Error(error);
  }
});

//update a Enquary
const updateSingleEnquary = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const updatedEnquary = await Enquary.findOneAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedEnquary);
  } catch (error) {
    throw new Error(error);
  }
});

//delete Enquary
const deleteSingleEnquary = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const deleteEnquary = await Enquary.findOneAndDelete(id);
    res.json(deleteEnquary);
  } catch (error) {
    throw new Error(error);
  }
});

//get singleEnquary by id
const getSingleEnquary = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const findEnquaryById = await Enquary.findById(id);
    res.json(findEnquaryById);
  } catch (error) {
    throw new Error(error);
  }
});

//get ALL Enquary
const getAllEnquary = asyncHandler(async (req, res) => {
  try {
    const allEnquary = await Enquary.find();
    res.json(allEnquary);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createEnquary,
  updateSingleEnquary,
  deleteSingleEnquary,
  getSingleEnquary,
  getAllEnquary
};
