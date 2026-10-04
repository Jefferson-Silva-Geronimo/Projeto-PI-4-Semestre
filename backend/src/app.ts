import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env";

import { errorMiddleware } from "./middlewares/error.middleware";

import { appointmentRoutes } from "./modules/appointments/appointment.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { cartRoutes } from "./modules/cart/cart.routes";
import { orderRoutes } from "./modules/orders/order.routes";
import { paymentRoutes } from "./modules/payments/payment.routes";
import { petRoutes } from "./modules/pets/pet.routes";
import { productRoutes } from "./modules/products/product.routes";
import { serviceRoutes } from "./modules/services/service.routes";

import { AppError } from "./shared/errors/AppError";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin:
      env.CORS_ORIGIN === "*"
        ? true
        : env.CORS_ORIGIN
            .split(",")
            .map((origin) => origin.trim()),

    methods: [
      "GET",
      "POST",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  }),
);

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.get("/", (_req, res) => {
  return res.status(200).json({
    message: "API PetShop Online",
  });
});

app.get("/health", (_req, res) => {
  return res.status(200).json({
    status: "ok",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);
app.use("/pets", petRoutes);
app.use("/services", serviceRoutes);
app.use("/appointments", appointmentRoutes);

app.use((_req, _res, next) => {
  return next(
    new AppError(
      "Rota não encontrada.",
      404,
      "ROUTE_NOT_FOUND",
    ),
  );
});

app.use(errorMiddleware);

export { app };
