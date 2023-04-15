const mongoose = require("mongoose");

const mongoValidateId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    throw new Error("This Id Is Not Valid Or Not Found");
  }
};
module.exports = {mongoValidateId}