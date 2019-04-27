const express = require("express");
const bodyParser = require("body-parser");
const chain = require("./blockChain")();
const { validateSignature } = require("./signatureValidator");
const { asciiToHexa, hexaToAscii } = require("./stringConverter");
const {
  requestValidator,
  messageValidator,
  blockValidator
} = require("./bodyValidators");

const app = express();

const pool = {};

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// add end-point to get block   GET /block/{block-height}
app.get("/block/:blockHeight", async function(req, res) {
  let height = req.params.blockHeight;
  try {
    let block = await chain.getBlock(height);
    res.send(block);
  } catch (error) {
    if (error.notFound) {
      res.status(404).send({ error: `block Height ${height} not exists` });
    } else {
      res.status(500).send({ error: "Something went wrong" });
    }
  }
});
// add end-point to add block   POST /block
app.post("/block", async function(req, res) {
  let body = req.body.body;

  if (!body) {
    res.status(400).send({ error: `Invalid block data` });
  }

  try {
    let block = await chain.addBlock(body);
    res.send(block);
  } catch (error) {
    res.status(500).send({ error: "Something went wrong" });
  }
});
// start express app

app.post("/requestValidation", async (req, res) => {
  result = requestValidator(req.body);

  if (result.error) {
    console.log(result.error);
    response = {};
    return res
      .status(400)
      .send({ error: `Bad Request. ${result.error.details[0].message}` });
  }
  let address = req.body.address;

  let request = pool[address];

  if (request) {
    let now = new Date()
      .getTime()
      .toString()
      .slice(0, -3);

    let timeElapsed = now - request.timeStamp;
    request.validationWindow = 300 - timeElapsed;
    pool[address] = request;
    return res.status(200).send(request);
  }

  let now = new Date()
    .getTime()
    .toString()
    .slice(0, -3);
  let newRequest = {
    walletAddress: req.body.address,
    requestTimeStamp: new Date()
      .getTime()
      .toString()
      .slice(0, -3),
    message: `${req.body.address}:${now}:starRegistry`,
    validationWindow: 300
  };
  pool[address] = newRequest;

  setTimeout(() => {
    delete pool[address];
  }, newRequest.validationWindow * 1000);

  res.status(200).send(newRequest);
});

app.listen(8000, () => console.log(`Example app listening on port ${8000}!`));
