"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("./product.service");
class ProductController {
    productService = new product_service_1.ProductService();
    async create(req, res) {
        try {
            const product = await this.productService.create(req.body);
            return res.status(201).json(product);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : 'Erro ao cadastrar produto.',
            });
        }
    }
    async listAll(req, res) {
        try {
            const products = await this.productService.listAll();
            return res.status(200).json(products);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : 'Erro ao listar produtos.',
            });
        }
    }
    async listActive(req, res) {
        try {
            const products = await this.productService.listActive();
            return res.status(200).json(products);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : 'Erro ao listar produtos.',
            });
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map