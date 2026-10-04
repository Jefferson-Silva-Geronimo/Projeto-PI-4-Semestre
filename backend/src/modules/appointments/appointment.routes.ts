import { Router } from "express";

import { adminMiddleware } from "../../middlewares/admin.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";

import { appointmentController } from "./appointment.controller";
import {
  adminAgendaQuerySchema,
  appointmentIdParamsSchema,
  availabilityQuerySchema,
  createAppointmentSchema,
  updateAppointmentStatusSchema,
} from "./appointment.schemas";

const appointmentRoutes = Router();

appointmentRoutes.use(authMiddleware);

appointmentRoutes.get(
  "/",
  appointmentController.listByUser.bind(
    appointmentController,
  ),
);

appointmentRoutes.get(
  "/availability",
  validate(availabilityQuerySchema, "query"),
  appointmentController.availability.bind(
    appointmentController,
  ),
);

appointmentRoutes.get(
  "/admin",
  adminMiddleware,
  validate(adminAgendaQuerySchema, "query"),
  appointmentController.listAgenda.bind(
    appointmentController,
  ),
);

appointmentRoutes.post(
  "/",
  validate(createAppointmentSchema),
  appointmentController.create.bind(
    appointmentController,
  ),
);

appointmentRoutes.patch(
  "/:appointmentId/cancel",
  validate(appointmentIdParamsSchema, "params"),
  appointmentController.cancel.bind(
    appointmentController,
  ),
);

appointmentRoutes.patch(
  "/:appointmentId/status",
  adminMiddleware,
  validate(appointmentIdParamsSchema, "params"),
  validate(updateAppointmentStatusSchema),
  appointmentController.updateStatus.bind(
    appointmentController,
  ),
);

export { appointmentRoutes };
