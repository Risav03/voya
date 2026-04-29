import { CustomTabBar } from '@voya/ui';
import { Tabs, useRouter } from 'expo-router';

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => (
        <CustomTabBar state={state} navigation={navigation} onReelPress={() => router.push('/modal/reel-save')} />
      )}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="collections" options={{ title: 'Saved' }} />
      <Tabs.Screen name="reel" options={{ title: '' }} />
      <Tabs.Screen name="trips" options={{ title: 'Trips' }} />
      <Tabs.Screen name="globe" options={{ title: 'Globe' }} />
    </Tabs>
  );
}
