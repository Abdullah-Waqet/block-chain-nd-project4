const express = require("express");
const router = express.Router();
const blockController = require("../controllers/blockController");

router.get("/:height", blockController.getBlockByHeight);

router.post("/", blockController.createBlock);

module.exports = router;
