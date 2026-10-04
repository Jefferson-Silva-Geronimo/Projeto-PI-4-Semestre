import {
  AppointmentStatus,
  Prisma,
} from "@prisma/client";

import { prisma } from "../../database/prisma";
import { AppError } from "../../shared/errors/AppError";

import {
  AdminAgendaQuery,
  AvailabilityQuery,
  CreateAppointmentInput,
} from "./appointment.schemas";

const OPEN_HOUR = 9;
const CLOSE_HOUR = 18;
const SLOT_MINUTES = 30;
const UTC_OFFSET_HOURS = -3;
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

const appointmentInclude = {
  pet: {
    select: {
      id: true,
      name: true,
      species: true,
      breed: true,
      size: true,
    },
  },

  service: {
    select: {
      id: true,
      name: true,
    },
  },

  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  },
} satisfies Prisma.AppointmentInclude;

const statusTransitions: Record<
  AppointmentStatus,
  AppointmentStatus[]
> = {
  SCHEDULED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

function openingOf(date: string): number {
  const [year, month, day] = date
    .split("-")
    .map(Number);

  return Date.UTC(
    year,
    month - 1,
    day,
    OPEN_HOUR - UTC_OFFSET_HOURS,
  );
}

function localDateOf(instant: Date): string {
  return new Date(
    instant.getTime() + UTC_OFFSET_HOURS * HOUR,
  )
    .toISOString()
    .slice(0, 10);
}

export class AppointmentService {
  static #instance: AppointmentService;

  private constructor() {}

  public static get instance(): AppointmentService {
    if (!AppointmentService.#instance) {
      AppointmentService.#instance =
        new AppointmentService();
    }

    return AppointmentService.#instance;
  }

  private async freeSlots(
    date: string,
    durationMinutes: number,
    db: Prisma.TransactionClient | typeof prisma,
  ): Promise<number[]> {
    const opening = openingOf(date);
    const closing =
      opening + (CLOSE_HOUR - OPEN_HOUR) * HOUR;

    const booked = await db.appointment.findMany({
      where: {
        status: { not: "CANCELLED" },
        scheduledAt: {
          gte: new Date(opening - 8 * HOUR),
          lt: new Date(closing),
        },
      },
      select: {
        scheduledAt: true,
        durationMinutes: true,
      },
    });

    const slots: number[] = [];
    const now = Date.now();

    for (
      let start = opening;
      start + durationMinutes * MINUTE <= closing;
      start += SLOT_MINUTES * MINUTE
    ) {
      const end = start + durationMinutes * MINUTE;

      const taken = booked.some((item) => {
        const itemStart = item.scheduledAt.getTime();
        const itemEnd =
          itemStart +
          item.durationMinutes * MINUTE;

        return itemStart < end && itemEnd > start;
      });

      if (!taken && start > now) {
        slots.push(start);
      }
    }

    return slots;
  }

  async availability(query: AvailabilityQuery) {
    const service =
      await prisma.service.findFirst({
        where: {
          id: query.serviceId,
          active: true,
        },
      });

    if (!service) {
      throw new AppError(
        "Serviço não encontrado.",
        404,
        "SERVICE_NOT_FOUND",
      );
    }

    const slots = await this.freeSlots(
      query.date,
      service.durationMinutes,
      prisma,
    );

    return {
      date: query.date,
      slots: slots.map((slot) =>
        new Date(slot).toISOString(),
      ),
    };
  }

  async create(
    userId: string,
    data: CreateAppointmentInput,
  ) {
    const pet = await prisma.pet.findFirst({
      where: {
        id: data.petId,
        userId,
      },
    });

    if (!pet) {
      throw new AppError(
        "Pet não encontrado.",
        404,
        "PET_NOT_FOUND",
      );
    }

    const service =
      await prisma.service.findFirst({
        where: {
          id: data.serviceId,
          active: true,
        },
      });

    if (!service) {
      throw new AppError(
        "Serviço não encontrado.",
        404,
        "SERVICE_NOT_FOUND",
      );
    }

    const priceInCents =
      pet.size === "P"
        ? service.priceSmallInCents
        : pet.size === "M"
          ? service.priceMediumInCents
          : service.priceLargeInCents;

    return prisma.$transaction(
      async (tx) => {
        const slots = await this.freeSlots(
          localDateOf(data.scheduledAt),
          service.durationMinutes,
          tx,
        );

        if (
          !slots.includes(
            data.scheduledAt.getTime(),
          )
        ) {
          throw new AppError(
            "Horário indisponível. Escolha outro horário.",
            409,
            "SLOT_UNAVAILABLE",
          );
        }

        return tx.appointment.create({
          data: {
            userId,
            petId: pet.id,
            serviceId: service.id,
            scheduledAt: data.scheduledAt,
            durationMinutes:
              service.durationMinutes,
            priceInCents,
          },
          include: appointmentInclude,
        });
      },
      {
        isolationLevel:
          Prisma.TransactionIsolationLevel
            .Serializable,
      },
    );
  }

  async listByUser(userId: string) {
    return prisma.appointment.findMany({
      where: { userId },
      orderBy: { scheduledAt: "desc" },
      include: appointmentInclude,
    });
  }

  async cancel(
    userId: string,
    appointmentId: string,
  ) {
    const appointment =
      await prisma.appointment.findFirst({
        where: {
          id: appointmentId,
          userId,
        },
      });

    if (!appointment) {
      throw new AppError(
        "Agendamento não encontrado.",
        404,
        "APPOINTMENT_NOT_FOUND",
      );
    }

    if (
      !statusTransitions[
        appointment.status
      ].includes("CANCELLED")
    ) {
      throw new AppError(
        "Este agendamento não pode mais ser cancelado.",
        409,
        "INVALID_STATUS_TRANSITION",
      );
    }

    return prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "CANCELLED" },
      include: appointmentInclude,
    });
  }

  async listAgenda(query: AdminAgendaQuery) {
    const date =
      query.date ?? localDateOf(new Date());

    const opening = openingOf(date);

    return prisma.appointment.findMany({
      where: {
        scheduledAt: {
          gte: new Date(opening),
          lt: new Date(
            opening +
              (CLOSE_HOUR - OPEN_HOUR) * HOUR,
          ),
        },
      },
      orderBy: { scheduledAt: "asc" },
      include: appointmentInclude,
    });
  }

  async updateStatus(
    appointmentId: string,
    status: AppointmentStatus,
  ) {
    const appointment =
      await prisma.appointment.findUnique({
        where: { id: appointmentId },
      });

    if (!appointment) {
      throw new AppError(
        "Agendamento não encontrado.",
        404,
        "APPOINTMENT_NOT_FOUND",
      );
    }

    if (
      !statusTransitions[
        appointment.status
      ].includes(status)
    ) {
      throw new AppError(
        "Mudança de status não permitida.",
        409,
        "INVALID_STATUS_TRANSITION",
      );
    }

    return prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
      include: appointmentInclude,
    });
  }
}

export const appointmentService =
  AppointmentService.instance;
