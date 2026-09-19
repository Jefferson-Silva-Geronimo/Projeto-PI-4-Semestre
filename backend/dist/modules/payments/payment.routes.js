"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const payment_controller_1 = require("./payment.controller");
const paymentRoutes = (0, express_1.Router)();
exports.paymentRoutes = paymentRoutes;
const paymentController = new payment_controller_1.PaymentController();
paymentRoutes.post("/preference", auth_middleware_1.authMiddleware, paymentController.createPreference.bind(paymentController));
//# sourceMappingURL=payment.routes.js.map