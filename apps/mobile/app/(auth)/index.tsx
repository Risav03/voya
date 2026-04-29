import {
  Balloon,
  Cloud,
  Colors,
  FontFamilies,
  Globe3D,
  Palm,
} from '@voya/ui';
import { ArrowRight, Leaf, Plane, Rocket } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const cloud1 = useRef(new Animated.Value(0)).current;
  const cloud2 = useRef(new Animated.Value(0)).current;
  const sun = useRef(new Animated.Value(0)).current;
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cloud1, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(cloud1, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(cloud2, { toValue: 1, duration: 5200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(cloud2, { toValue: 0, duration: 5200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    ).start();
    Animated.loop(
      Animated.timing(sun, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
    Animated.timing(enter, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [cloud1, cloud2, enter, sun]);

  const c1x = cloud1.interpolate({ inputRange: [0, 1], outputRange: [0, 12] });
  const c2x = cloud2.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });
  const sunSpin = sun.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const fade = enter;
  const slide = enter.interpolate({ inputRange: [0, 1], outputRange: [22, 0] });

  function goTabs() {
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
    <LinearGradient colors={['#E8F8FF', '#FFF8F0', '#F0FFF4']} className="flex-1 items-center justify-center overflow-hidden px-7" start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}>
      <Animated.View className="absolute -right-[60px] -top-[60px] h-[220px] w-[220px] rounded-full bg-[#FFD93D55] opacity-90" style={{ transform: [{ rotate: sunSpin }] }} />
      <Animated.View className="absolute left-[-12px] top-20" style={{ transform: [{ translateX: c1x }] }}>
        <Cloud width={100} opacity={0.72} />
      </Animated.View>
      <Animated.View className="absolute right-[-16px] top-[120px]" style={{ transform: [{ translateX: c2x }] }}>
        <Cloud width={82} opacity={0.52} />
      </Animated.View>
      <View className="absolute right-6 top-[90px] opacity-90">
        <Animated.View style={{ transform: [{ translateY: slide }] }}>
          <Balloon size={52} />
        </Animated.View>
      </View>
      <View className="absolute bottom-[-4px] left-0 opacity-70">
        <Palm size={50} flip={false} />
      </View>
      <View className="absolute bottom-[-4px] right-0 opacity-70">
        <Palm size={44} flip />
      </View>

      <Animated.View className="z-[2] items-center" style={{ opacity: fade, transform: [{ translateY: slide }], maxWidth: Math.min(320, width - 40) }}>
        <View className="mb-4">
          <Globe3D size={200} />
        </View>
        <View className="mb-1.5 flex-row items-center justify-center gap-2.5">
          <Text className="shrink text-center font-fredoka tracking-[1px] text-coral" style={{ fontSize: Math.min(52, width * 0.12) }}>voya</Text>
          <Plane size={Math.min(40, width * 0.095)} color={Colors.coral} strokeWidth={2} />
        </View>
        <View className="mb-5 flex-row flex-wrap items-center justify-center gap-2">
          <Text className="font-nunito-bold text-[13px] uppercase tracking-[2px] text-teal">Reels</Text>
          <ArrowRight size={14} color={Colors.teal} strokeWidth={2.5} />
          <Text className="font-nunito-bold text-[13px] uppercase tracking-[2px] text-teal">Real Adventures</Text>
        </View>
        <View className="mb-7 max-w-[260px] flex-row items-start gap-2">
          <Leaf size={18} color={Colors.muted} strokeWidth={2} />
          <Text className="flex-1 text-left font-nunito-medium text-[15px] leading-6 text-[#555]">
            Save travel reels. Discover real places. Plan your dream trips with AI.
          </Text>
        </View>
        <Pressable accessibilityRole="button" onPress={goTabs} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]} className="w-full max-w-[320px] overflow-hidden rounded-full">
          <LinearGradient colors={[Colors.coral, Colors.coralDark]} className="flex-row items-center justify-center gap-2.5 px-12 py-4" start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Rocket size={22} color={Colors.surface} strokeWidth={2} />
            <Text className="font-nunito-extrabold text-[17px] tracking-[0.3px] text-surface">{"Let's go!"}</Text>
          </LinearGradient>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.push('/(auth)/login')}>
          <Text className="mt-4 font-nunito-semibold text-[13px] text-muted">Already have an account? Sign in</Text>
        </Pressable>
      </Animated.View>
    </LinearGradient>
    </SafeAreaView>
  );
}
