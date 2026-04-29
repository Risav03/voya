import type { ParamListBase, TabNavigationState } from '@react-navigation/native';
import type { IconComponent } from './icon-types';
import { Globe, Home, Pin, Plane, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Colors } from './colors';

const TAB_ITEMS: { Icon: IconComponent; label: string; routeNames: readonly string[]; center?: boolean }[] = [
  { Icon: Home, label: 'Home', routeNames: ['index'] },
  { Icon: Pin, label: 'Saved', routeNames: ['collections'] },
  { Icon: Plus, label: '', routeNames: ['reel'], center: true },
  { Icon: Plane, label: 'Trips', routeNames: ['trips'] },
  { Icon: Globe, label: 'Globe', routeNames: ['globe'] },
];

export type VoyaTabBarProps = {
  state: TabNavigationState<ParamListBase>;
  navigation: { navigate: (name: string) => void };
  onReelPress: () => void;
};

export function CustomTabBar({ state, navigation, onReelPress }: VoyaTabBarProps) {
  const routes = state.routes;
  const indexByRoute = useMemo(() => {
    const m = new Map<string, number>();
    TAB_ITEMS.forEach((t, idx) => t.routeNames.forEach((n) => m.set(n, idx)));
    return m;
  }, []);

  const activeSlug = routes[state.index]?.name;

  function tabIndexFor(routeName: string | undefined): number {
    if (!routeName) return 0;
    return indexByRoute.get(routeName) ?? 0;
  }

  const activeTabIdx = tabIndexFor(activeSlug);

  function navigateTo(routeName: string) {
    navigation.navigate(routeName);
  }

  return (
    <View className="rounded-t-none border-t-2 border-border bg-surface pb-1.5">
      <View className="min-h-[78px] flex-row items-start justify-around overflow-visible rounded-b-[48px] bg-surface pb-3 pt-2">
        {TAB_ITEMS.map((item, idx) => {
          if (item.center) {
            const FabIcon = item.Icon;
            return (
              <Pressable
                key="reel-center"
                accessibilityRole="button"
                accessibilityLabel="Save a reel"
                onPress={onReelPress}
                className="z-10 -mt-[22px] items-center px-1.5"
              >
                <LinearGradient colors={[Colors.coral, Colors.coralDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="h-[50px] w-[50px] items-center justify-center rounded-full shadow-red-400/50 shadow-md">
                  <FabIcon size={22} color={Colors.surface} strokeWidth={2.5} />
                </LinearGradient>
              </Pressable>
            );
          }

          const routeIdx = routes.findIndex((r) => item.routeNames.includes(r.name));
          const route = routeIdx >= 0 ? routes[routeIdx] : null;
          const isActive = route ? activeTabIdx === idx : false;
          const targetName = item.routeNames[0]!;
          const fg = isActive ? Colors.coral : Colors.muted;

          const TabIcon = item.Icon;

          return (
            <Pressable
              key={item.label + targetName}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              onPress={() => navigateTo(targetName)}
              className="min-w-[52px] items-center px-1.5 py-1"
            >
              <View className={`mb-0.5 h-9 w-9 items-center justify-center rounded-xl ${isActive ? 'bg-[#FF6B6B26]' : 'bg-transparent'}`}>
                <TabIcon size={18} color={fg} strokeWidth={2.25} />
              </View>
              {item.label ? (
                <Text className={`text-[10px] ${isActive ? 'font-nunito-extrabold text-coral' : 'font-nunito-semibold text-muted'}`} numberOfLines={1}>
                  {item.label}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
