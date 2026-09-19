import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { PaymentController } from "./payment.controller";

const paymentRoutes = Router();
const paymentController = new PaymentController();

paymentRoutes.post(
  "/preference",
  authMiddleware,
  paymentController.createPreference.bind(paymentController),
);

export { paymentRoutes };
