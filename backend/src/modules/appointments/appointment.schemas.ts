import { z } from "zod";

const dateString = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "A data deve estar no formato AAAA-MM-DD.",
  );

export const appointmentIdParamsSchema = z
  .object({
    appointmentId: z
      .string()
      .uuid(
        "O identificador do agendamento é inválido.",
      ),
  })
  .strict();

export const createAppointmentSchema = z
  .object({
    petId: z
      .string()
      .uuid("O identificador do pet é inválido."),

    serviceId: z
      .string()
      .uuid("O identificador do serviço é inválido."),

    scheduledAt: z.coerce.date({
      error: "Data e horário inválidos.",
    }),
  })
  .strict();

export const availabilityQuerySchema = z.object({
  serviceId: z
    .string()
    .uuid("O identificador do serviço é inválido."),

  date: dateString,
});

export const adminAgendaQuerySchema = z.object({
  date: dateString.optional(),
});

export const updateAppointmentStatusSchema = z
  .object({
    status: z.enum(
      ["CONFIRMED", "COMPLETED", "CANCELLED"],
      {
        error: "O status informado é inválido.",
      },
    ),
  })
  .strict();

export type CreateAppointmentInput = z.infer<
  typeof createAppointmentSchema
>;

export type AvailabilityQuery = z.infer<
  typeof availabilityQuerySchema
>;

export type AdminAgendaQuery = z.infer<
  typeof adminAgendaQuerySchema
>;
