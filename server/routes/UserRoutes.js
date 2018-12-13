import { Router } from 'express';
import cuidValidator from '../validators/CuidValidator';
import updateUserValidator from '../validators/UpdateUserValidator';
import registerUserValidator from '../validators/RegisterUserValidator';
import UserController from '../controllers/UserController';
import RoleRequired from '../middlewares/RoleRequired';

const router = new Router();

// Get all usersRoutes
router.get('/usersRoutes', RoleRequired('admin'), UserController.getUsers);

// Get one user by cuid
router.get('/usersRoutes/:cuid',
  [ RoleRequired('admin'), cuidValidator ],
  UserController.getUser);

// Add a new user
router.post('/usersRoutes',
  [ RoleRequired('admin'), registerUserValidator ],
  UserController.registerUser);

// Update a user
router.put('/usersRoutes/:cuid',
  [ RoleRequired('admin'), cuidValidator, updateUserValidator ],
  UserController.updateUser);

// Delete a user by cuid
router.delete('/usersRoutes/:cuid',
  [ RoleRequired('admin'), cuidValidator ],
  UserController.deleteUser);

export default router;
