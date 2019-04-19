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
app.get("/block/:blockHeight", function(req, res) {
  let height = req.params.blockHeight;
  let block = chain.getBlock(req.params.height);
  if (block) {
    res.send(block);
  } else {
    res.status(404).send({ error: `block Height ${height} not exists` });
  }
});
// add end-point to add block   POST /block
app.post("/block", function(req, res) {
  if (req.body.body) {
    let block = chain.addBlock(req.body.body);
    res.send(block);
  } else {
    res.status(400).send({ error: `Invalid block data` });
  }
});
// start express app
app.listen(8000, () => console.log(`Example app listening on port ${8000}!`));
