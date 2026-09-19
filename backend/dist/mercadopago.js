"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preferenceClient = void 0;
const mercadopago_1 = require("mercadopago");
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || process.env.MERCADO_PAGO_ACESS_TOKEN;
if (!accessToken) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN não foi configurado.");
}
const client = new mercadopago_1.MercadoPagoConfig({
    accessToken,
});
exports.preferenceClient = new mercadopago_1.Preference(client);
//# sourceMappingURL=mercadopago.js.map