const express = require("express");
const {
    registerUser,
    forgotPassword,
    loginUser,
    emailValidation,
    updatePassword,
} = require("../controllers/auth");

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/update-password").post(updatePassword);
router.route("/validation/:userId/:randomStr").post(emailValidation);

module.exports = router;