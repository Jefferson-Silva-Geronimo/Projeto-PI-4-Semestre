import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";

import { petController } from "./pet.controller";
import {
  createPetSchema,
  petIdParamsSchema,
  updatePetSchema,
} from "./pet.schemas";

const petRoutes = Router();

petRoutes.use(authMiddleware);

petRoutes.get(
  "/",
  petController.list.bind(petController),
);

petRoutes.post(
  "/",
  validate(createPetSchema),
  petController.create.bind(petController),
);

petRoutes.get(
  "/:petId",
  validate(petIdParamsSchema, "params"),
  petController.findById.bind(petController),
);

petRoutes.patch(
  "/:petId",
  validate(petIdParamsSchema, "params"),
  validate(updatePetSchema),
  petController.update.bind(petController),
);

petRoutes.delete(
  "/:petId",
  validate(petIdParamsSchema, "params"),
  petController.remove.bind(petController),
);

export { petRoutes };
