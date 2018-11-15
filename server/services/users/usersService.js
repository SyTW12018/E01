import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';
import User from '../../models/user';

const userStorage = [
  {
    cuid: 'siufhSIUFbisbvoyzsbf89',
    dateAdded: new Date(),
  },
];

export function getTemporalUsers() {
  return new Promise((resolve, reject) => {
    resolve(userStorage);
  });
}

export function getRegisteredUsers() {
  return User.find().sort('-dateAdded').exec();
}

/**
 * Get all users
 * @returns promise
 */
export function getUsers() {
  return new Promise((resolve, reject) => {
    let users = [];
    getTemporalUsers().then((temporalUsers) => {
      users = temporalUsers.map(user => ({ ...user, registered: false }));
      return getRegisteredUsers();
    }).then((registeredUsers) => {
      users.push(registeredUsers.map(user => ({ ...user, registered: true })));
      resolve(users);
    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 * Add a temporal user
 * @returns promise
 */
export function addTemporalUser() {
  return new Promise((resolve, reject) => {
    const newUser = {
      cuid: cuid(),
      dateAdded: new Date(),
    };
    userStorage.push(newUser);
    resolve(newUser);
  });
}

/**
 * Get a single user
 * @param req
 * @param res
 * @returns void
 */
export function getUser(req, res) {
  User.findOne({ cuid: req.params.cuid }).exec((err, user) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ user });
  });
}

/**
 * Delete a user
 * @param req
 * @param res
 * @returns void
 */
export function deleteUser(req, res) {
  User.findOne({ cuid: req.params.cuid }).exec((err, user) => {
    if (err) {
      res.status(500).send(err);
    }

    user.remove(() => {
      res.status(200).end();
    });
  });
}
