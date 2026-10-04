import { Request, Response } from "express";

import { appointmentService } from "./appointment.service";

import type {
  AdminAgendaQuery,
  AvailabilityQuery,
} from "./appointment.schemas";

export class AppointmentController {
  static #instance: AppointmentController;

  private constructor() {}

  public static get instance(): AppointmentController {
    if (!AppointmentController.#instance) {
      AppointmentController.#instance =
        new AppointmentController();
    }

    return AppointmentController.#instance;
  }

  async availability(_req: Request, res: Response) {
    const result =
      await appointmentService.availability(
        res.locals
          .validatedQuery as AvailabilityQuery,
      );

    return res.status(200).json(result);
  }

  async create(req: Request, res: Response) {
    const appointment =
      await appointmentService.create(
        req.user!.userId,
        req.body,
      );

    return res.status(201).json(appointment);
  }

  async listByUser(req: Request, res: Response) {
    const appointments =
      await appointmentService.listByUser(
        req.user!.userId,
      );

    return res.status(200).json(appointments);
  }

  async cancel(req: Request, res: Response) {
    const appointment =
      await appointmentService.cancel(
        req.user!.userId,
        req.params.appointmentId as string,
      );

    return res.status(200).json(appointment);
  }

  async listAgenda(_req: Request, res: Response) {
    const appointments =
      await appointmentService.listAgenda(
        res.locals
          .validatedQuery as AdminAgendaQuery,
      );

    return res.status(200).json(appointments);
  }

  async updateStatus(req: Request, res: Response) {
    const appointment =
      await appointmentService.updateStatus(
        req.params.appointmentId as string,
        req.body.status,
      );

    return res.status(200).json(appointment);
  }
}

export const appointmentController =
  AppointmentController.instance;
