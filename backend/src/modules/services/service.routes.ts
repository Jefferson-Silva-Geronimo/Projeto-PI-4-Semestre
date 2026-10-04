import { Router } from "express";

import { adminMiddleware } from "../../middlewares/admin.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";

import { serviceController } from "./service.controller";
import {
  createServiceSchema,
  serviceIdParamsSchema,
  updateServiceSchema,
  updateServiceStatusSchema,
} from "./service.schemas";

const serviceRoutes = Router();

serviceRoutes.use(authMiddleware);

serviceRoutes.get(
  "/",
  serviceController.listActive.bind(serviceController),
);

serviceRoutes.get(
  "/admin",
  adminMiddleware,
  serviceController.listAll.bind(serviceController),
);

serviceRoutes.get(
  "/admin/:serviceId",
  adminMiddleware,
  validate(serviceIdParamsSchema, "params"),
  serviceController.findById.bind(serviceController),
);

serviceRoutes.post(
  "/",
  adminMiddleware,
  validate(createServiceSchema),
  serviceController.create.bind(serviceController),
);

serviceRoutes.patch(
  "/:serviceId/status",
  adminMiddleware,
  validate(serviceIdParamsSchema, "params"),
  validate(updateServiceStatusSchema),
  serviceController.updateStatus.bind(serviceController),
);

serviceRoutes.patch(
  "/:serviceId",
  adminMiddleware,
  validate(serviceIdParamsSchema, "params"),
  validate(updateServiceSchema),
  serviceController.update.bind(serviceController),
);

serviceRoutes.delete(
  "/:serviceId",
  adminMiddleware,
  validate(serviceIdParamsSchema, "params"),
  serviceController.remove.bind(serviceController),
);

export { serviceRoutes };
