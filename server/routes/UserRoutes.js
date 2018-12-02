import { Router } from 'express';
import cuidValidator from '../validators/CuidValidator';
import updateUserValidator from '../validators/UpdateUserValidator';
import registerUserValidator from '../validators/RegisterUserValidator';
import UserController from '../controllers/UserController';
import RoleRequired from '../middlewares/RoleRequired';

const router = new Router();

// Get all users
router.get('/users', RoleRequired('admin'), UserController.getUsers);

// Get one user by cuid
router.get('/users/:cuid',
  [ RoleRequired('admin'), cuidValidator ],
  UserController.getUser);

// Add a new user
router.post('/users',
  [ RoleRequired('admin'), registerUserValidator ],
  UserController.registerUser);

// Update a user
router.put('/users/:cuid',
  [ RoleRequired('admin'), cuidValidator, updateUserValidator ],
  UserController.updateUser);

// Delete a user by cuid
router.delete('/users/:cuid',
  [ RoleRequired('admin'), cuidValidator ],
  UserController.deleteUser);

export default router;
