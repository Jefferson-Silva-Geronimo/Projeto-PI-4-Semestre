"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const prisma_1 = require("../../database/prisma");
const mercadopago_1 = require("../../mercadopago");
class PaymentService {
    async createPreference(data, userId) {
        if (!Array.isArray(data.items) || data.items.length === 0) {
            throw new Error("Informe ao menos um produto.");
        }
        const productIds = data.items.map((item) => item.productId);
        if (new Set(productIds).size !== productIds.length) {
            throw new Error('Não repita produtos na mesma compra.');
        }
        const products = await prisma_1.prisma.product.findMany({
            where: {
                id: { in: productIds },
                active: true,
            },
        });
        if (products.length !== new Set(productIds).size) {
            throw new Error("Um ou mais produtos não estão disponíveis.");
        }
        const productsById = new Map(products.map((product) => [product.id, product]));
        const items = data.items.map((item) => {
            if (!Number.isInteger(item.quantity) || item.quantity < 1) {
                throw new Error("A quantidade deve ser um inteiro positivo.");
            }
            const product = productsById.get(item.productId);
            if (!product || item.quantity > product.stock) {
                throw new Error(`Estoque insuficiente para ${product?.name ?? "o produto"}.`);
            }
            return {
                id: product.id,
                title: product.name,
                description: product.description,
                picture_url: product.imageUrl,
                quantity: item.quantity,
                currency_id: "BRL",
                unit_price: product.priceInCents / 100,
            };
        });
        const preference = await mercadopago_1.preferenceClient.create({
            body: {
                items,
                external_reference: userId,
                notification_url: process.env.MERCADO_PAGO_WEBHOOK_URL,
                back_urls: process.env.MERCADO_PAGO_SUCCESS_URL
                    ? {
                        success: process.env.MERCADO_PAGO_SUCCESS_URL,
                        pending: process.env.MERCADO_PAGO_PENDING_URL,
                        failure: process.env.MERCADO_PAGO_FAILURE_URL,
                    }
                    : undefined,
            },
        });
        return {
            id: preference.id,
            initPoint: preference.init_point,
            sandboxInitPoint: preference.sandbox_init_point,
        };
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map