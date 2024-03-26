require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const cors = require("cors");
const loginandsignupRoutes = require("./routes/loginandsignupRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");
const messageRoutes = require("./routes/messageRoutes");
const groupRoutes = require("./routes/groupRoutes");
const users = require("./models/users");
const ForgotPassword = require("./models/forgotpassword");
const messages = require("./models/messages");
const groups = require("./models/groups");

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
app.use("/users", messageRoutes);
app.use("/groups", groupRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

messages.belongsTo(users, { foreignKey: "userId", onDelete: "CASCADE" });
users.hasMany(messages, { foreignKey: "userId" });

messages.belongsTo(groups, { foreignKey: "groupId", onDelete: "CASCADE" });
groups.hasMany(messages, { foreignKey: "groupId" });
users.belongsToMany(groups, { through: "user_groups" });
groups.belongsToMany(users, { through: "user_groups" });
users.hasMany(ForgotPassword, { foreignKey: "userId" });
ForgotPassword.belongsTo(users, { foreignKey: "userId" });

sequelize
  .sync({ force: false })
  .then((res) => {
    app.listen(process.env.PORT || 3000);
    console.log(`Server running at port ${process.env.PORT}/`);
  })
  .catch((err) => console.log(err));
