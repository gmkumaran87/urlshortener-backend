const { ObjectId } = require("mongodb");
const {
    connectDB,
    hashPassword,
    randomStringGenerator,
} = require("../utility/helper");

const { sendGridMail } = require("../utility/sendMail");

const registerUser = async(req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Hashing the Password
    const hashedPassword = await hashPassword(password);

    const userObj = { firstName, lastName, email, password: hashedPassword };

    // DB Connection and insertion
    const db = await connectDB();

    // Finding the User present in the DB
    const userExists = await db.collection("users").findOne({ email: email });

    // If the User doesn't exists in the DB
    if (!userExists) {
        const user = await db.collection("users").insertOne(userObj);
        res.status(200).json({ msg: "Registered the User, Please login", user });
        return;
    }

    res.status(400).json({
        msg: "Email is already registered, please login or try with another account",
    });
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
        const mailInfo = sendGridMail(req.body.email, resetLink);

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