const User = require("../models/User");

const UsersController = {
  getUsers: async (req, res) => {
    try {
      let name = req.query.name;
      const filters = {};
      if (name) {
        filters.name = new RegExp(name, "i");
      }
      const users = await User.find(filters).populate("cohorts", "name");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = UsersController;
