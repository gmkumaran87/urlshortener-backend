const bcrypt = require("bcryptjs");
const dbConnection = require("../db/connect");
const { randomBytes } = require("crypto");

const connectDB = async() => {
    const client = dbConnection();
    const db = (await client).db("UrlShortener");
    return db;
};

const hashPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const randomStringGenerator = () => randomBytes(20).toString("hex");

module.exports = { connectDB, hashPassword, randomStringGenerator };