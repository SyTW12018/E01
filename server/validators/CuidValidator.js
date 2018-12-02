import Validator from './Validator';

export default new Validator({
  cuid: {
    in: [ 'params' ],
    errorMessage: 'Invalid cuid',
    isAlphanumeric: true,
    isLength: {
      options: { min: 25, max: 25 },
    },
  },
}).getMiddleware();
