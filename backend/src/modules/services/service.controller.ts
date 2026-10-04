import { Request, Response } from "express";

import { serviceService } from "./service.service";

export class ServiceController {
  static #instance: ServiceController;

  private constructor() {}

  public static get instance(): ServiceController {
    if (!ServiceController.#instance) {
      ServiceController.#instance =
        new ServiceController();
    }

    return ServiceController.#instance;
  }

  async listActive(_req: Request, res: Response) {
    const services =
      await serviceService.listActive();

    return res.status(200).json(services);
  }

  async listAll(_req: Request, res: Response) {
    const services =
      await serviceService.listAll();

    return res.status(200).json(services);
  }

  async findById(req: Request, res: Response) {
    const service = await serviceService.findById(
      req.params.serviceId as string,
    );

    return res.status(200).json(service);
  }

  async create(req: Request, res: Response) {
    const service = await serviceService.create(
      req.body,
    );

    return res.status(201).json(service);
  }

  async update(req: Request, res: Response) {
    const service = await serviceService.update(
      req.params.serviceId as string,
      req.body,
    );

    return res.status(200).json(service);
  }

  async updateStatus(req: Request, res: Response) {
    const service =
      await serviceService.updateStatus(
        req.params.serviceId as string,
        req.body.active,
      );

    return res.status(200).json(service);
  }

  async remove(req: Request, res: Response) {
    const result = await serviceService.remove(
      req.params.serviceId as string,
    );

    return res.status(200).json(result);
  }
}

export const serviceController =
  ServiceController.instance;
