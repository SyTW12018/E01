import cuid from 'cuid';
import bcrypt from 'bcrypt';
import slug from 'limax';
import User from '../models/User';

let userStorage = [];
let tempCount = 0;

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
 * @returns {Promise<Array>}
 */
async function getTemporalUsers() {
  return userStorage;
}

/**
 * Get all registered users
 * @returns {Promise}
 */
async function getRegisteredUsers() {
  return User.find()
    .select('cuid name email role slug dateAdded')
    .sort('-dateAdded')
    .exec();
}

/**
 * Get all users
 * @returns {Promise<Array>}
 */
async function getUsers() {
  const temporalUsers = await getTemporalUsers();
  let users = temporalUsers.map(user => ({ ...user, role: 'temporalUser' }));

  const registeredUsers = await getRegisteredUsers();
  users = users.concat(registeredUsers.map(user => (parseUser(user))));

  return users;
}

/**
 * Add a temporal user
 * @returns {Promise<{cuid: string, role: string, dateAdded: Date}>}
 */
async function addTemporalUser() {
  const newUser = {
    cuid: cuid(),
    name: `Anonymous ${tempCount}`,
    dateAdded: new Date(),
  };
  userStorage.push(newUser);
  tempCount += 1;
  return { ...newUser, role: 'temporalUser' };
}

/**
 * Delete all temporal users
 * @returns {Promise<void>}
 */
async function removeTemporalUsers() {
  userStorage = [];
}

/**
 * Register a user
 * @param user
 * @returns {Promise<{cuid, role, name, email, slug, dateAdded}>}
 */
async function registerUser(user) {
  const newUser = user;
  if (!newUser.cuid) newUser.cuid = cuid();
  newUser.slug = slug(newUser.name.toLowerCase(), { lowercase: true });
  newUser.password = await bcrypt.hash(newUser.password, 5);
  const registeredUser = await User.create(newUser);
  return parseUser(registeredUser);
}

/**
 * Get a single user by cuid
 * @param cuid
 * @returns {Promise<*>}
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
 * @returns {Promise<*>}
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
 * @returns {Promise<*>}
 */
async function getUserByEmailAndPassword(email, password) {
  if (!email || !password) return null;

  const user = await User.findOne({ email }).select('cuid name email password role slug dateAdded').exec();
  if (!user) {
    return null;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return null;
  }

  return parseUser(user);
}

/**
 * Delete a user by cuid
 * @param cuid
 * @returns {Promise<*>}
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
 * @returns {Promise<*>}
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
 * @returns {Promise<*>}
 */
async function updateUser(user) {
  const updatedUser = user;
  if (updatedUser.name) updatedUser.slug = slug(updatedUser.name.toLowerCase(), { lowercase: true });

  let result;
  if (updatedUser.password && updatedUser.password !== '') {
    updatedUser.password = await bcrypt.hash(updatedUser.password, 5);
    result = await User.updateOne({ cuid: updatedUser.cuid },
      {
        $set: {
          name: updatedUser.name,
          slug: updatedUser.slug,
          email: updatedUser.email,
          password: updatedUser.password,
        },
      }).exec();
  } else {
    result = await User.updateOne({ cuid: updatedUser.cuid },
      {
        $set: {
          name: updatedUser.name,
          slug: updatedUser.slug,
          email: updatedUser.email,
        },
      }).exec();
  }
  return (result.n ? { cuid: updatedUser.cuid } : null);
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
