import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = new Router();

// Get all users
router.get('/users', UserController.getUsers);

// Get one user by cuid
router.get('/users/:cuid', UserController.validate('getUser'), UserController.getUser);

// Add a new user
router.post('/users', UserController.validate('registerUser'), UserController.registerUser);

// Update a user
router.put('/users/:cuid', UserController.validate('updateUser'), UserController.updateUser);

// Delete a user by cuid
router.delete('/users/:cuid', UserController.validate('deleteUser'), UserController.deleteUser);

export default router;
