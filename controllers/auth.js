const { AccountExistsError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { ObjectId } = require("mongodb");
const { sendGridMail } = require("../utility/sendMail");
const {
    connectDB,
    hashPassword,
    randomStringGenerator,
    jsonToken,
} = require("../utility/helper");

const registerUser = async(req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // DB Connection and insertion
    const db = await connectDB();
    // Finding the User present in the DB
    const userExists = await db.collection("users").findOne({ email: email });

    if (userExists) {
        throw new AccountExistsError("Email already exists");
    }

    // Hashing the Password
    const hashedPassword = await hashPassword(password);

    // Creating Confirmation token
    const confirmationToken = jsonToken(email, firstName);

    console.log("token", confirmationToken);

    const userObj = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isActive: false,
        confirmationCode: confirmationToken,
    };

    // Inserting into the DB with user details
    const user = await db.collection("users").insertOne(userObj);

    // Account Activation link
    const activationLink = `${process.env.ACCOUNT_ACTIVATION_URL}/${confirmationToken}`;

    // Sending email
    const mailInfo = sendGridMail(
        req.body.email,
        activationLink,
        "activating your account"
    );

    res
        .status(StatusCodes.CREATED)
        .json({ msg: "Registered the User, Please login", user });
};

const loginUser = async(req, res) => {
    res.send("Logging the user");
};
const forgotPassword = async(req, res) => {
    // DB Connection and insertion
    const db = await connectDB();
    const userExists = await db.collection("users").findOne(req.body);

    if (userExists) {
        // Ge
        const userId = userExists._id;
        const randomString = randomStringGenerator();

        const updatedStr = await db
            .collection("users")
            .updateOne({ _id: userId }, { $set: { randomStr: randomString } });

        const resetLink = `${process.env.FORGOT_PASSWORD_URL}/${userId}/${randomString}`;
        // Sending email
        const mailInfo = sendGridMail(
            req.body.email,
            resetLink,
            "resetting the Password"
        );

        res.status(200).json({
            msg: "Please check your email for the Password reset Link",
        });
    } else {
        res.status(404).json({
            msg: "User account does not exists, please enter valid email id",
        });
    }
};

const emailValidation = async(req, res) => {
    const { userId, randomStr } = req.params;

    const db = await connectDB();
    const userExists = await db
        .collection("users")
        .findOne({ _id: ObjectId(userId), randomStr: randomStr });

    if (userExists) {
        res.status(200).json({
            msg: "Password Reset link validation is successfull",
            userExists,
        });
    } else {
        res.status(404).json({ msg: "Password reset link is not valid" });
    }
};

const updatePassword = async(req, res) => {
    const { confirmPassword, userId, randomStr } = req.body;

    // Hashing the Password
    const hashedPassword = await hashPassword(confirmPassword);

    const db = await connectDB();
    const userExists = await db
        .collection("users")
        .findOne({ _id: ObjectId(userId), randomStr: randomStr });

    if (userExists) {
        const updatedUser = await db
            .collection("users")
            .updateOne({ _id: ObjectId(userId) }, { $set: { password: hashedPassword, randomStr: "" } });

        res.status(200).json({ msg: "Password updated successfully", updatedUser });
    } else {
        res.status(404).json({ msg: "Something went wrong, please try again" });
    }
};

module.exports = {
    registerUser,
    forgotPassword,
    emailValidation,
    loginUser,
    updatePassword,
};