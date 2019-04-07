const crypto = require('crypto-js/sha256');
const Block = require('./block');

class BlockChain {

    constructor() {
        this.chain = [];
        this.addBlock('Genesis Block');
    }

    getBlockHeight() {
        return this.chain.length;
    }

    addBlock(data) {
        let block = new Block(data);
        block.height = this.getBlockHeight();
        block.hash = crypto(JSON.stringify(block)).toString();

        if (block.height > 0) {
            block.previousHash = this.chain[block.height - 1].hash;
        }

        this.chain.push(block);

        return block;
    }

    getBlock(height) {
        return this.chain[height];
    }

}

module.exports = () => new BlockChain();