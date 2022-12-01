const express = require("express");
const router = express.Router();
const path = require("path");

router.all("*", (req, res) => {
  res.status(404).json({ error: "404 no encontrado" });
});

module.exports = router;
