import cuid from 'cuid';
import User from '../models/User';

let userStorage = [];

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
    .select('cuid name email slug dateAdded')
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
  users = temporalUsers.map(user => ({ ...user, registered: false }));

  const registeredUsers = await getRegisteredUsers();
  users = users.concat(registeredUsers.map(user => (
    {
      cuid: user.cuid,
      name: user.name,
      email: user.email,
      slug: user.slug,
      dateAdded: user.dateAdded,
      registered: true,
    })));

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
  return newUser;
}

async function removeTemporalUsers() {
  userStorage = [];
}

/**
 * Register a user
 * @param user
 * @returns Promise
 */
async function registerUser(user) {
  const newUser = await User.create(user);
  return {
    cuid: newUser.cuid,
    name: newUser.name,
    email: newUser.email,
    slug: newUser.slug,
    dateAdded: newUser.dateAdded,
    registered: true,
  };
}

/**
 * Get a single user by cuid
 * @param cuid
 * @returns Promise
 */
async function getUser(cuid) {
  const temporalUser = (await getTemporalUsers()).find(user => user.cuid === cuid);

  if (!temporalUser) {
    const user = await User.findOne({ cuid }).select('cuid name email slug dateAdded').exec();

    if (!user) {
      return null;
    }

    return {
      cuid: user.cuid,
      name: user.name,
      email: user.email,
      slug: user.slug,
      dateAdded: user.dateAdded,
      registered: true,
    };
  }

  return ({ ...temporalUser, registered: false });
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
  getUser,
  addTemporalUser,
  removeTemporalUsers,
  registerUser,
  getUsers,
  updateUser,
};
