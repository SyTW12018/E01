import { Router } from 'express';
import {
  login, register, update, getCurrentUser,
} from '../middlewares/AuthMiddleware';
import loginValidator from '../validators/LoginValidator';
import registerUserValidator from '../validators/RegisterUserValidator';
import updateUserValidator from '../validators/UpdateUserValidator';

const AuthRoutes = new Router();

AuthRoutes.post('/login', loginValidator, login());
AuthRoutes.post('/register', registerUserValidator, register());
AuthRoutes.post('/update', updateUserValidator, update());
AuthRoutes.get('/user', getCurrentUser());

export default AuthRoutes;
