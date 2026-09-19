import { Platform } from 'react-native';

const configuredApiUrl =
  process.env.EXPO_PUBLIC_API_URL?.trim();

function getDevelopmentApiUrl(): string {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  return 'http://localhost:3000';
}

function normalizeApiUrl(
  url: string,
): string {
  return url.replace(/\/+$/, '');
}

export const API_URL = normalizeApiUrl(
  configuredApiUrl ||
    getDevelopmentApiUrl(),
);

export const API_TIMEOUT_IN_MILLISECONDS =
  15000;