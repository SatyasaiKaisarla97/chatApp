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
module.exports = {
  postMessages,
};
