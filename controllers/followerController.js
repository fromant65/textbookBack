const User = require("../model/User");

const getFollowed = async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username: username }).exec();
    res.status(200).json({ followed: user.following });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFollowers = async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username: username }).exec();
    res.status(200).json({ followers: user.followers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getFollowed, getFollowers };
