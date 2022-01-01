const bcrypt = require("bcryptjs");
const dbConnection = require("../db/connect");
const { randomBytes } = require("crypto");
const jwt = require("jsonwebtoken");
const dns = require("dns");
const { BadRequestError } = require("../errors");

const connectDB = async() => {
    const client = dbConnection();
    const db = (await client).db("UrlShortener");
    return db;
};

const hashPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const comparePassword = async(enteredPassword, password) => {
    const isCorrect = await bcrypt.compare(enteredPassword, password);
    return isCorrect;
};
const randomStringGenerator = (length) => randomBytes(length).toString("hex");

const jsonToken = (email, userId) => {
    const token = jwt.sign({ email: email, id: userId }, process.env.JWT_SECRET);
    return token;
};

const verifyUrl = (host) => {
    return new Promise((resolve, reject) => {
        dns.lookup(host, (err, address, family) => {
            if (err) {
                reject("Invalid URL");
            }
            console.log("Url address", address, family);
            resolve("URL is good.");
        });
    });
};
module.exports = {
    connectDB,
    hashPassword,
    randomStringGenerator,
    jsonToken,
    comparePassword,
    verifyUrl,
};