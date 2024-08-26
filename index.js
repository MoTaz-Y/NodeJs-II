const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
// const { url } = require("inspector");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/second";
const errorHandler = require("./utils/errorHandler");
const usersRouter = require("./routes/users.router");
const coursesRouter = require("./routes/courses.router");
const httpStatus = require("./utils/httpStatus");
const httpStatusText = require("./utils/httpStatusText");

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(
    mongoUrl /*, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }*/
  )
  .then((result) => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/users", usersRouter);
app.use("/api/courses", coursesRouter);

app.all("*", (req, res) => {
  res.status(httpStatus.NOT_FOUND).json({ message: httpStatusText.NOT_FOUND });
});

app.use(errorHandler);
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
