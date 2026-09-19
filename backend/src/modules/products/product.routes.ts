import { Router } from "express";

import { adminMiddleware } from "../../middlewares/admin.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";

import { productController } from "./product.controller";
import {
  createProductSchema,
  productIdParamsSchema,
  productListQuerySchema,
  updateProductSchema,
  updateProductStatusSchema,
} from "./product.schemas";

const productRoutes = Router();

productRoutes.use(authMiddleware);

productRoutes.get(
  "/",
  validate(productListQuerySchema, "query"),
  productController.listActive.bind(productController),
);

productRoutes.get(
  "/admin",
  adminMiddleware,
  validate(productListQuerySchema, "query"),
  productController.listAll.bind(productController),
);

productRoutes.get(
  "/admin/:productId",
  adminMiddleware,
  validate(productIdParamsSchema, "params"),
  productController.findByIdForAdmin.bind(productController),
);

productRoutes.post(
  "/",
  adminMiddleware,
  validate(createProductSchema),
  productController.create.bind(productController),
);

productRoutes.patch(
  "/:productId/status",
  adminMiddleware,
  validate(productIdParamsSchema, "params"),
  validate(updateProductStatusSchema),
  productController.updateStatus.bind(productController),
);

productRoutes.patch(
  "/:productId",
  adminMiddleware,
  validate(productIdParamsSchema, "params"),
  validate(updateProductSchema),
  productController.update.bind(productController),
);

productRoutes.delete(
  "/:productId",
  adminMiddleware,
  validate(productIdParamsSchema, "params"),
  productController.deactivate.bind(productController),
);

productRoutes.get(
  "/:productId",
  validate(productIdParamsSchema, "params"),
  productController.findActiveById.bind(productController),
);

export { productRoutes };