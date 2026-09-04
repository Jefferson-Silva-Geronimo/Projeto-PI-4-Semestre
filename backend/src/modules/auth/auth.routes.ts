import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { adminMiddleware } from '../../middlewares/admin.middleware';

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

authRoutes.post(
  '/reset-password',
  authController.resetPassword.bind(
    authController
  )
);

authRoutes.get(
  '/me',
  authMiddleware,
  authController.me.bind(authController)
);

authRoutes.get(
  '/admin-test',
  authMiddleware,
  adminMiddleware,
  (_, res) => {
    return res.json({
      message: 'Área administrativa liberada.',
    });
  }
);

export { authRoutes };