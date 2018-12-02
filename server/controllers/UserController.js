import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';
import UsersService from '../services/UserService';
import User from '../models/User';

/**
 * Get all users
 * @param req
 * @param res
 * @returns void
 */
async function getUsers(req, res) {
  try {
    const users = await UsersService.getUsers();
    return res.json({ users });
  } catch (err) {
    return res.status(500).send(err);
  }
}

/**
 * Register a user
 * @param req
 * @param res
 * @returns void
 */
async function registerUser(req, res) {
  const newUser = new User({
    name: req.body.user.name,
    email: req.body.user.email,
    password: req.body.user.password,
  });

  newUser.name = sanitizeHtml(newUser.name);
  newUser.slug = slug(newUser.name.toLowerCase(), { lowercase: true });
  newUser.cuid = cuid();

  try {
    const user = await UsersService.registerUser(newUser);
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).send(err);
  }
}

/**
 * Get a single user
 * @param req
 * @param res
 * @returns void
 */
async function getUser(req, res) {
  try {
    const user = await UsersService.getUser(req.params.cuid);
    if (!user) {
      return res.status(404).send({ user });
    }
    return res.json({ user });
  } catch (err) {
    return res.status(500).send(err);
  }
}

/**
 * Delete a user
 * @param req
 * @param res
 * @returns void
 */
async function deleteUser(req, res) {
  try {
    const result = await UsersService.deleteUser(req.params.cuid);
    return res.status(result ? 200 : 404).json({ cuid: req.params.cuid });
  } catch (err) {
    return res.status(500).send(err);
  }
}

/**
 * Update a user
 * @param req
 * @param res
 * @returns void
 */
async function updateUser(req, res) {
  const { user } = req.body;
  user.cuid = req.params.cuid;
  if (user.name) user.slug = slug(user.name.toLowerCase(), { lowercase: true });
  try {
    const result = await UsersService.updateUser(user);
    return res.status(result ? 200 : 404).json({ cuid: req.params.cuid });
  } catch (err) {
    return res.status(500).send(err);
  }
}

export default {
  getUsers,
  registerUser,
  getUser,
  deleteUser,
  updateUser,
};
