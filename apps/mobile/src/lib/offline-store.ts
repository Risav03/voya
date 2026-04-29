import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OfflineStore<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}

export function createJsonOfflineStore<T>(namespace: string): OfflineStore<T> {
  const keyFor = (key: string) => `${namespace}:${key}`;
  return {
    async get(key) {
      const value = await AsyncStorage.getItem(keyFor(key));
      return value ? (JSON.parse(value) as T) : null;
    },
    async set(key, value) {
      await AsyncStorage.setItem(keyFor(key), JSON.stringify(value));
    },
    async remove(key) {
      await AsyncStorage.removeItem(keyFor(key));
    },
  };
}
