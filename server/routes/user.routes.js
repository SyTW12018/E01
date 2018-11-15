import { Router } from 'express';
import * as UserController from '../controllers/user.controller';

const router = new Router();

// Get all users
router.route('/users').get(UserController.getUsers);

// Get one user by cuid
router.route('/users/:cuid').get(UserController.getUser);


// TODO Eliminar
//router.route('/users/add').get(UserController.getUser);

// Add a new user
router.route('/users').post(UserController.addUser);

// Delete a user by cuid
router.route('/users/:cuid').delete(UserController.deleteUser);

export default router;
