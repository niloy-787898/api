const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const { mongoValidateId } = require("../utils/validateMongoDB");

//create new Coupon
const createCoupon = asyncHandler(async (req, res) => {
    try {
      const newCoupon = await Coupon.create(req.body);
      res.json(newCoupon);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  //update a Coupon
  const updateSingleCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    mongoValidateId(id);
    try {
      const updatedCoupon = await Coupon.findOneAndUpdate(
        id,
        req.body,
        {
          new: true,
        }
      );
      res.json(updatedCoupon);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  //delete Coupon
  const deleteSingleCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    mongoValidateId(id);
    try {
      const deleteCoupon = await Coupon.findOneAndDelete(id);
      res.json(deleteCoupon);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  //get singleCoupon by id
  const getSingleCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    mongoValidateId(id);
    try {
      const findCouponById = await Coupon.findById(id);
      res.json(findCouponById);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  //get ALL Coupon
  const getAllCoupon = asyncHandler(async (req, res) => {
    try {
      const allCoupon = await Coupon.find();
      res.json(allCoupon);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  module.exports = {
    createCoupon,
    updateSingleCoupon,
    deleteSingleCoupon,
    getSingleCoupon,
    getAllCoupon
  };
  