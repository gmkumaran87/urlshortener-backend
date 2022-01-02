// import { genSalt, hash, compare } from "bcryptjs";
import bc from "bcryptjs";
import dbConnection from "../db/connect.js";
import { randomBytes } from "crypto";
import Jwt from "jsonwebtoken";
import { lookup } from "dns";

const { genSalt, hash, compare } = bc;
const { sign } = Jwt;

const connectDB = async() => {
    const client = dbConnection();
    const db = (await client).db("UrlShortener");
    return db;
};

const hashPassword = async(password) => {
    const salt = await genSalt(10);
    return await hash(password, salt);
};

const comparePassword = async(enteredPassword, password) => {
    const isCorrect = await compare(enteredPassword, password);
    return isCorrect;
};
const randomStringGenerator = (length) => randomBytes(length).toString("hex");

const jsonToken = (email, userId) => {
    const token = sign({ email: email, id: userId }, process.env.JWT_SECRET);
    return token;
};

const verifyUrl = (host) => {
    return new Promise((resolve, reject) => {
        lookup(host, (err, address, family) => {
            if (err) {
                reject("Invalid URL");
            }
            console.log("Url address", address, family);
            resolve("URL is good.");
        });
    });
};
export {
    connectDB,
    hashPassword,
    randomStringGenerator,
    jsonToken,
    comparePassword,
    verifyUrl,
};