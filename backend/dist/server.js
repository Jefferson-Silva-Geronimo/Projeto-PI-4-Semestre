"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = require("./modules/auth/auth.routes");
const payment_routes_1 = require("./modules/payments/payment.routes");
const product_routes_1 = require("./modules/products/product.routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (_, res) => {
    return res.json({
        message: "API PetShop Online",
    });
});
app.use("/auth", auth_routes_1.authRoutes);
app.use("/products", product_routes_1.productRoutes);
app.use("/payments", payment_routes_1.paymentRoutes);
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
//# sourceMappingURL=server.js.map