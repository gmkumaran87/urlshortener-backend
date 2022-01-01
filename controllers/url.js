const {
    AccountExistsError,
    BadRequestError,
    UnauthenticatedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { ObjectId } = require("mongodb");
const { connectDB, jsonToken } = require("../utility/helper");

const getAllUrls = async(req, res) => {
    res.send("All the Url");
};

const createUrl = async(req, res) => {
    // Attaching the UserId to the req.body for inserting in the DB
    req.body.createdBy = req.user.userId;
    req.body.createdAt = new Date();
    // Connecting to the DB
    const db = await connectDB();
    const url = await db.collection("url").insertOne(req.body);
    res.status(StatusCodes.CREATED).json({ msg: "Url Created", url });
};

module.exports = { getAllUrls, createUrl };