import { Router } from 'express';
import { login, register, getCurrentUser } from '../middlewares/AuthMiddleware';
import loginValidator from '../validators/LoginValidator';
import registerUserValidator from '../validators/RegisterUserValidator';

const AuthRoutes = new Router();

AuthRoutes.post('/login', loginValidator, login());
AuthRoutes.post('/signup', registerUserValidator, register());
AuthRoutes.get('/user', getCurrentUser());

export default AuthRoutes;
