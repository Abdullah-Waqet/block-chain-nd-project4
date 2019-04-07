class Block {
    constructor(data) {
        this.height = 0;
        this.time = new Date().getTime().toString().slice(0, -3);
        this.hash = '';
        this.previousHash = '';
        this.data = data;
    }
}

module.exports = Block;