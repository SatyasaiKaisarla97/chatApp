const messages = require("../models/messages");
const users = require("../models/users");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../util/database");
const { Op } = require("sequelize");

async function postGroupMessages(req, res, next) {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { groupId, message } = req.body;
    const userId = req.user.userId;
    const messageId = uuidv4();
    await messages.create(
      { id: messageId, userId, groupId, message },
      { transaction }
    );
    await transaction.commit();
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Failed to send message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
}

async function getGroupUsersList(req, res, next) {
  try {
    const groupId = req.params.groupId;
    // Fetch users within the specified group
    const userList = await users.findAll({
      include: {
        model: messages,
        where: { groupId },
      },
    });
    res.status(200).json(userList);
  } catch (error) {
    console.error("Failed to fetch users in the group:", error);
    res.status(500).json({ message: "Failed to fetch users in the group" });
  }
}

async function getGroupMessageList(req, res, next) {
  try {
    const groupId = req.params.groupId;
    const latestMessageId = req.query.latestMessageId;
    let messagesQuery = {
      include: {
        model: users,
        attributes: ["username"],
        required: true,
      },
      where: { groupId },
      order: [["createdAt", "ASC"]],
    };
    if (latestMessageId !== undefined) {
      messagesQuery.where.id = { [Op.gt]: latestMessageId };
    }
    const messagesWithUser = await messages.findAll(messagesQuery);

    const formattedMessages = messagesWithUser.map((message) => ({
      id: message.id,
      userId: message.userId,
      groupId: message.groupId,
      message: message.message,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      username: message.user.username,
    }));

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error("Failed to fetch messages in the group:", error);
    res.status(500).json({ message: "Failed to fetch messages in the group" });
  }
}

module.exports = {
  postGroupMessages,
  getGroupUsersList,
  getGroupMessageList,
};
