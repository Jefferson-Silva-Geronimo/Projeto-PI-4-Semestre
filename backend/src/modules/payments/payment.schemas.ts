import { z } from "zod";

/*
 * O valor e os itens do pagamento são sempre calculados
 * a partir do carrinho salvo no banco. O cliente não envia
 * preço, quantidade ou identificadores de produto nesta rota.
 */
export const createCheckoutSchema = z
  .object({})
  .strict()
  .default({});
