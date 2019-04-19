const express = require("express");
const bodyParser = require("body-parser");
const chain = require("./blockChain")();

// initialize express app
const app = express();

// use body parser to to enable JSON body to be presented in request object
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// add end-point to get block   GET /block/{block-height}
app.get("/block/:blockHeight", async function(req, res) {
  let block = await chain.getBlock(req.params.blockHeight);
  try {
    if (!block) {
      res.status(404).send({ error: `block Height ${height} not exists` });
      return;
    }
    res.send(block);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Something went wrong" });
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
app.listen(8000, () => console.log(`Example app listening on port ${8000}!`));
