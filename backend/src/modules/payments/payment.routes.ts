import { Router } from "express";

import {
  authMiddleware,
} from "../../middlewares/auth.middleware";
import {
  validate,
} from "../../middlewares/validation.middleware";

import {
  paymentController,
} from "./payment.controller";
import {
  createCheckoutSchema,
} from "./payment.schemas";

const paymentRoutes = Router();

paymentRoutes.use(authMiddleware);

paymentRoutes.post(
  "/checkout",
  validate(createCheckoutSchema),
  paymentController.createCheckout.bind(
    paymentController,
  ),
);

export { paymentRoutes };
