import Joi from 'joi';

export default {
  options: { allowUnknownBody: false },
  body: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
  },
};
