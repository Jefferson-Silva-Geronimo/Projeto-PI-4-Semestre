import { z } from "zod";

export const cartItemIdParamsSchema = z
  .object({
    itemId: z
      .string()
      .uuid(
        "O identificador do item do carrinho é inválido.",
      ),
  })
  .strict();

export const addCartItemSchema = z
  .object({
    productId: z
      .string()
      .uuid(
        "O identificador do produto é inválido.",
      ),

    quantity: z
      .number()
      .int(
        "A quantidade deve ser um número inteiro.",
      )
      .min(
        1,
        "A quantidade deve ser maior que zero.",
      )
      .max(
        99,
        "A quantidade máxima por produto é 99.",
      ),
  })
  .strict();

export const updateCartItemSchema = z
  .object({
    quantity: z
      .number()
      .int(
        "A quantidade deve ser um número inteiro.",
      )
      .min(
        1,
        "A quantidade deve ser maior que zero.",
      )
      .max(
        99,
        "A quantidade máxima por produto é 99.",
      ),
  })
  .strict();

export type AddCartItemInput = z.infer<
  typeof addCartItemSchema
>;

export type UpdateCartItemInput = z.infer<
  typeof updateCartItemSchema
>;