import { Router } from 'express';
import cuidValidator from '../validators/CuidValidator';
import registerUserValidator from '../validators/RegisterUserValidator';
import UserController from '../controllers/UserController';
import RoleRequired from '../middlewares/RoleRequired';

const UserRoutes = new Router();

// Get all users
UserRoutes.get('/users', RoleRequired('admin'), UserController.getUsers);

// Get one user by cuid
UserRoutes.get('/users/:cuid',
  [ RoleRequired('admin'), cuidValidator ],
  UserController.getUser);

// Add a new user
UserRoutes.post('/users',
  [ RoleRequired('admin'), registerUserValidator ],
  UserController.registerUser);

// Update a user
UserRoutes.put('/users/:cuid',
  [ RoleRequired('admin'), cuidValidator, registerUserValidator ],
  UserController.updateUser);

// Delete a user by cuid
UserRoutes.delete('/users/:cuid',
  [ RoleRequired('admin'), cuidValidator ],
  UserController.deleteUser);

export default UserRoutes;
