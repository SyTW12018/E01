import Validator from './Validator';

export default new Validator({
  'user.email': {
    in: [ 'body' ],
    errorMessage: 'Invalid email',
    isEmail: true,
  },
  'user.name': {
    in: [ 'body' ],
    errorMessage: 'Invalid username',
    isAlphanumeric: true,
    isLength: {
      options: { min: 3, max: 25 },
    },
  },
  'user.newPassword': {
    in: [ 'body' ],
    errorMessage: 'Invalid new password',
    isLength: {
      options: { min: 5, max: 40 },
    },
    optional: true,
  },
  'user.currentPassword': {
    in: [ 'body' ],
  },
}).getMiddleware();
