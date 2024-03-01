const messages = require("../models/messages");
const users = require("../models/users");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../util/database");

async function postMessages(req, res, next) {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { message } = req.body;
    const userId = req.user.userId;
    const messageId = uuidv4();
    await messages.create({ id: messageId, userId, message }, { transaction });
    await transaction.commit();
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Failed to send message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
}
async function getUsersList(req, res, next) {
  try {
    const userList = await users.findAll();
    res.status(200).json(userList);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

async function getMessageList(req, res, next) {
  try {
    const messagesWithUser = await messages.findAll({
      include: {
        model: users,
        attributes: ["username"],
        required: true,
      },
      order: [["createdAt", "ASC"]],
    });

    const formattedMessages = messagesWithUser.map((message) => ({
      id: message.id,
      userId: message.userId,
      message: message.message,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      username: message.user.username,
    }));

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error("Failed to fetch messages with user:", error);
    res.status(500).json({ message: "Failed to fetch messages with user" });
  }
}
module.exports = {
  postMessages,
  getUsersList,
  getMessageList,
};
