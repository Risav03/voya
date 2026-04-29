import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Reels To Real Travel',
  slug: 'reels-to-real-travel',
  scheme: 'reelstravel',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  ios: { supportsTablet: true, bundleIdentifier: 'app.reelstravel.mobile' },
  android: { package: 'app.reelstravel.mobile' },
  plugins: ['expo-router', 'expo-secure-store', 'expo-location', 'expo-font'],
  experiments: { typedRoutes: true },
  extra: {
    apiUrl: process.env.MOBILE_PUBLIC_API_URL ?? 'http://localhost:4000',
  },
});
