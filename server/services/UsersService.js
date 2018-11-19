import cuid from 'cuid';
import User from '../models/User';

let userStorage = [
  {
    cuid: 'asd78hfinsiufn',
    dateAdded: new Date(),
  },
];

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
  return new Promise((resolve, reject) => {
    User.find().select('cuid name email slug dateAdded').sort('-dateAdded').exec()
      .then((users) => {
        resolve(users);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Get all users
 * @returns Promise
 */
function getUsers() {
  return new Promise((resolve, reject) => {
    let users = [];
    getTemporalUsers()
      .then((temporalUsers) => {
        users = temporalUsers.map(user => ({ ...user, registered: false }));
        return getRegisteredUsers();
      })
      .then((registeredUsers) => {
        users = users.concat(registeredUsers.map(user => (
          {
            cuid: user.cuid,
            name: user.name,
            email: user.email,
            slug: user.slug,
            dateAdded: user.dateAdded,
            registered: true,
          })));
        resolve(users);
      })
      .catch((error) => {
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
  return new Promise((resolve, reject) => {
    User.create(user)
      .then((newUser) => {
        resolve({
          cuid: newUser.cuid,
          name: newUser.name,
          email: newUser.email,
          slug: newUser.slug,
          dateAdded: newUser.dateAdded,
          registered: true,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Get a single user by cuid
 * @param cuid
 * @returns Promise
 */
function getUser(cuid) {
  return new Promise((resolve, reject) => {
    getTemporalUsers()
      .then((tempUsers) => {
        const tempUser = tempUsers.find(user => user.cuid === cuid);

        if (!tempUser) {
          User.findOne({ cuid }).select('cuid name email slug dateAdded').exec()
            .then((user) => {
              if (!user) {
                resolve(null);
              } else {
                resolve({
                  cuid: user.cuid,
                  name: user.name,
                  email: user.email,
                  slug: user.slug,
                  dateAdded: user.dateAdded,
                  registered: true,
                });
              }
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          resolve({ ...tempUser, registered: false });
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
    getTemporalUsers()
      .then((tempUsers) => {
        const tempUser = tempUsers.find(user => user.cuid === cuid);

        if (!tempUser) {
          User.deleteOne({ cuid }).exec()
            .then((result) => {
              resolve(result.n ? { cuid } : null);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          userStorage = userStorage.filter(user => user.cuid !== cuid);
          resolve({ cuid });
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
  return new Promise((resolve, reject) => {
    User.updateOne({ cuid: user.cuid }, user).exec()
      .then((result) => {
        resolve(result.n ? { cuid } : null);
      }).catch((error) => {
        reject(error);
      });
  });
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
