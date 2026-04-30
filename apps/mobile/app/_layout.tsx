import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryProvider } from '../src/lib/query-client';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <QueryProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="trip" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="modal/reel-save" options={{ presentation: 'modal' }} />
      </Stack>
    </QueryProvider>
  );
}
