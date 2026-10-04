import { z } from "zod";

const phoneSchema = z
  .string()
  .transform((value) => value.replace(/\D/g, ""))
  .refine(
    (value) => value.length === 10 || value.length === 11,
    "Informe um telefone com DDD (10 ou 11 dígitos).",
  );

const newPasswordSchema = z
  .string()
  .min(8, "A nova senha deve possuir pelo menos 8 caracteres.")
  .max(72, "A nova senha deve possuir no máximo 72 caracteres.");

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "O nome deve possuir pelo menos 2 caracteres.")
      .max(100, "O nome deve possuir no máximo 100 caracteres."),

    email: z
      .string()
      .trim()
      .email("Informe um endereço de e-mail válido.")
      .max(180, "O e-mail deve possuir no máximo 180 caracteres."),

    phone: phoneSchema,

    password: z
      .string()
      .min(8, "A senha deve possuir pelo menos 8 caracteres.")
      .max(72, "A senha deve possuir no máximo 72 caracteres."),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Informe um endereço de e-mail válido."),

    password: z
      .string()
      .min(1, "A senha é obrigatória."),
  })
  .strict();

export const forgotPasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Informe um endereço de e-mail válido."),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .uuid("O token de recuperação é inválido."),

    password: z
      .string()
      .min(8, "A nova senha deve possuir pelo menos 8 caracteres.")
      .max(72, "A nova senha deve possuir no máximo 72 caracteres."),
  })
  .strict();

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "O nome deve possuir pelo menos 2 caracteres.")
      .max(100, "O nome deve possuir no máximo 100 caracteres.")
      .optional(),

    phone: phoneSchema.optional(),

    currentPassword: z.string().min(1).optional(),

    newPassword: newPasswordSchema.optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "Informe pelo menos um campo para atualizar.",
    },
  )
  .refine(
    (data) =>
      data.newPassword === undefined ||
      data.currentPassword !== undefined,
    {
      message: "Informe a senha atual para definir uma nova senha.",
      path: ["currentPassword"],
    },
  );

export type UpdateProfileInput = z.infer<
  typeof updateProfileSchema
>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<
  typeof forgotPasswordSchema
>;
export type ResetPasswordInput = z.infer<
  typeof resetPasswordSchema
>;