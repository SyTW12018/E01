import Validator from './Validator';

export default new Validator({
  'user.email': {
    in: [ 'body' ],
    errorMessage: 'Invalid email',
    isEmail: true,
  },
  'user.password': {
    in: [ 'body' ],
  },
}).getMiddleware();
