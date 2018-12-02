import Validator from './Validator';

export default new Validator({
  'id': {
    // The location of the field, can be one or more of body, cookies, headers, params or query.
    // If omitted, all request locations will be checked
    in: [ 'params', 'query' ],
    errorMessage: 'ID is wrong',
    isInt: true,
    // Sanitizers can go here as well
    toInt: true,
  },
  'myCustomField': {
    // Custom validators
    custom: {
      options: (value, { req, location, path }) => value + req.body.foo + location + path,
    },
    // and sanitizers
    customSanitizer: {
      options: (value, { req, location, path }) => {
        let sanitizedValue;

        if (req.body.foo && location && path) {
          sanitizedValue = parseInt(value, 10);
        } else {
          sanitizedValue = 0;
        }

        return sanitizedValue;
      },
    },
  },
  'password': {
    isLength: {
      errorMessage: 'Password should be at least 7 chars long',
      // Multiple options would be expressed as an array
      options: { min: 7 },
    },
  },
  'firstName': {
    isUpperCase: {
      // To negate a validator
      negated: true,
    },
    rtrim: {
      // Options as an array
      options: [ [ ' ', '-' ] ],
    },
  },
  // Wildcards/dots for nested fields work as well
  'addresses.*.postalCode': {
    optional: true,
    isPostalCode: true,
  },
}).getMiddleware();
