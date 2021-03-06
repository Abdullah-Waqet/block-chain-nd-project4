// Level DB Helpers
// Add data to levelDB with key/value pair
const level = require("level");
const chainDB = "./chaindata";
const db = level(chainDB);
function getBlocksCount() {
  return new Promise((resolve, reject) => {
    let i = 0;
    db.createReadStream()
      .on("data", function(data) {
        i++;
      })
      .on("error", function(err) {
        reject(err);
      })
      .on("close", function() {
        resolve(i);
      });
  });
}

function addLevelDBData(key, value) {
  return db.put(key, JSON.stringify(value));
}

// Get data from levelDB with key
function getLevelDBData(key) {
  return db.get(key);
}

async function getAllStarsbyAddress(walletAddress) {
  let stars = [];
  let star;

  return new Promise((resolve, reject) => {
    db.createReadStream()
      .on("data", function(data) {
        try {
          star = JSON.parse(data.value.toString());
        } catch (e) {
          console.log("parse exception:  ", e.stack);
        }
        if (star.body.address === walletAddress) {
          stars.push(star);
        }
      })
      .on("error", function(error) {
        reject(error);
      })
      .on("close", function() {
        resolve(stars);
      });
  });
}

async function getStarsByHash(blockHash) {
  let stars = [];
  return new Promise((resolve, reject) => {
    db.createReadStream()
      .on("data", function(data) {
        let star = JSON.parse(data.value);
        if (star.hash === blockHash) {
          stars.push(star);
        }
      })
      .on("error", function(err) {
        reject(errors);
      })
      .on("close", function() {
        resolve(stars);
      });
  });
}

module.exports = {
  getLevelDBData: getLevelDBData,
  addLevelDBData: addLevelDBData,
  getBlocksCount: getBlocksCount,
  getAllStarsbyAddress: getAllStarsbyAddress,
  getStarsByHash: getStarsByHash
};
