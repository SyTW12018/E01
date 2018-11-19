import cuid from 'cuid';
import User from '../models/User';

let userStorage = [];

/**
 * Get all temporal users
 * @returns Promise
 */
function getTemporalUsers() {
  return new Promise((resolve) => {
    resolve(userStorage);
  });
}

/**
 * Get all registered users
 * @returns Promise
 */
function getRegisteredUsers() {
  return User.find().sort('-dateAdded').exec();
}

/**
 * Get all users
 * @returns Promise
 */
function getUsers() {
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
 * @returns Promise
 */
function addTemporalUser() {
  return new Promise((resolve) => {
    const newUser = {
      cuid: cuid(),
      dateAdded: new Date(),
    };
    userStorage.push(newUser);
    resolve(newUser);
  });
}

/**
 * Register a user
 * @param user
 * @returns Promise
 */
function registerUser(user) {
  return User.create(user);
}

/**
 * Get a single user by cuid
 * @param cuid
 * @returns Promise
 */
function getUser(cuid) {
  return new Promise((resolve, reject) => {
    getTemporalUsers().then((tempUsers) => {
      const tempUser = tempUsers.find(user => user.cuid === cuid);

      if (tempUser === undefined) {
        User.findOne({ cuid }).exec().then((user) => {
          resolve(user);
        }).catch(() => {
          reject(new Error('Database error'));
        });
      } else {
        resolve(tempUser);
      }
    });
  });
}

/**
 * Delete a user by cuid
 * @param cuid
 * @returns Promise
 */
function deleteUser(cuid) {
  return new Promise((resolve, reject) => {
    getTemporalUsers().then((tempUsers) => {
      const tempUser = tempUsers.find(user => user.cuid === cuid);

      if (tempUser === undefined) {
        User.deleteOne({ cuid }).exec().then(() => {
          resolve();
        }).catch(() => {
          reject(new Error('Database error'));
        });
      } else {
        userStorage = userStorage.filter(user => user.cuid === cuid);
        resolve();
      }
    });
  });
}

/**
 * Update a registered user
 * @param user
 * @returns Promise
 */
function updateUser(user) {
  return User.updateOne({ cuid: user.cuid }, user).exec();
}

export default {
  deleteUser,
  getUser,
  addTemporalUser,
  registerUser,
  getUsers,
  getRegisteredUsers,
  getTemporalUsers,
  updateUser,
};
