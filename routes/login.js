const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

router.get("/", (req, res) => {
  if (req.session.userid) {
    res.json({ loggedIn: true, user: req.session.userid });
  } else {
    res.json({ loggedIn: false });
  }
});

router.post("/", loginController.handleLogin);

module.exports = router;
