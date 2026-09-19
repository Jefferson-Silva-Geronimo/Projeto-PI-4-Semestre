import { MercadoPagoConfig, Preference } from "mercadopago";

const accessToken =
  process.env.MERCADO_PAGO_ACCESS_TOKEN || process.env.MERCADO_PAGO_ACESS_TOKEN;

if (!accessToken) {
  throw new Error("MERCADO_PAGO_ACCESS_TOKEN não foi configurado.");
}

const client = new MercadoPagoConfig({
  accessToken,
});

export const preferenceClient = new Preference(client);
