require("dotenv").config();
const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
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
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
    server.listen(process.env.PORT || 3000, () => {
      console.log(`Server running at port ${process.env.PORT}/`);
    });

    // Socket.IO logic
    io.on("connection", (socket) => {
      console.log("A user connected");

      // Joining a room for specific group
      socket.on("joinGroupRoom", (groupId) => {
        socket.join(groupId);
        console.log(`User joined group room ${groupId}`);
      });

      // Leaving a room for specific group
      socket.on("leaveGroupRoom", (groupId) => {
        socket.leave(groupId);
        console.log(`User left group room ${groupId}`);
      });

      // Sending message to a specific group
      socket.on("sendMessage", (data) => {
        const { groupId, message } = data;
        io.to(groupId).emit("newMessage", message);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });
  })
  .catch((err) => console.log(err));
