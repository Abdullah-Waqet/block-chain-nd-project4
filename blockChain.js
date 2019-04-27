const SHA256 = require("crypto-js/sha256");
const Block = require("./block");
const dbHelper = require("./dbHelper");

class BlockChain {
  constructor() {
    dbHelper.getBlocksCount().then(count => {
      if (count == 0) {
        this.addBlock("First block in the chain - Genesis block");
      }
    });
  }

  async getBlockHeight() {
    let blockHeight = await dbHelper.getBlocksCount();
    return blockHeight - 1;
  }

  async addBlock(data) {
    // Block height
    let lastHeight = await this.getBlockHeight();
    let block = new Block(data);
    block.height = lastHeight + 1;
    // UTC timestamp
    block.time = new Date()
      .getTime()
      .toString()
      .slice(0, -3);

    if (lastHeight >= 0) {
      // previous block hash
      let previousBlock = await this.getBlock(lastHeight);

      block.previousBlockHash = previousBlock.hash;
    }

    // Block hash with SHA256 using newBlock and converting to a string
    block.hash = SHA256(JSON.stringify(block)).toString();

    // Adding block object to chain
    try {
      await dbHelper.addLevelDBData(block.height, block);
      return block;
    } catch {
      throw new Error("Failed to add new block");
    }
  }

  async getStarsByHash(blockHash) {
    try {
      return await dbHelper.getStarsByHash(blockHash);
    } catch (e) {
      console.log(e);
    }
  }

  async getBlock(height) {
    let rowObject = await dbHelper.getLevelDBData(height);
    return JSON.parse(rowObject);
  }
}

module.exports = () => new BlockChain();
