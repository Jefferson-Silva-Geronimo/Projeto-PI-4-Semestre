import bcrypt from 'bcrypt';
import { RegisterDTO } from './auth.types';
import {prisma} from '../../database/prisma';
import jwt from 'jsonwebtoken';
import { LoginDTO } from './auth.types';
import crypto from 'crypto';
import { ForgotPasswordDTO, ResetPasswordDTO } from './auth.types';

export class AuthService {
    async register(data: RegisterDTO) {
        const email = data.email.trim().toLocaleLowerCase();
        const userExists = await prisma.user.findUnique({
            where: {
                email,
            }
        });
        if (userExists){
            throw new Error('Email já cadastrado.');
        }
        const passwordHash = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email,
                passwordHash,
            },
        });

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };
    }

    async login(data: LoginDTO) {
        const email = data.email.trim().toLowerCase();
        const user = await prisma.user.findUnique({
            where: {
            email,
            },
        });
        if (!user) {
            throw new Error('E-mail ou senha inválidos.');
        }
        const passwordIsValid = await bcrypt.compare(
            data.password,
            user.passwordHash
        );

        if (!passwordIsValid) {
            throw new Error('E-mail ou senha inválidos.');
        }

        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: '7d',
            }
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

    async forgotPassword(data: ForgotPasswordDTO) {
        const email = data.email.trim().toLowerCase();

        const user = await prisma.user.findUnique({
            where: {
            email
            }
        });

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        const token = crypto.randomUUID();

        const expiresAt = new Date(
            Date.now() + 1000 * 60 * 30
        );

        await prisma.passwordResetToken.create({
            data: {
            token,
            userId: user.id,
            expiresAt
            }
        });

        return {
            message: 'Token gerado com sucesso.',
            token
        };
    }
    async resetPassword(data: ResetPasswordDTO) {
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: {
                token: data.token,
            },

            include: {
                user: true,
            },
            });

        if (!resetToken) {
            throw new Error(
            'Token de recuperação inválido.'
            );
        }

        if (resetToken.expiresAt < new Date()) {
            throw new Error('Token expirado.');
        }
        const passwordHash = await bcrypt.hash( data.password, 10);
        await prisma.user.update({
            where: {
                id: resetToken.user.id,
            },
            data: {
                passwordHash,
            },
        });

        await prisma.passwordResetToken.delete({
            where: {
                id: resetToken.id,
            },
        });

        return {
            message: 'Senha alterada com sucesso.',
        };
    }
    async me(userId: string) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new Error('Usuário não encontrado.');
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