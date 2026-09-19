import { z } from "zod";

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

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<
  typeof forgotPasswordSchema
>;
export type ResetPasswordInput = z.infer<
  typeof resetPasswordSchema
>;