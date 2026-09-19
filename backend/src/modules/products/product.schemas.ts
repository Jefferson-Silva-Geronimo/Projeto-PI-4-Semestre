import { z } from "zod";

export const productIdParamsSchema = z
  .object({
    productId: z
      .string()
      .uuid("O identificador do produto é inválido."),
  })
  .strict();

export const createProductSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "O nome deve possuir pelo menos 2 caracteres.",
      )
      .max(
        120,
        "O nome deve possuir no máximo 120 caracteres.",
      ),

    description: z
      .string()
      .trim()
      .min(
        5,
        "A descrição deve possuir pelo menos 5 caracteres.",
      )
      .max(
        2000,
        "A descrição deve possuir no máximo 2000 caracteres.",
      ),

    priceInCents: z
      .number()
      .int("O preço deve ser um número inteiro.")
      .positive("O preço deve ser maior que zero."),

    stock: z
      .number()
      .int("O estoque deve ser um número inteiro.")
      .min(0, "O estoque não pode ser negativo."),

    imageUrl: z
      .string()
      .trim()
      .url("Informe uma URL de imagem válida.")
      .max(
        2048,
        "A URL da imagem deve possuir no máximo 2048 caracteres.",
      ),
  })
  .strict();

export const updateProductSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "O nome deve possuir pelo menos 2 caracteres.",
      )
      .max(
        120,
        "O nome deve possuir no máximo 120 caracteres.",
      )
      .optional(),

    description: z
      .string()
      .trim()
      .min(
        5,
        "A descrição deve possuir pelo menos 5 caracteres.",
      )
      .max(
        2000,
        "A descrição deve possuir no máximo 2000 caracteres.",
      )
      .optional(),

    priceInCents: z
      .number()
      .int("O preço deve ser um número inteiro.")
      .positive("O preço deve ser maior que zero.")
      .optional(),

    stock: z
      .number()
      .int("O estoque deve ser um número inteiro.")
      .min(0, "O estoque não pode ser negativo.")
      .optional(),

    imageUrl: z
      .string()
      .trim()
      .url("Informe uma URL de imagem válida.")
      .max(
        2048,
        "A URL da imagem deve possuir no máximo 2048 caracteres.",
      )
      .optional(),

    active: z
      .boolean({
        error: "O status deve ser verdadeiro ou falso.",
      })
      .optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message:
        "Informe pelo menos um campo para atualizar.",
    },
  );

export const updateProductStatusSchema = z
  .object({
    active: z.boolean({
      error: "O status deve ser verdadeiro ou falso.",
    }),
  })
  .strict();

export const productListQuerySchema = z.object({
  page: z.coerce
    .number()
    .int("A página deve ser um número inteiro.")
    .positive("A página deve ser maior que zero.")
    .default(1),

  pageSize: z.coerce
    .number()
    .int("O tamanho da página deve ser um número inteiro.")
    .min(
      1,
      "O tamanho da página deve ser maior que zero.",
    )
    .max(
      100,
      "O tamanho máximo da página é 100.",
    )
    .default(20),

  search: z
    .string()
    .trim()
    .max(
      120,
      "A pesquisa deve possuir no máximo 120 caracteres.",
    )
    .optional(),
});

export type CreateProductInput = z.infer<
  typeof createProductSchema
>;

export type UpdateProductInput = z.infer<
  typeof updateProductSchema
>;

export type UpdateProductStatusInput = z.infer<
  typeof updateProductStatusSchema
>;

export type ProductListQuery = z.infer<
  typeof productListQuerySchema
>;