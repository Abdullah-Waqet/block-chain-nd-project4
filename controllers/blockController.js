const chain = require("./../blockChain")();
const { blockValidator } = require("./../bodyValidators");
const { asciiToHexa, hexaToAscii } = require("./../stringConverter");

module.exports = {
  async getBlockByHeight(req, res) {
    const height = parseInt(req.params.height);
    try {
      let block = await chain.getBlock(height);
      block.body.star["storyDecoded"] = hexaToAscii(block.body.star.story);
      res.send(block);
    } catch (error) {
      if (error.notFound) {
        res.status(404).send({ error: `block Height ${height} not exists` });
      } else {
        res.status(500).send({ error: "Something went wrong" });
      }
    }
  },
  async createBlock(req, res) {
    result = blockValidator(req.body);

    if (result.error) {
      return res
        .status(400)
        .send({ error: `Bad Request. ${result.error.details[0].message}` });
    }

    let address = req.body.address;

    let request = global.pool[address];

    if (!request) {
      return res.status(400).send({ error: `Invalid block data` });
    }

    // let signedMessage = {
    //   message: request.message,
    //   address: address,
    //   signature: null
    // };

    // if (validateSignature(signedMessage) !== true) {
    //   return res.status(400).send({ error: "Signature Validation Failed." });
    // }

    let hexStory = asciiToHexa(req.body.star.story);
    req.body.star.story = hexStory;

    try {
      let block = await chain.addBlock(req.body);
      delete global.pool[address];
      res.send(block);
    } catch (error) {
      res.status(500).send({ error: "Something went wrong" });
    }
  }
};
