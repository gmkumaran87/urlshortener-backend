const CustomApiError = require("./custom-api");
const { StatusCodes } = require("http-status-codes");

class AccountExistsError extends CustomApiError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.CONFLICT;
    }
}

module.exports = AccountExistsError;