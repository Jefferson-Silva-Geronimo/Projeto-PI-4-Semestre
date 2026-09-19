"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("./payment.service");
class PaymentController {
    paymentService = new payment_service_1.PaymentService();
    async createPreference(req, res) {
        try {
            const user = req.user;
            const preference = await this.paymentService.createPreference(req.body, user.userId);
            return res.status(201).json(preference);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao criar preferência de pagamento.",
            });
        }
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map