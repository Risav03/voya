import type { IconComponent } from './icon-types';
import { ArrowRight, Calendar, Map as MapIcon, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Colors } from './colors';
import { PaperPlane } from './illustrations/PaperPlane';

export type ActiveTripCardProps = {
  title: string;
  HeroIcon: IconComponent;
  dates: string;
  stops: number;
  progressPercent: number;
  gradient?: readonly [string, string];
  onContinue?: () => void;
  onMapPress?: () => void;
};

export function ActiveTripCard({
  title,
  HeroIcon,
  dates,
  stops,
  progressPercent,
  gradient = [Colors.coral, Colors.coralDark],
  onContinue,
  onMapPress,
}: ActiveTripCardProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(1)).current;
  const ringOp = useRef(new Animated.Value(0.6)).current;

  const pct = Math.min(100, Math.max(0, progressPercent));
  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 1000,
      delay: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [anim, progressPercent, pct]);

  const barWidth = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${pct}%`],
  });

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.parallel([
            Animated.timing(ringScale, { toValue: 2.2, duration: 1500, useNativeDriver: true }),
            Animated.timing(ringOp, { toValue: 0, duration: 1500, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(ringScale, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(ringOp, { toValue: 0.6, duration: 0, useNativeDriver: true }),
          ]),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [ringOp, ringScale]);

  return (
    <View className="mb-1 overflow-hidden rounded-[26px] border-2 shadow-red-400/25 shadow-md" style={{ borderColor: `${gradient[0]}33` }}>
      <LinearGradient colors={[gradient[0], gradient[1]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="relative h-[150px] items-center justify-center">
        <View className="absolute left-4 top-4 z-[2] flex-row items-center gap-1.5">
          <View className="h-[14px] w-[14px] items-center justify-center">
            <Animated.View
              className="absolute h-[10px] w-[10px] rounded-full bg-mint"
              style={{ opacity: ringOp, transform: [{ scale: ringScale }] }}
            />
            <View className="h-2 w-2 rounded-full bg-mint" />
          </View>
          <View className="rounded-full bg-[rgba(0,0,0,0.35)] px-2.5 py-1">
            <Text className="font-nunito-extrabold text-[11px] text-surface">LIVE</Text>
          </View>
        </View>
        <View className="absolute right-[14px] top-[14px] opacity-55">
          <PaperPlane size={38} color="rgba(255,255,255,0.75)" />
        </View>
        <View className="mt-2">
          <HeroIcon size={64} color={Colors.surface} strokeWidth={1.75} />
        </View>
        <Svg width="100%" height={55} className="absolute bottom-0 left-0 right-0" viewBox="0 0 360 55" preserveAspectRatio="none">
          <Path d="M0 55 Q90 28 180 42 Q270 55 360 22 L360 55Z" fill={Colors.surface} />
        </Svg>
      </LinearGradient>
      <View className="bg-surface px-[18px] py-4">
        <Text className="mb-2 font-fredoka text-[22px] text-text">{title}</Text>
        <View className="mb-3 flex-row flex-wrap items-center gap-1">
          <Calendar size={14} color={Colors.muted} strokeWidth={2.25} />
          <Text className="font-nunito-semibold text-xs text-muted">{dates}</Text>
          <Text className="font-nunito-semibold text-xs text-muted"> · </Text>
          <MapPin size={14} color={Colors.muted} strokeWidth={2.25} />
          <Text className="font-nunito-semibold text-xs text-muted">
            {stops} stops
          </Text>
        </View>
        <View className="mb-1.5 flex-row justify-between">
          <Text className="font-nunito-bold text-[11px] text-muted">Trip progress</Text>
          <Text className="font-nunito-extrabold text-[11px]" style={{ color: gradient[0] }}>{progressPercent}%</Text>
        </View>
        <View className="mb-3 h-2 overflow-hidden rounded-full bg-border">
          <Animated.View className="h-full rounded-full" style={{ width: barWidth, backgroundColor: gradient[0] }} />
        </View>
        <View className="flex-row gap-2.5">
          <Pressable className="flex-1" onPress={onContinue} disabled={!onContinue}>
            <LinearGradient colors={[gradient[0], gradient[1]]} className="flex-row items-center justify-center gap-1.5 rounded-[10px] py-[11px]" start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text className="font-nunito-extrabold text-[13px] text-surface">Continue trip</Text>
              <ArrowRight size={18} color={Colors.surface} strokeWidth={2.25} />
            </LinearGradient>
          </Pressable>
          <Pressable className="items-center justify-center rounded-[10px] border-2 border-border bg-[#F7F7F7] px-[14px]" onPress={onMapPress} disabled={!onMapPress}>
            <MapIcon size={18} color={Colors.text} strokeWidth={2.25} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
