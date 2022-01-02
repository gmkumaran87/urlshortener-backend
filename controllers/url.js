import {
    AccountExistsError,
    BadRequestError,
    UnauthenticatedError,
} from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import {
    connectDB,
    jsonToken,
    randomStringGenerator,
    verifyUrl,
} from "../utility/helper.js";
import Url from "url-parse";

const getAllUrls = async(req, res) => {
    res.send("All the Url");
};

const createUrl = async(req, res) => {
    let isExists = false;
    let shortUrl = "";

    const { originalUrl } = req.body;

    // Attaching the UserId to the req.body for inserting in the DB
    req.body.createdBy = req.user.userId;
    req.body.createdAt = new Date();
    req.body.clicks = 0;

    // Connecting to the DB
    const db = await connectDB();

    const urlFromDB = await db
        .collection("url")
        .findOne({ originalUrl: originalUrl });

    if (urlFromDB) {
        throw new AccountExistsError("The entered URL already exists");
    }

    console.log("isExists", isExists);
    while (isExists === false) {
        shortUrl = randomStringGenerator(4);
        const shortUrlFromDb = await db
            .collection("url")
            .findOne({ shortUrl: shortUrl });
        if (!shortUrlFromDb) {
            isExists = true;
        }
    }

    const urlParse = new Url(originalUrl);

    //Checking the entered Url is valid
    if (urlParse.host === null) {
        throw new BadRequestError("Invalid URL");
    } else {
        try {
            const dnsResult = await verifyUrl(urlParse.host);
            console.log("DnS Result", dnsResult);
        } catch (error) {
            throw new BadRequestError("Invalid request URL");
        }
    }
    req.body.shortUrl = shortUrl;
    console.log("Req body", req.body);
    const urlCreated = await db.collection("url").insertOne(req.body);

    res.status(StatusCodes.CREATED).json({ msg: "Url Created", urlCreated });
};

export { getAllUrls, createUrl };