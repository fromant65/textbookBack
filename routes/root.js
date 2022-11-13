const express = require("express");
const router = express.Router();
const path = require("path");
const followerController = require("../controllers/followerController");

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
