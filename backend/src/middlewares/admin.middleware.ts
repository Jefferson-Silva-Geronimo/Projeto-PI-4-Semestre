import { RequestHandler } from "express";

import { AppError } from "../shared/errors/AppError";

export const adminMiddleware: RequestHandler = (
  req,
  _res,
  next,
) => {
  if (!req.user) {
    return next(
      new AppError(
        "Usuário não autenticado.",
        401,
        "UNAUTHORIZED",
      ),
    );
  }

  if (req.user.role !== "ADMIN") {
    return next(
      new AppError(
        "Acesso permitido somente para administradores.",
        403,
        "FORBIDDEN",
      ),
    );
  }

  return next();
};