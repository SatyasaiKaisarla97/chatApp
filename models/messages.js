const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");
const users = require("./users");

const messages = sequelize.define("messages", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  id: {
    type: DataTypes.UUID,
    defaultValue: () => DataTypes.UUIDV4(),
    primaryKey: true,
    unique: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = messages;
