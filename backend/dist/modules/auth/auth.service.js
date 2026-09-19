"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../../database/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const user_factory_1 = require("./factories/user.factory");
class AuthService {
    static #instance;
    userFactory;
    constructor(userFactory = new user_factory_1.ClientUserFactory()) {
        this.userFactory = userFactory;
    }
    static get instance() {
        if (!AuthService.#instance) {
            AuthService.#instance = new AuthService();
        }
        return AuthService.#instance;
    }
    async register(data) {
        const email = data.email.trim().toLocaleLowerCase();
        const userExists = await prisma_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (userExists) {
            throw new Error("Email já cadastrado.");
        }
        const passwordHash = await bcrypt_1.default.hash(data.password, 10);
        const user = await prisma_1.prisma.user.create({
            data: this.userFactory.create({
                name: data.name,
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
    async login(data) {
        const email = data.email.trim().toLowerCase();
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            throw new Error("E-mail ou senha inválidos.");
        }
        const passwordIsValid = await bcrypt_1.default.compare(data.password, user.passwordHash);
        if (!passwordIsValid) {
            throw new Error("E-mail ou senha inválidos.");
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            role: user.role,
        }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
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
    async forgotPassword(data) {
        const email = data.email.trim().toLowerCase();
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }
        const token = crypto_1.default.randomUUID();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
        await prisma_1.prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt,
            },
        });
        return {
            message: "Token gerado com sucesso.",
            token,
        };
    }
    async resetPassword(data) {
        const resetToken = await prisma_1.prisma.passwordResetToken.findUnique({
            where: {
                token: data.token,
            },
            include: {
                user: true,
            },
        });
        if (!resetToken) {
            throw new Error("Token de recuperação inválido.");
        }
        if (resetToken.expiresAt < new Date()) {
            throw new Error("Token expirado.");
        }
        const passwordHash = await bcrypt_1.default.hash(data.password, 10);
        await prisma_1.prisma.user.update({
            where: {
                id: resetToken.user.id,
            },
            data: {
                passwordHash,
            },
        });
        await prisma_1.prisma.passwordResetToken.delete({
            where: {
                id: resetToken.id,
            },
        });
        return {
            message: "Senha alterada com sucesso.",
        };
    }
    async me(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map