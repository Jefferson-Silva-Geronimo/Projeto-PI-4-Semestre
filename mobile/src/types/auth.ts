export type UserRole = 'CLIENTE' | 'ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface LoginResponse extends AuthSession {}

export interface MessageResponse {
  message: string;
}

export interface ForgotPasswordResponse {
  message: string;
  token?: string;
}