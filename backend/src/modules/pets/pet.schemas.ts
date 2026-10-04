import { z } from "zod";

export const petIdParamsSchema = z
  .object({
    petId: z
      .string()
      .uuid("O identificador do pet é inválido."),
  })
  .strict();

const petFields = {
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

  species: z.enum(["CAO", "GATO", "OUTRO"], {
    error: "Espécie inválida.",
  }),

  breed: z
    .string()
    .trim()
    .max(
      80,
      "A raça deve possuir no máximo 80 caracteres.",
    )
    .nullable()
    .optional(),

  size: z.enum(["P", "M", "G"], {
    error: "Porte inválido.",
  }),

  birthDate: z.coerce
    .date({
      error: "Data de nascimento inválida.",
    })
    .refine(
      (date) => date <= new Date(),
      "A data de nascimento não pode ser futura.",
    )
    .nullable()
    .optional(),

  weightKg: z
    .number({
      error: "Peso inválido.",
    })
    .positive("O peso deve ser maior que zero.")
    .max(200, "O peso informado é inválido.")
    .nullable()
    .optional(),

  notes: z
    .string()
    .trim()
    .max(
      500,
      "As observações devem possuir no máximo 500 caracteres.",
    )
    .nullable()
    .optional(),
};

export const createPetSchema = z
  .object(petFields)
  .strict();

export const updatePetSchema = z
  .object({
    name: petFields.name.optional(),
    species: petFields.species.optional(),
    breed: petFields.breed,
    size: petFields.size.optional(),
    birthDate: petFields.birthDate,
    weightKg: petFields.weightKg,
    notes: petFields.notes,
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message:
        "Informe pelo menos um campo para atualizar.",
    },
  );

export type CreatePetInput = z.infer<
  typeof createPetSchema
>;

export type UpdatePetInput = z.infer<
  typeof updatePetSchema
>;
