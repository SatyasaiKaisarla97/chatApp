require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const cors = require("cors");
const loginandsignupRoutes = require("./routes/loginandsignupRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);
app.use(express.static("public"));

app.use("/", loginandsignupRoutes);
app.use("/user", forgotPasswordRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

sequelize
  .sync({ force: false })
  .then((res) => {
    app.listen(process.env.PORT || 3000);
    console.log(`Server running at port ${process.env.PORT}/`);
  })
  .catch((err) => console.log(err));
