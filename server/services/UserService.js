import cuid from 'cuid';
import User from '../models/User';

let userStorage = [];

function parseUser(user) {
  return {
    cuid: user.cuid,
    name: user.name,
    email: user.email,
    role: user.role,
    slug: user.slug,
    dateAdded: user.dateAdded,
  };
}

/**
 * Get all temporal users
 * @returns Promise
 */
async function getTemporalUsers() {
  return userStorage;
}

/**
 * Get all registered users
 * @returns Promise
 */
async function getRegisteredUsers() {
  return User.find()
    .select('cuid name email role slug dateAdded')
    .sort('-dateAdded')
    .exec();
}

/**
 * Get all users
 * @returns Promise
 */
async function getUsers() {
  let users = [];

  const temporalUsers = await getTemporalUsers();
  users = temporalUsers.map(user => ({ ...user, role: 'temporalUser' }));

  const registeredUsers = await getRegisteredUsers();
  users = users.concat(registeredUsers.map(user => (parseUser(user))));

  return users;
}

/**
 * Add a temporal user
 * @returns Promise
 */
async function addTemporalUser() {
  const newUser = {
    cuid: cuid(),
    dateAdded: new Date(),
  };
  userStorage.push(newUser);
  return { ...newUser, role: 'temporalUser' };
}

/**
 * Delete all temporal users
 * @returns Promise
 */
async function removeTemporalUsers() {
  userStorage = [];
}

/**
 * Register a user
 * @param user
 * @returns Promise
 */
async function registerUser(user) {
  const newUser = user;
  if (!newUser.cuid) newUser.cuid = cuid();
  const registeredUser = await User.create(newUser);
  return parseUser(registeredUser);
}

/**
 * Get a single user by cuid
 * @param cuid
 * @returns Promise
 */
async function getUser(cuid) {
  const temporalUser = (await getTemporalUsers()).find(user => user.cuid === cuid);

  if (!temporalUser) {
    const user = await User.findOne({ cuid }).select('cuid name email role slug dateAdded').exec();
    if (!user) {
      return null;
    }

    return parseUser(user);
  }

  return ({ ...temporalUser, role: 'temporalUser' });
}

/**
 * Get a single user by email
 * @param email
 * @returns Promise
 */
async function getUserByEmail(email) {
  const user = await User.findOne({ email }).select('cuid name email role slug dateAdded').exec();
  if (!user) {
    return null;
  }

  return parseUser(user);
}

/**
 * Get a single user by email and password
 * @param email
 * @param password
 * @returns Promise
 */
async function getUserByEmailAndPassword(email, password) {
  const user = await User.findOne({ email, password }).select('cuid name email password role slug dateAdded').exec();
  if (!user) {
    return null;
  }

  return parseUser(user);
}

/**
 * Delete a user by cuid
 * @param cuid
 * @returns Promise
 */
async function deleteUser(cuid) {
  const temporalUser = (await getTemporalUsers()).find(user => user.cuid === cuid);

  if (!temporalUser) {
    const result = await User.deleteOne({ cuid }).exec();
    return (result.n ? { cuid } : null);
  }
  userStorage = userStorage.filter(user => user.cuid !== cuid);
  return { cuid };
}

/**
 * Delete a temporal user by cuid
 * @param cuid
 * @returns Promise
 */
async function deleteTemporalUser(cuid) {
  const temporalUser = (await getTemporalUsers()).find(user => user.cuid === cuid);

  if (!temporalUser) {
    return null;
  }
  userStorage = userStorage.filter(user => user.cuid !== cuid);
  return { cuid };
}

/**
 * Update a registered user
 * @param user
 * @returns Promise
 */
async function updateUser(user) {
  const result = await User.updateOne({ cuid: user.cuid }, user).exec();
  return (result.n ? { cuid } : null);
}

export default {
  deleteUser,
  deleteTemporalUser,
  getUser,
  getUserByEmail,
  getUserByEmailAndPassword,
  addTemporalUser,
  removeTemporalUsers,
  registerUser,
  getUsers,
  updateUser,
};
