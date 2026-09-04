import axios from 'axios';

import type {
  AuthUser,
  ForgotPasswordResponse,
  LoginResponse,
  MessageResponse,
} from '../types/auth';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface ResetPasswordDTO {
  token: string;
  password: string;
}

export const authService = {
  async login(data: LoginDTO): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      '/auth/login',
      data
    );

    return response.data;
  },

  async register(data: RegisterDTO): Promise<AuthUser> {
    const response = await api.post<AuthUser>(
      '/auth/register',
      data
    );

    return response.data;
  },

  async forgotPassword(
    email: string
  ): Promise<ForgotPasswordResponse> {
    const response =
      await api.post<ForgotPasswordResponse>(
        '/auth/forgot-password',
        {
          email,
        }
      );

    return response.data;
  },

  async resetPassword(
    data: ResetPasswordDTO
  ): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>(
      '/auth/reset-password',
      data
    );

    return response.data;
  },

  async me(token: string): Promise<AuthUser> {
    const response = await api.get<AuthUser>(
      '/auth/me',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export { api };