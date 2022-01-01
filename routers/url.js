const express = require("express");
const router = express.Router();
const { getAllUrls, createUrl } = require("../controllers/url");

router.route("/").get(getAllUrls).post(createUrl);

module.exports = router;