import { UserRole } from '@prisma/client';

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

export interface UserPersistenceData extends CreateUserData {
  role: UserRole;
}

export abstract class UserFactory {
  abstract create(data: CreateUserData): UserPersistenceData;
}

export class ClientUserFactory extends UserFactory {
  create(data: CreateUserData): UserPersistenceData {
    return {
      ...data,
      role: UserRole.CLIENTE,
    };
  }
}
