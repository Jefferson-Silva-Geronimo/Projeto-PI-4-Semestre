import { z } from "zod";

export const orderIdParamsSchema = z
  .object({
    orderId: z
      .string()
      .uuid(
        "O identificador do pedido é inválido.",
      ),
  })
  .strict();

export const orderListQuerySchema = z
  .object({
    page: z.coerce
      .number()
      .int(
        "A página deve ser um número inteiro.",
      )
      .positive(
        "A página deve ser maior que zero.",
      )
      .default(1),

    pageSize: z.coerce
      .number()
      .int(
        "O tamanho da página deve ser um número inteiro.",
      )
      .min(
        1,
        "O tamanho da página deve ser maior que zero.",
      )
      .max(
        100,
        "O tamanho máximo da página é 100.",
      )
      .default(20),
  })
  .strict();

export const updateOrderStatusSchema = z
  .object({
    status: z.enum(
      [
        "CONFIRMED",
        "PROCESSING",
        "COMPLETED",
        "CANCELLED",
      ],
      {
        error:
          "O status informado é inválido.",
      },
    ),
  })
  .strict();

export type OrderListQuery = z.infer<
  typeof orderListQuerySchema
>;

export type UpdateOrderStatusInput = z.infer<
  typeof updateOrderStatusSchema
>;