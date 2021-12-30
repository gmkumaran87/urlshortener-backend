const express = require("express");
require("dotenv").config();

// Security Libraries
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");

// Routers
const authrouter = require("./routers/auth");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use("/api/v1/auth", authrouter);

app.get("/", (req, res) => {
    res.send("Welcome to the URL Shortener app home page");
});

const port = process.env.PORT;
app.listen(port, () => console.log("App started in the port -", port));