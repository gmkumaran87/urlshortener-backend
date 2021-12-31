const bcrypt = require("bcryptjs");
const dbConnection = require("../db/connect");
const { randomBytes } = require("crypto");
const jwt = require("jsonwebtoken");

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

const jsonToken = (email, name) => {
    const token = jwt.sign({ email: email, name: name },
        randomStringGenerator(), { expiresIn: 24 }
    );
    return token;
};
module.exports = { connectDB, hashPassword, randomStringGenerator, jsonToken };