const { default: mongoose } = require("mongoose");
const MONGO_DB = process.env.DATABASE_URL

const dbConnect = () => {
  try {
    const connection = mongoose.connect(MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("database connected Succesfully");
  } catch (error) {
    console.log("datbase Error");
  }
};
module.exports = dbConnect;


