const joi = require("@hapi/joi");

module.exports = {
  requestValidator(body) {
    const schema = {
      address: joi
        .string()
        .min(10)
        .max(34)
        .required()
    };
    return joi.validate(body, schema);
  },
  messageValidator(body) {
    const schema = {
      address: joi
        .string()
        .min(10)
        .max(34)
        .required(),
      signature: joi
        .string()
        .max(88)
        .required()
    };

    return joi.validate(body, schema);
  },
  blockValidator(body) {
    const schema = {
      address: joi
        .string()
        .min(10)
        .max(34)
        .required(),
      star: joi
        .object()
        .keys({
          dec: joi
            .string()
            .min(3)
            .required(),
          ra: joi
            .string()
            .min(3)
            .required(),
          magnitude: joi.string().min(3),
          constellation: joi.string().min(3),
          story: joi
            .string()
            .min(3)
            .regex(/[a-zA-Z0-9]/)
            .required()
        })
        .required()
    };
    return joi.validate(body, schema);
  }
};
