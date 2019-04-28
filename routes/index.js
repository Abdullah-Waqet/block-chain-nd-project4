const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

router.post("/requestValidation", indexController.requestValidation);
router.post(
  "/message-signature/validate",
  indexController.validateMessageSignature
);

module.exports = router;
