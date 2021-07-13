const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const auth = require("./routes/auth");
const projectRoute = require('./routes/projectRoute')

dotenv.config({ path: "./config/.env" });

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/projects',projectRoute)
app.use("/api/auth", auth);
app.use(errorHandler);

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
