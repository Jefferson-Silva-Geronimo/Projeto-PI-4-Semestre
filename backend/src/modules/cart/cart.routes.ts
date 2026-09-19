import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";

import { cartController } from "./cart.controller";
import {
  addCartItemSchema,
  cartItemIdParamsSchema,
  updateCartItemSchema,
} from "./cart.schemas";

const cartRoutes = Router();

cartRoutes.use(authMiddleware);

cartRoutes.get(
  "/",
  cartController.get.bind(cartController),
);

cartRoutes.post(
  "/items",
  validate(addCartItemSchema),
  cartController.addItem.bind(cartController),
);

cartRoutes.patch(
  "/items/:itemId",
  validate(cartItemIdParamsSchema, "params"),
  validate(updateCartItemSchema),
  cartController.updateItem.bind(cartController),
);

cartRoutes.delete(
  "/items/:itemId",
  validate(cartItemIdParamsSchema, "params"),
  cartController.removeItem.bind(cartController),
);

cartRoutes.delete(
  "/",
  cartController.clear.bind(cartController),
);

export { cartRoutes };