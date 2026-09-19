import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { AppError } from "../shared/errors/AppError";

interface JwtPayload {
  userId: string;
  role: "CLIENTE" | "ADMIN";
}

export const authMiddleware: RequestHandler = (
  req,
  _res,
  next,
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return next(
      new AppError(
        "Token não informado.",
        401,
        "UNAUTHORIZED",
      ),
    );
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(
      new AppError(
        "Formato do token inválido.",
        401,
        "INVALID_TOKEN_FORMAT",
      ),
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      env.JWT_SECRET,
      {
        algorithms: ["HS256"],
      },
    ) as JwtPayload;

    if (!decoded.userId || !decoded.role) {
      return next(
        new AppError(
          "Token inválido.",
          401,
          "INVALID_TOKEN",
        ),
      );
    }

    if (
      decoded.role !== "CLIENTE" &&
      decoded.role !== "ADMIN"
    ) {
      return next(
        new AppError(
          "Perfil de acesso inválido.",
          401,
          "INVALID_TOKEN_ROLE",
        ),
      );
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    return next();
  } catch {
    return next(
      new AppError(
        "Token inválido ou expirado.",
        401,
        "INVALID_TOKEN",
      ),
    );
  }
};