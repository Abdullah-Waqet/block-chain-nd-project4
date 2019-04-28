const express = require("express");
const router = express.Router();
const starController = require("../controllers/starController");

router.get("/hash::blockHash", starController.getStarByBlockHash);

router.get("/address::address", starController.getStarsByBlockAddress);

module.exports = router;
