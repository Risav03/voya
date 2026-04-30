import { Tabs } from 'expo-router';
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="collections" options={{ title: 'Collections' }} />
      <Tabs.Screen name="map" options={{ title: 'Map' }} />
      <Tabs.Screen name="trips" options={{ title: 'Trips' }} />
      <Tabs.Screen name="globe" options={{ title: 'Globe' }} />
      <Tabs.Screen name="achievements" options={{ title: 'Rewards' }} />
    </Tabs>
  );
}
