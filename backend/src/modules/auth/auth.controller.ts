import { Request, Response } from "express";

import { authService } from "./auth.service";

export class AuthController {
  static #instance: AuthController;

  private constructor() {}

  public static get instance(): AuthController {
    if (!AuthController.#instance) {
      AuthController.#instance = new AuthController();
    }

    return AuthController.#instance;
  }

  async register(
    req: Request,
    res: Response,
  ) {
    const user = await authService.register(
      req.body,
    );

    return res.status(201).json(user);
  }

  async login(
    req: Request,
    res: Response,
  ) {
    const result = await authService.login(
      req.body,
    );

    return res.status(200).json(result);
  }

  async forgotPassword(
    req: Request,
    res: Response,
  ) {
    const result =
      await authService.forgotPassword(
        req.body,
      );

    return res.status(200).json(result);
  }

  async resetPassword(
    req: Request,
    res: Response,
  ) {
    const result =
      await authService.resetPassword(
        req.body,
      );

    return res.status(200).json(result);
  }

  async me(
    req: Request,
    res: Response,
  ) {
    const user = await authService.me(
      req.user!.userId,
    );

    return res.status(200).json(user);
  }
}

export const authController =
  AuthController.instance;