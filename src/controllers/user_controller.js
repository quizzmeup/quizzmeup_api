const User = require("../models/User");

const UsersController = {
  getUsers: async (req, res) => {
    let name = req.query.name;
    const filters = {};

    if (name) {
      filters.name = new RegExp(name, "i");
    }

    const users = await User.find(filters)
      .select("_id email name isAdmin")
      .populate("cohorts", "name");

    res.status(200).json(users);
  },
};

module.exports = UsersController;
