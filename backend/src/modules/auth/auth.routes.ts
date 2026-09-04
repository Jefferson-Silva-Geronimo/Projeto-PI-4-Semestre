import { Router } from 'express';
import { AuthController } from './auth.controller';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post(
  '/register',
  authController.register.bind(authController)
);

authRoutes.post(
  '/login',
  authController.login.bind(authController)
);

authRoutes.post(
  '/forgot-password',
  authController.forgotPassword.bind(
    authController
  )
);

export { authRoutes };