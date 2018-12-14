import { Router } from 'express';
import auth, { login, register, getCurrentUser } from '../middlewares/AuthMiddleware';
import RoleRequired from '../middlewares/RoleRequired';
import loginValidator from '../validators/LoginValidator';
import registerUserValidator from '../validators/RegisterUserValidator';

const router = new Router();

router.post('/login', loginValidator, login());
router.post('/signup', registerUserValidator, register());
router.get('/user', getCurrentUser());

export default router;
