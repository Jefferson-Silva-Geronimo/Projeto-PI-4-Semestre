import { MercadoPagoConfig } from "mercadopago";

import { env } from "../../config/env";

export const mercadoPagoClient =
  new MercadoPagoConfig({
    accessToken:
      env.MERCADOPAGO_ACCESS_TOKEN,
  });
