import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(3000),

  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL não foi informada."),

  DIRECT_URL: z
    .string()
    .min(1, "DIRECT_URL não foi informada."),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET deve ter pelo menos 32 caracteres."),

  JWT_EXPIRES_IN: z
    .string()
    .default("7d"),

  CORS_ORIGIN: z
    .string()
    .default("*"),

  MERCADOPAGO_ACCESS_TOKEN: z
    .string()
    .min(
      1,
      "MERCADOPAGO_ACCESS_TOKEN não foi informado.",
    ),

  MERCADOPAGO_RETURN_URL: z
    .string()
    .url(
      "MERCADOPAGO_RETURN_URL deve ser uma URL válida.",
    ),

  MERCADOPAGO_WEBHOOK_SECRET: z
    .string()
    .min(
      1,
      "MERCADOPAGO_WEBHOOK_SECRET não foi informado.",
    ),

  MERCADOPAGO_WEBHOOK_URL: z
    .string()
    .url(
      "MERCADOPAGO_WEBHOOK_URL deve ser uma URL válida.",
    ),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Variáveis de ambiente inválidas:");

  console.error(
    result.error.flatten().fieldErrors,
  );

  process.exit(1);
}

export const env = result.data;
