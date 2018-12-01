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
  if (validate('registerUser', req, res)) {
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

  return null;
}

/**
 * Get a single user
 * @param req
 * @param res
 * @returns void
 */
async function getUser(req, res) {
  if (validate('getUser', req, res)) {
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

  return null;
}

/**
 * Delete a user
 * @param req
 * @param res
 * @returns void
 */
async function deleteUser(req, res) {
  if (validate('deleteUser', req, res)) {
    try {
      const result = await UsersService.deleteUser(req.params.cuid);
      return res.status(result ? 200 : 404).json({ cuid: req.params.cuid });
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  return null;
}

/**
 * Update a user
 * @param req
 * @param res
 * @returns void
 */
async function updateUser(req, res) {
  if (validate('updateUser', req, res)) {
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

  return null;
}

/**
 * Validate the request, returns true if it is isValid, false otherwise
 * @param method
 * @param req
 * @param res
 * @returns boolean
 */
function validate(method, req, res) {
  switch (method) {
    case 'deleteUser':
    case 'getUser': {
      req.checkParams('cuid').exists().isAlphanumeric().isLength({ min: 25, max: 25 });
      break;
    }
    case 'updateUser': {
      req.checkParams('cuid').exists().isAlphanumeric().isLength({ min: 25, max: 25 });
      req.checkBody('user.email', 'Invalid email').optional().isEmail();
      req.checkBody('user.name', 'Invalid name').optional().isAlphanumeric().isLength({ min: 3, max: 25 });
      req.checkBody('user.password', 'Invalid password').optional().isLength({ min: 5, max: 40 });
      break;
    }
    case 'registerUser': {
      req.checkBody('user.email', 'Invalid email').exists().isEmail();
      req.checkBody('user.name', 'Invalid name').exists().isAlphanumeric().isLength({ min: 3, max: 25 });
      req.checkBody('user.password', 'Invalid password').exists().isLength({ min: 5, max: 40 });
      break;
    }
    default: return res.status(500).end();
  }

  const errors = req.validationErrors();
  if (errors) {
    res.status(400).json({ errors });
    return false;
  }

  return true;
}

export default {
  login,
  signup,
  getUsers,
  registerUser,
  getUser,
  deleteUser,
  updateUser,
};
