const express = require("express");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
const blockRouter = require("./routes/blocks");
const starsRouter = require("./routes/stars");

const app = express();

global.pool = {};

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/", indexRouter);
app.use("/block", blockRouter);
app.use("/stars", starsRouter);

app.listen(8000, () => console.log(`Example app listening on port ${8000}!`));
