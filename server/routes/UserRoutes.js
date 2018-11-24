import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = new Router();

// Get all users
router.get('/users', UserController.getUsers);

// Get one user by cuid
router.get('/users/:cuid', UserController.getUser);

// Add a new user
router.post('/users', UserController.registerUser);

// Update a user
router.put('/users/:cuid', UserController.updateUser);

// Delete a user by cuid
router.delete('/users/:cuid', UserController.deleteUser);

export default router;
