import { Router } from 'express';
import { login, register, getCurrentUser } from '../middlewares/AuthMiddleware';
import loginValidator from '../validators/LoginValidator';
import registerUserValidator from '../validators/RegisterUserValidator';

const router = new Router();

router.post('/login', loginValidator, login());
router.post('/signup', registerUserValidator, register());
router.get('/user', getCurrentUser());

export default router;
