"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const admin_middleware_1 = require("../../middlewares/admin.middleware");
const productRoutes = (0, express_1.Router)();
exports.productRoutes = productRoutes;
const productController = new product_controller_1.ProductController();
productRoutes.get('/', auth_middleware_1.authMiddleware, productController.listActive.bind(productController));
productRoutes.get('/admin', auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, productController.listAll.bind(productController));
productRoutes.post('/', auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, productController.create.bind(productController));
//# sourceMappingURL=product.routes.js.map