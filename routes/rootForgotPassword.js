const express = require("express");
const router = express.Router();
const path = require("path");
const passwordController = require("../controllers/passwordController");

router.post("/forgot-password", passwordController.sendMail);
router.post("/update-password", passwordController.update);

module.exports = router;
