import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'petshop-cache:';

export const localDb = {
  async set(key: string, value: unknown): Promise<void> {
    try {
      await AsyncStorage.setItem(
        PREFIX + key,
        JSON.stringify(value),
      );
    } catch {
      return;
    }
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(PREFIX + key);

      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(PREFIX + key);
    } catch {
      return;
    }
  },
};
