import { validationResult, checkSchema } from 'express-validator/check';

class Validator {
  constructor(schema) {
    this.schema = schema;
  }

  getMiddleware = () => (req, res, next) => {
    const executeMiddleware = (middleware, callback) => {
      const nextMiddleware = index => () => {
        if (index < middleware.length - 1) {
          middleware[index](req, res, nextMiddleware(index + 1));
        } else {
          middleware[index](req, res, callback);
        }
      };

      nextMiddleware(0)();
    };

    executeMiddleware(checkSchema(this.schema), () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      return next();
    });
  }
}

export default Validator;
