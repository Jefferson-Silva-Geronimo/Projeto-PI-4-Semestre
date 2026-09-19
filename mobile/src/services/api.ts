import axios, {
  AxiosHeaders,
} from 'axios';

import {
  API_TIMEOUT_IN_MILLISECONDS,
  API_URL,
} from '../config/api';

import {
  authStorage,
} from '../storage/authStorage';

import {
  sessionService,
} from './session.service';

export const api = axios.create({
  baseURL: API_URL,

  timeout:
    API_TIMEOUT_IN_MILLISECONDS,

  headers: {
    Accept: 'application/json',

    'Content-Type':
      'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token =
      await authStorage.getToken();

    const headers =
      AxiosHeaders.from(
        config.headers,
      );

    if (token) {
      headers.set(
        'Authorization',
        `Bearer ${token}`,
      );
    } else {
      headers.delete(
        'Authorization',
      );
    }

    config.headers = headers;

    return config;
  },

  async (error: unknown) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,

  async (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      await authStorage.removeToken();

      await sessionService
        .notifyUnauthorized();
    }

    return Promise.reject(error);
  },
);