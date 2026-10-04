import { Request, Response } from "express";

import { petService } from "./pet.service";

export class PetController {
  static #instance: PetController;

  private constructor() {}

  public static get instance(): PetController {
    if (!PetController.#instance) {
      PetController.#instance =
        new PetController();
    }

    return PetController.#instance;
  }

  async list(req: Request, res: Response) {
    const pets = await petService.list(
      req.user!.userId,
    );

    return res.status(200).json(pets);
  }

  async findById(req: Request, res: Response) {
    const pet = await petService.findById(
      req.user!.userId,
      req.params.petId as string,
    );

    return res.status(200).json(pet);
  }

  async create(req: Request, res: Response) {
    const pet = await petService.create(
      req.user!.userId,
      req.body,
    );

    return res.status(201).json(pet);
  }

  async update(req: Request, res: Response) {
    const pet = await petService.update(
      req.user!.userId,
      req.params.petId as string,
      req.body,
    );

    return res.status(200).json(pet);
  }

  async remove(req: Request, res: Response) {
    const result = await petService.remove(
      req.user!.userId,
      req.params.petId as string,
    );

    return res.status(200).json(result);
  }
}

export const petController =
  PetController.instance;
