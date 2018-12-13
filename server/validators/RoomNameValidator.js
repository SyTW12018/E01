import Validator from './Validator';

export default new Validator({
  name: {
    in: [ 'params' ],
    errorMessage: 'Invalid room name',
  },
}).getMiddleware();
