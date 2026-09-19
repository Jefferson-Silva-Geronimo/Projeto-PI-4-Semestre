import { Router } from "express";

import { adminMiddleware } from "../../middlewares/admin.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";

import { orderController } from "./order.controller";
import {
  orderIdParamsSchema,
  orderListQuerySchema,
  updateOrderStatusSchema,
} from "./order.schemas";

const orderRoutes = Router();

orderRoutes.use(authMiddleware);

orderRoutes.get(
  "/admin",
  adminMiddleware,
  validate(orderListQuerySchema, "query"),
  orderController.listForAdmin.bind(
    orderController,
  ),
);

orderRoutes.get(
  "/admin/:orderId",
  adminMiddleware,
  validate(orderIdParamsSchema, "params"),
  orderController.findForAdmin.bind(
    orderController,
  ),
);

orderRoutes.patch(
  "/admin/:orderId/status",
  adminMiddleware,
  validate(orderIdParamsSchema, "params"),
  validate(updateOrderStatusSchema),
  orderController.updateStatus.bind(
    orderController,
  ),
);

orderRoutes.post(
  "/",
  orderController.create.bind(
    orderController,
  ),
);

orderRoutes.get(
  "/",
  validate(orderListQuerySchema, "query"),
  orderController.listForUser.bind(
    orderController,
  ),
);

orderRoutes.get(
  "/:orderId",
  validate(orderIdParamsSchema, "params"),
  orderController.findForUser.bind(
    orderController,
  ),
);

export { orderRoutes };