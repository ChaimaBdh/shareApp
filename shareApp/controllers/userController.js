const User = require('../models/user.model').model;

module.exports.me =
  async (req, res) =>  {
    const user = await User.findById(req.userId);
    res.status(200).json({ name: user.name, id: user._id });
  }
