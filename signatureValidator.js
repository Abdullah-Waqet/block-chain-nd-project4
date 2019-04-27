const bitcoinMessage = require("bitcoinjs-message");

module.exports = {
  validateSignature(signedMessage) {
    try {
      return bitcoinMessage.verify(
        signedMessage.message,
        signedMessage.address,
        signedMessage.signature
      );
    } catch (e) {
      return e.message;
    }
  }
};
