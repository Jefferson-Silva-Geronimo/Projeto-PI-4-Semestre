import { Pet } from "@prisma/client";

import { prisma } from "../../database/prisma";
import { AppError } from "../../shared/errors/AppError";

import {
  CreatePetInput,
  UpdatePetInput,
} from "./pet.schemas";

export class PetService {
  static #instance: PetService;

  private constructor() {}

  public static get instance(): PetService {
    if (!PetService.#instance) {
      PetService.#instance = new PetService();
    }

    return PetService.#instance;
  }

  async list(userId: string): Promise<Pet[]> {
    return prisma.pet.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(
    userId: string,
    petId: string,
  ): Promise<Pet> {
    const pet = await prisma.pet.findFirst({
      where: {
        id: petId,
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

    return pet;
  }

  async create(
    userId: string,
    data: CreatePetInput,
  ): Promise<Pet> {
    return prisma.pet.create({
      data: {
        userId,
        name: data.name,
        species: data.species,
        breed: data.breed || null,
        size: data.size,
        birthDate: data.birthDate ?? null,
        weightKg: data.weightKg ?? null,
        notes: data.notes || null,
      },
    });
  }

  async update(
    userId: string,
    petId: string,
    data: UpdatePetInput,
  ): Promise<Pet> {
    await this.findById(userId, petId);

    return prisma.pet.update({
      where: { id: petId },
      data: {
        ...data,
        breed:
          data.breed === undefined
            ? undefined
            : data.breed || null,
        notes:
          data.notes === undefined
            ? undefined
            : data.notes || null,
      },
    });
  }

  async remove(userId: string, petId: string) {
    await this.findById(userId, petId);

    const openAppointments =
      await prisma.appointment.count({
        where: {
          petId,
          status: {
            in: ["SCHEDULED", "CONFIRMED"],
          },
        },
      });

    if (openAppointments > 0) {
      throw new AppError(
        "Cancele os agendamentos em aberto deste pet antes de excluí-lo.",
        409,
        "PET_HAS_OPEN_APPOINTMENTS",
      );
    }

    await prisma.pet.delete({
      where: { id: petId },
    });

    return {
      message: "Pet excluído com sucesso.",
    };
  }
}

export const petService = PetService.instance;
