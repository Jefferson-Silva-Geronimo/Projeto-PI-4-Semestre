"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const prisma_1 = require("../../database/prisma");
class ProductService {
    async create(data) {
        const product = await prisma_1.prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                priceInCents: data.priceInCents,
                stock: data.stock,
                imageUrl: data.imageUrl,
            },
        });
        return product;
    }
    async listAll() {
        const products = await prisma_1.prisma.product.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return products;
    }
    async listActive() {
        const products = await prisma_1.prisma.product.findMany({
            where: {
                active: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return products;
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map