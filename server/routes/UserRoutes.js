import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = new Router();

// Get all users
router.route('/users').get(UserController.getUsers);

// Get one user by cuid
router.route('/users/:cuid').get(UserController.getUser);

// Add a new user
router.route('/users').post(UserController.registerUser);

// Update a user
router.route('/users/:cuid').put(UserController.updateUser);

// Delete a user by cuid
router.route('/users/:cuid').delete(UserController.deleteUser);

export default router;
