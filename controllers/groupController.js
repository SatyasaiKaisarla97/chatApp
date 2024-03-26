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

async function createGroup(req, res) {
  const { name } = req.body;
  try {
    const group = await groups.create({ name });
    res.status(201).json({ message: "Group created successfully", group });
  } catch (error) {
    console.error("Failed to create group:", error);
    res.status(500).json({ message: "Failed to create group" });
  }
}

module.exports = {
  getGroups,
  createGroup,
};
