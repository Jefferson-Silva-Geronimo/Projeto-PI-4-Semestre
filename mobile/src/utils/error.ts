import axios from 'axios';

import type {
  ApiErrorBody,
  LegacyApiErrorBody,
} from '../types/api';

function isApiErrorBody(
  value: unknown,
): value is ApiErrorBody {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('error' in value)
  ) {
    return false;
  }

  const errorValue = (
    value as {
      error?: unknown;
    }
  ).error;

  return (
    typeof errorValue === 'object' &&
    errorValue !== null &&
    'message' in errorValue &&
    typeof (
      errorValue as {
        message?: unknown;
      }
    ).message === 'string'
  );
}

function isLegacyApiErrorBody(
  value: unknown,
): value is LegacyApiErrorBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (
      value as {
        message?: unknown;
      }
    ).message === 'string'
  );
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage:
    string = 'Ocorreu um erro inesperado.',
): string {
  if (!axios.isAxiosError(error)) {
    if (error instanceof Error) {
      return error.message;
    }

    return fallbackMessage;
  }

  if (!error.response) {
    if (
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT'
    ) {
      return (
        'A solicitação demorou mais que o esperado. ' +
        'Verifique sua conexão e tente novamente.'
      );
    }

    return (
      'Não foi possível conectar ao servidor. ' +
      'Verifique sua internet e o endereço da API.'
    );
  }

  const responseData: unknown =
    error.response.data;

  if (isApiErrorBody(responseData)) {
    return responseData.error.message;
  }

  if (
    isLegacyApiErrorBody(responseData) &&
    responseData.message
  ) {
    return responseData.message;
  }

  if (error.response.status === 401) {
    return (
      'Sua sessão expirou ou não é mais válida. ' +
      'Entre novamente.'
    );
  }

  if (error.response.status === 403) {
    return (
      'Você não possui permissão para realizar esta ação.'
    );
  }

  if (error.response.status === 404) {
    return 'O recurso solicitado não foi encontrado.';
  }

  if (error.response.status === 409) {
    return (
      'A operação não pôde ser concluída devido a um conflito.'
    );
  }

  if (error.response.status === 422) {
    return 'Verifique os dados informados.';
  }

  if (error.response.status === 429) {
    return (
      'Muitas solicitações foram realizadas. ' +
      'Aguarde alguns minutos e tente novamente.'
    );
  }

  if (error.response.status >= 500) {
    return (
      'O servidor encontrou um problema. ' +
      'Tente novamente em alguns instantes.'
    );
  }

  return fallbackMessage;
}

export function getApiErrorCode(
  error: unknown,
): string | null {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const responseData: unknown =
    error.response?.data;

  if (!isApiErrorBody(responseData)) {
    return null;
  }

  return responseData.error.code;
}

export function isUnauthorizedError(
  error: unknown,
): boolean {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === 401
  );
}

export function isNetworkError(
  error: unknown,
): boolean {
  return (
    axios.isAxiosError(error) &&
    !error.response
  );
}