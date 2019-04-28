const chain = require("./../blockChain")();
const { hexaToAscii } = require("./../stringConverter");

module.exports = {
  async getStarByBlockHash(req, res) {
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
  },
  async getStarsByBlockAddress(req, res) {
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
  }
};
