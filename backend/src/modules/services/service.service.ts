import { Service } from "@prisma/client";

import { prisma } from "../../database/prisma";
import { AppError } from "../../shared/errors/AppError";

import {
  CreateServiceInput,
  UpdateServiceInput,
} from "./service.schemas";

export class ServiceService {
  static #instance: ServiceService;

  private constructor() {}

  public static get instance(): ServiceService {
    if (!ServiceService.#instance) {
      ServiceService.#instance =
        new ServiceService();
    }

    return ServiceService.#instance;
  }

  async listActive(): Promise<Service[]> {
    return prisma.service.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
  }

  async listAll(): Promise<Service[]> {
    return prisma.service.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findById(
    serviceId: string,
  ): Promise<Service> {
    const service =
      await prisma.service.findUnique({
        where: { id: serviceId },
      });

    if (!service) {
      throw new AppError(
        "Serviço não encontrado.",
        404,
        "SERVICE_NOT_FOUND",
      );
    }

    return service;
  }

  async create(
    data: CreateServiceInput,
  ): Promise<Service> {
    return prisma.service.create({ data });
  }

  async update(
    serviceId: string,
    data: UpdateServiceInput,
  ): Promise<Service> {
    await this.findById(serviceId);

    return prisma.service.update({
      where: { id: serviceId },
      data,
    });
  }

  async updateStatus(
    serviceId: string,
    active: boolean,
  ): Promise<Service> {
    await this.findById(serviceId);

    return prisma.service.update({
      where: { id: serviceId },
      data: { active },
    });
  }

  async remove(serviceId: string) {
    await this.findById(serviceId);

    const appointments =
      await prisma.appointment.count({
        where: { serviceId },
      });

    if (appointments > 0) {
      throw new AppError(
        "Este serviço possui agendamentos. Inative-o em vez de excluir.",
        409,
        "SERVICE_HAS_APPOINTMENTS",
      );
    }

    await prisma.service.delete({
      where: { id: serviceId },
    });

    return {
      message: "Serviço excluído com sucesso.",
    };
  }
}

export const serviceService =
  ServiceService.instance;
