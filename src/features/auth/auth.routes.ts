import { Router } from 'express'
import authController from './auth.controller'

const { signUpHandler, loginHandler } = authController

const authRouter = Router()

authRouter.post('/signup', signUpHandler);
authRouter.post('/login', loginHandler);

export default authRouter;
