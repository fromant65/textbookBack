const express = require("express");
const router = express.Router();
const path = require("path");
const followerController = require("../controllers/followerController");

router.get("/logout", (req, res) => {
  req.session = null;
  res.json({ logout: true });
});

module.exports = router;
