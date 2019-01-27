import cuid from 'cuid';
import sanitizeHtml from 'sanitize-html';
import UserService from '../services/UserService';
import User from '../models/User';
import wrapAsync from '../utils/wrapAsync';

/**
 * Get all users
 * @param req
 * @param res
 * @returns void
 */
async function getUsers(req, res) {
  const users = await UserService.getUsers();
  return res.status(200).json({ users });
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
  newUser.cuid = cuid();

  const user = await UserService.registerUser(newUser);
  return res.status(201).json(user);
}

/**
 * Get a single user
 * @param req
 * @param res
 * @returns void
 */
async function getUser(req, res) {
  const user = await UserService.getUser(req.params.cuid);
  if (!user) {
    return res.status(404).send({ user });
  }
  return res.status(200).json({ user });
}

/**
 * Delete a user
 * @param req
 * @param res
 * @returns void
 */
async function deleteUser(req, res) {
  const result = await UserService.deleteUser(req.params.cuid);
  return res.status(result ? 200 : 404).json({ cuid: req.params.cuid });
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
  const result = await UserService.updateUser(user);
  return res.status(result ? 200 : 404).json({ cuid: req.params.cuid });
}

export default {
  getUsers: wrapAsync(getUsers),
  registerUser: wrapAsync(registerUser),
  getUser: wrapAsync(getUser),
  deleteUser: wrapAsync(deleteUser),
  updateUser: wrapAsync(updateUser),
};
