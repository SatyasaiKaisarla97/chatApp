const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");
const users = require("./users");

const groups = sequelize.define("groups", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: users,
      key: "id",
    },
  },
});

module.exports = groups;
