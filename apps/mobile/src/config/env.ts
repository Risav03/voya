import Constants from 'expo-constants';

export const env = {
  apiUrl: (Constants.expoConfig?.extra?.apiUrl as string | undefined) ?? 'http://localhost:4000',
};
