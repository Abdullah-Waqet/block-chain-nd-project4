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
app.get("/block/:height", async function(req, res) {
  const height = parseInt(req.params.height);
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
  result = blockValidator(req.body);

  if (result.error) {
    return res
      .status(400)
      .send({ error: `Bad Request. ${result.error.details[0].message}` });
  }

  let address = req.body.address;

  let request = pool[address];

  if (!request) {
    return res.status(400).send({ error: `Invalid block data` });
  }


  let hexStory = asciiToHexa(req.body.star.story);
  req.body.star.story = hexStory;

  try {
    let block = await chain.addBlock(req.body);
    res.send(block);
  } catch (error) {
    res.status(500).send({ error: "Something went wrong" });
  }
});

app.post("/requestValidation", async (req, res) => {
  result = requestValidator(req.body);

  if (result.error) {
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

app.post("/message-signature/validate", async (req, res) => {
  result = messageValidator(req.body);
  if (result.error) {
    return res
      .status(400)
      .send({ error: `Bad Request. ${result.error.details[0].message}` });
  }

  let address = req.body.address;
  let signature = req.body.signature;
  let request = pool[address];

  if (!request) {
    return res.status(400).send({ error: "Invalid Request" });
  }

  let signedMessage = {
    message: request.message,
    address: address,
    signature: signature
  };

  if (validateSignature(signedMessage) !== true) {
    return res.status(400).send({ error: "Signature Validation Failed." });
  }

  let now = new Date()
    .getTime()
    .toString()
    .slice(0, -3);
  let timeElapsed = now - request.requestTimeStamp;
  let newRequest = {
    registerStar: true,
    status: {
      address: address,
      requestTimeStamp: request.requestTimeStamp,
      message: request.message,
      validationWindow: 300 - timeElapsed,
      messageSignature: true
    }
  };

  return res.status(200).send(newRequest);
});

app.get("/stars/hash::blockHash", async (req, res) => {
  const blockHash = req.params.blockHash;

  let stars = await chain.getStarsByHash(blockHash);
  if (!stars) {
    return res
      .status(500)
      .send({ error: `Could not find stars wit hash: ${blockHash}` });
  }

  if (stars.length == 0) {
    return res
      .status(404)
      .send({ error: `Could not find stars wit hash: ${blockHash}` });
  }

  let decodedStars = [];
  for (let star of stars) {
    star.body.star["storyDecoded"] = hexaToAscii(star.body.star.story);
    decodedStars.push(star);
  }

  return res.status(200).send(decodedStars[0]);
});

app.get("/stars/address::address", async (req, res) => {
  let address = req.params.address;

  let stars = await chain.getAllStarsbyAddress(address);

  if (!stars) {
    return res
      .status(500)
      .send({ error: `Could not find stars for wallet: ${address}` });
  }

  if (stars.length == 0) {
    return res
      .status(404)
      .send({ error: `Could not find stars for wallet: ${address}` });
  }

  // If there are stars for the wallet address return them with decoded story
  let decodedStars = [];
  for (let star of stars) {
    star.body.star["storyDecoded"] = hexaToAscii(star.body.star.story);
    decodedStars.push(star);
  }

  return res.status(200).send(decodedStars);
});

app.listen(8000, () => console.log(`Example app listening on port ${8000}!`));
