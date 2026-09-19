import { Router } from "express";
import { rateLimit } from "express-rate-limit";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";

import { authController } from "./auth.controller";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.schemas";

const authRoutes = Router();

const authenticationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message:
        "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
    },
  },
});

const passwordRecoveryLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  limit: 10,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    error: {
      code: "PASSWORD_RECOVERY_RATE_LIMIT",
      message:
        "Muitas solicitações de recuperação. Aguarde antes de tentar novamente.",
    },
  },
});

authRoutes.post(
  "/register",
  authenticationLimiter,
  validate(registerSchema),
  authController.register.bind(authController),
);

authRoutes.post(
  "/login",
  authenticationLimiter,
  validate(loginSchema),
  authController.login.bind(authController),
);

authRoutes.post(
  "/forgot-password",
  passwordRecoveryLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword.bind(authController),
);

authRoutes.post(
  "/reset-password",
  passwordRecoveryLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword.bind(authController),
);

authRoutes.get(
  "/me",
  authMiddleware,
  authController.me.bind(authController),
);

export { authRoutes };