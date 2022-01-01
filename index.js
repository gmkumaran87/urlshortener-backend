const express = require("express");
require("dotenv").config();
require("express-async-errors");

// Security Libraries
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");

const app = express();

// Routers
const authrouter = require("./routers/auth");
const urlRouter = require("./routers/url");

// Error handler
const errorHandlerMiddleware = require("./middleware/error-handler");
const authentication = require("./middleware/authentication");

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use("/api/v1/auth", authrouter);
app.use("/api/v1/url", authentication, urlRouter);

app.get("/", (req, res) => {
    res.send("Welcome to the URL Shortener app home page");
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT;
app.listen(port, () => console.log("App started in the port -", port));