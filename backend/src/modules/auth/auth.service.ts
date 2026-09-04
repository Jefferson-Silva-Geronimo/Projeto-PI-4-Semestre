import bcrypt from 'bcrypt';
import { RegisterDTO } from './auth.types';
import {prisma} from '../../database/prisma';

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
}