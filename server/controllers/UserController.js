import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';
import validate from 'express-validation';
import UserValidation from './validations/UserValidation';
import UsersService from '../services/UsersService';
import User from '../models/User';

/**
 * Get all users
 * @param req
 * @param res
 * @returns void
 */
function getUsers(req, res) {
  UsersService.getUsers()
    .then((users) => {
      res.json({ users });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

/**
 * Register a user
 * @param req
 * @param res
 * @returns void
 */
function registerUser(req, res) {
  // validate(UserValidation)(req, res, (req, res) => {
  const newUser = new User({
    name: req.body.user.name,
    email: req.body.user.email,
    password: req.body.user.password,
  });

  newUser.name = sanitizeHtml(newUser.name);
  newUser.slug = slug(newUser.name.toLowerCase(), { lowercase: true });
  newUser.cuid = cuid();

  UsersService.registerUser(newUser)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  // });
}

/**
 * Get a single user
 * @param req
 * @param res
 * @returns void
 */
function getUser(req, res) {
  if (!req.params.cuid) {
    res.status(400).end();
  } else {
    UsersService.getUser(req.params.cuid)
      .then((user) => {
        if (!user) {
          res.status(404).send({ user });
        } else {
          res.json({ user });
        }
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
}

/**
 * Delete a user
 * @param req
 * @param res
 * @returns void
 */
function deleteUser(req, res) {
  if (!req.params.cuid) {
    res.status(400).end();
  } else {
    UsersService.deleteUser(req.params.cuid)
      .then((result) => {
        res.status(result ? 200 : 404).json({ cuid: req.params.cuid });
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
}

/**
 * Update a user
 * @param req
 * @param res
 * @returns void
 */
function updateUser(req, res) {
  // TODO validar body

  if (!req.params.cuid) {
    res.status(400).end();
  } else {
    UsersService.updateUser()
      .then((result) => {
        res.status(result ? 201 : 404).json({ cuid: req.params.cuid });
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
}

export default {
  getUsers,
  registerUser,
  getUser,
  deleteUser,
  updateUser,
};
