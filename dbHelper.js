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

module.exports = {
  getLevelDBData: getLevelDBData,
  addLevelDBData: addLevelDBData,
  getBlocksCount: getBlocksCount
};
