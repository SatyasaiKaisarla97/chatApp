const groups = require("../models/groups");

async function getGroups(req, res) {
  try {
    const Groups = await groups.findAll();
    res.status(200).json(Groups);
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    res.status(500).json({ message: "Failed to fetch groups" });
  }
}

async function createGroup(req, res, next) {
  try {
    const { name } = req.body;
    const creatorId = req.user.userId; // Assuming you're using middleware to set req.user.userId

    // Create the group
    const newGroup = await groups.create({ name, creatorId });

    res.status(201).json({ message: "Group created successfully", newGroup });
  } catch (error) {
    console.error("Failed to create group:", error);
    res.status(500).json({ message: "Failed to create group" });
  }
}

module.exports = {
  getGroups,
  createGroup,
};
