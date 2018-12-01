import { Router } from 'express';
import UserController from '../controllers/UserController';
import RoleRequired from '../middlewares/RoleRequired';

const router = new Router();

// Get all users
router.get('/users', RoleRequired('admin'), UserController.getUsers);

// Get one user by cuid
router.get('/users/:cuid', RoleRequired('admin'), UserController.getUser);

// Add a new user
router.post('/users', RoleRequired('admin'), UserController.registerUser);

// Update a user
router.put('/users/:cuid', RoleRequired('admin'), UserController.updateUser);

// Delete a user by cuid
router.delete('/users/:cuid', RoleRequired('admin'), UserController.deleteUser);

export default router;
