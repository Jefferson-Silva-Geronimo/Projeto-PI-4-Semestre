import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";

import { env } from "../../config/env";
import { prisma } from "../../database/prisma";
import { AppError } from "../../shared/errors/AppError";

import {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "./auth.schemas";

import { ClientUserFactory, UserFactory } from "./factories/user.factory";

export class AuthService {
  static #instance: AuthService;
  private readonly userFactory: UserFactory;

  private constructor(userFactory: UserFactory = new ClientUserFactory()) {
    this.userFactory = userFactory;
  }

  public static get instance(): AuthService {
    if (!AuthService.#instance) {
      AuthService.#instance = new AuthService();
    }

    return AuthService.#instance;
  }

  async register(data: RegisterInput) {
    const email = data.email.trim().toLowerCase();
    const name = data.name.trim();

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      throw new AppError("E-mail já cadastrado.", 409, "EMAIL_IN_USE");
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: this.userFactory.create({
        name,
        email,
        passwordHash,
      }),
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async login(data: LoginInput) {
    const email = data.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppError(
        "E-mail ou senha inválidos.",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    const passwordIsValid = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      throw new AppError(
        "E-mail ou senha inválidos.",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    const tokenOptions: SignOptions = {
      algorithm: "HS256",
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    };

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      env.JWT_SECRET,
      tokenOptions,
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async forgotPassword(data: ForgotPasswordInput) {
    const email = data.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    /*
     * A resposta não revela se o e-mail existe.
     * Isso reduz a possibilidade de enumeração de usuários.
     */
    if (!user) {
      return {
        message:
          "Se o e-mail estiver cadastrado, um token de recuperação será gerado.",
      };
    }

    /*
     * Remove tokens anteriores para manter somente
     * um token ativo por usuário.
     */
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    const token = crypto.randomUUID();

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    /*
     * O token ainda é retornado porque o projeto
     * não possui envio de e-mail nesta etapa.
     */
    return {
      message: "Token gerado com sucesso.",
      token,
      expiresAt,
    };
  }

  async resetPassword(data: ResetPasswordInput) {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        token: data.token,
      },
    });

    if (!resetToken) {
      throw new AppError(
        "Token de recuperação inválido.",
        400,
        "INVALID_RESET_TOKEN",
      );
    }

    if (resetToken.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({
        where: {
          id: resetToken.id,
        },
      });

      throw new AppError(
        "Token de recuperação expirado.",
        400,
        "EXPIRED_RESET_TOKEN",
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    /*
     * A alteração da senha e a remoção dos tokens
     * precisam ocorrer juntas.
     */
    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: resetToken.userId,
        },
        data: {
          passwordHash,
        },
      }),

      prisma.passwordResetToken.deleteMany({
        where: {
          userId: resetToken.userId,
        },
      }),
    ]);

    return {
      message: "Senha alterada com sucesso.",
    };
  }

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404, "USER_NOT_FOUND");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export const authService = AuthService.instance;
