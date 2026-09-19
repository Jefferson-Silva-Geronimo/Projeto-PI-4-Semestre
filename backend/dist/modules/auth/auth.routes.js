"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const admin_middleware_1 = require("../../middlewares/admin.middleware");
const authRoutes = (0, express_1.Router)();
exports.authRoutes = authRoutes;
const authController = auth_controller_1.AuthController.instance;
authRoutes.post("/register", authController.register.bind(authController));
authRoutes.post("/login", authController.login.bind(authController));
authRoutes.post("/forgot-password", authController.forgotPassword.bind(authController));
authRoutes.post("/reset-password", authController.resetPassword.bind(authController));
authRoutes.get("/me", auth_middleware_1.authMiddleware, authController.me.bind(authController));
authRoutes.get("/admin-test", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, (_, res) => {
    return res.json({
        message: "Área administrativa liberada.",
    });
});
//# sourceMappingURL=auth.routes.js.map