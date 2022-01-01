const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authentication = async(req, res, next) => {
    const header = req.headers.authorization;

    if (!header || header.split(" ")[0] != "Bearer") {
        throw new UnauthenticatedError("Invalid Authentication");
    }

    const token = header.split(" ")[1];

    try {
        const tokenValid = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token processed", tokenValid);
        req.user = { userId: tokenValid.id, email: tokenValid.email };
        next();
    } catch (error) {
        throw new UnauthenticatedError("Invalid Authentication");
    }
};

module.exports = authentication;