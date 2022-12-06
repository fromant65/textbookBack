require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const sessions = require("express-session");
const PORT = process.env.PORT || 3500;
const oneDay = 1000 * 60 * 60 * 24;
const os = require("os");
const hostname = os.hostname();
const sessionOptions = {
  secret: process.env.ACCESS_TOKEN_SECRET,
  saveUninitialized: true,
  domain: hostname,
  cookie: {
    maxAge: oneDay,
    secure: process.env.PORT ? true : false, //Si la app esta en un server (https) es secure, sino (http) no
    sameSite: process.env.PORT ? "none" : false,
  },
  resave: false,
  name: "textbook-session",
};

//connect to Mongo DB
connectDB();

//Middleware
app.use(sessions(sessionOptions));
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/", require("./routes/root"));
app.use("/", require("./routes/rootFollowers"));
app.use("/", require("./routes/rootSearch"));
app.use("/", require("./routes/rootProfile"));
app.use("/", require("./routes/rootForgotPassword"));
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/home", require("./routes/home"));
app.use("/config", require("./routes/config"));
app.use("/", require("./routes/404"));

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
