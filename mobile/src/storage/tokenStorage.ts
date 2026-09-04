import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = '@petshop:auth-token';

export const tokenStorage = {
  async saveToken(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
      return;
    }

    await SecureStore.setItemAsync(
      AUTH_TOKEN_KEY,
      token
    );
  },

  async getToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return sessionStorage.getItem(AUTH_TOKEN_KEY);
    }

    return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  },

  async removeToken(): Promise<void> {
    if (Platform.OS === 'web') {
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      return;
    }

    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  },
};