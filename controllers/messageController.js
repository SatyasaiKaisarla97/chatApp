const messages = require("../models/messages");
const users = require("../models/users");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../util/database");
const { Op } = require("sequelize");

async function postGroupMessages(req, res, next) {
  let transaction;
  try {
    const { groupId, message } = req.body;
    const userId = req.user.userId; // Assuming you're using middleware to set req.user.userId

    // Start transaction
    transaction = await sequelize.transaction();

    // Create a new message
    const newMessage = await messages.create(
      {
        id: uuidv4(), // Generate a UUID for message id
        userId: userId,
        groupId: groupId,
        message: message,
      },
      { transaction }
    );

    // Commit transaction
    await transaction.commit();

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    // Rollback transaction in case of error
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

async function inviteUsersToGroup(req, res, next) {
  try {
    const { groupId } = req.params;
    const { userIds } = req.body;

    // Add invited users to the group
    await Promise.all(
      userIds.map(async (userId) => {
        await users.findByPk(userId).then(async (user) => {
          await user.addGroup(groupId);
        });
      })
    );

    res.status(200).json({ message: "Users invited to group successfully" });
  } catch (error) {
    console.error("Failed to invite users to group:", error);
    res.status(500).json({ message: "Failed to invite users to group" });
  }
}
async function searchUsers(req, res, next) {
  try {
    const { query } = req.query;
    const searchResult = await users.findAll({
      where: {
        username: {
          [Op.like]: `%${query}%`, // Using Sequelize's like operator for partial matching
        },
      },
      attributes: ["id", "username"], // Only fetching user id and username
    });
    res.status(200).json(searchResult);
  } catch (error) {
    console.error("Failed to search users:", error);
    res.status(500).json({ message: "Failed to search users" });
  }
}

module.exports = {
  postGroupMessages,
  getGroupUsersList,
  getGroupMessageList,
  inviteUsersToGroup,
  searchUsers, // Adding searchUsers function to module exports
};
