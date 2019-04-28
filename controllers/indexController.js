const { requestValidator, messageValidator } = require("./../bodyValidators");
const { validateSignature } = require("./../signatureValidator");

module.exports = {
  async requestValidation(req, res) {
    result = requestValidator(req.body);

    if (result.error) {
      response = {};
      return res
        .status(400)
        .send({ error: `Bad Request. ${result.error.details[0].message}` });
    }
    let address = req.body.address;

    let request = global.pool[address];

    if (request) {
      let now = new Date()
        .getTime()
        .toString()
        .slice(0, -3);

      let timeElapsed = now - request.requestTimeStamp;
      request.validationWindow = 300 - timeElapsed;
      global.pool[address] = request;
      return res.status(200).send(request);
    }

    let now = new Date()
      .getTime()
      .toString()
      .slice(0, -3);
    let newRequest = {
      walletAddress: req.body.address,
      requestTimeStamp: new Date()
        .getTime()
        .toString()
        .slice(0, -3),
      message: `${req.body.address}:${now}:starRegistry`,
      validationWindow: 300
    };
    global.pool[address] = newRequest;

    setTimeout(() => {
      delete global.pool[address];
    }, newRequest.validationWindow * 1000);

    res.status(200).send(newRequest);
  },
  async validateMessageSignature(req, res) {
    result = messageValidator(req.body);
    if (result.error) {
      return res
        .status(400)
        .send({ error: `Bad Request. ${result.error.details[0].message}` });
    }

    let address = req.body.address;
    let signature = req.body.signature;
    let request = global.pool[address];

    if (!request) {
      return res.status(400).send({ error: "Invalid Request" });
    }

    let signedMessage = {
      message: request.message,
      address: address,
      signature: signature
    };

    if (validateSignature(signedMessage) !== true) {
      return res.status(400).send({ error: "Signature Validation Failed." });
    }

    let now = new Date()
      .getTime()
      .toString()
      .slice(0, -3);
    let timeElapsed = now - request.requestTimeStamp;
    let newRequest = {
      registerStar: true,
      status: {
        address: address,
        requestTimeStamp: request.requestTimeStamp,
        message: request.message,
        validationWindow: 300 - timeElapsed,
        messageSignature: true
      }
    };

    return res.status(200).send(newRequest);
  }
};
