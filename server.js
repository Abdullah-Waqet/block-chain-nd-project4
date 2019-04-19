const express = require("express");
const bodyParser = require("body-parser");
const chain = require("./blockChain")();

// initialize express app
const app = express();

// use body parser to to enable JSON body to be presented in request object

// add end-point to get block   GET /block/{block-height}


// add end-point to add block   POST /block

// start express app
app.listen(8000, () => console.log(`Example app listening on port ${8000}!`));
