const mongoose = require("mongoose");

const connectDB = async () => {
  const connect = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log(`Mongo DB connected:${connect.connection.host}`);
};

module.exports = connectDB;
