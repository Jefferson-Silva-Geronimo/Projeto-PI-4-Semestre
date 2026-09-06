import { Router } from 'express';
import { ProductController } from './product.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { adminMiddleware } from '../../middlewares/admin.middleware';

const productRoutes = Router();
const productController = new ProductController();

productRoutes.get(
  '/',
  authMiddleware,
  productController.listActive.bind(productController)
);

productRoutes.get(
  '/admin',
  authMiddleware,
  adminMiddleware,
  productController.listAll.bind(productController)
);

productRoutes.post(
  '/',
  authMiddleware,
  adminMiddleware,
  productController.create.bind(productController)
);

export { productRoutes };