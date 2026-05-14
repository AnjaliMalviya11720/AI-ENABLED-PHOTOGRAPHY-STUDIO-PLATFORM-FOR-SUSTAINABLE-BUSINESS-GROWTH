const express = require("express");
const { getPublicPortfolio, getPhotographers } = require("../controllers/publicController");

const router = express.Router();

router.get("/studios/:id", getPublicPortfolio);
router.get("/photographers", getPhotographers);

module.exports = router;
