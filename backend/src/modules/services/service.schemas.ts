import { z } from "zod";

export const serviceIdParamsSchema = z
  .object({
    serviceId: z
      .string()
      .uuid("O identificador do serviço é inválido."),
  })
  .strict();

const price = (label: string) =>
  z
    .number({
      error: `O preço para porte ${label} é inválido.`,
    })
    .int("O preço deve ser um número inteiro.")
    .positive("O preço deve ser maior que zero.");

const serviceFields = {
  name: z
    .string()
    .trim()
    .min(
      2,
      "O nome deve possuir pelo menos 2 caracteres.",
    )
    .max(
      80,
      "O nome deve possuir no máximo 80 caracteres.",
    ),

  description: z
    .string()
    .trim()
    .min(
      5,
      "A descrição deve possuir pelo menos 5 caracteres.",
    )
    .max(
      500,
      "A descrição deve possuir no máximo 500 caracteres.",
    ),

  durationMinutes: z
    .number({
      error: "A duração é inválida.",
    })
    .int("A duração deve ser um número inteiro.")
    .min(15, "A duração mínima é de 15 minutos.")
    .max(480, "A duração máxima é de 480 minutos.")
    .refine(
      (value) => value % 30 === 0,
      "A duração deve ser múltipla de 30 minutos.",
    ),

  priceSmallInCents: price("P"),
  priceMediumInCents: price("M"),
  priceLargeInCents: price("G"),
};

export const createServiceSchema = z
  .object(serviceFields)
  .strict();

export const updateServiceSchema = z
  .object({
    name: serviceFields.name.optional(),
    description: serviceFields.description.optional(),
    durationMinutes:
      serviceFields.durationMinutes.optional(),
    priceSmallInCents:
      serviceFields.priceSmallInCents.optional(),
    priceMediumInCents:
      serviceFields.priceMediumInCents.optional(),
    priceLargeInCents:
      serviceFields.priceLargeInCents.optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message:
        "Informe pelo menos um campo para atualizar.",
    },
  );

export const updateServiceStatusSchema = z
  .object({
    active: z.boolean({
      error: "O status deve ser verdadeiro ou falso.",
    }),
  })
  .strict();

export type CreateServiceInput = z.infer<
  typeof createServiceSchema
>;

export type UpdateServiceInput = z.infer<
  typeof updateServiceSchema
>;
