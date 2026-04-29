import { MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Colors } from './colors';

export type PlaceCardProps = {
  name: string;
  country: string;
  gradient: readonly [string, string];
};

export function PlaceCard({ name, country, gradient }: PlaceCardProps) {
  const w = 130;

  return (
    <LinearGradient colors={[gradient[0], gradient[1]]} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} className="relative h-[165px] w-[130px] overflow-hidden rounded-[20px] p-3 shadow-black/10 shadow-sm">
      <View className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-[rgba(255,255,255,0.15)]" />
      <Svg width={w} height={40} className="absolute bottom-0 left-0 right-0" viewBox="0 0 130 50" preserveAspectRatio="none">
        <Path d="M0 50 Q30 32 65 40 Q100 48 130 30 L130 50Z" fill="rgba(255,255,255,0.25)" />
      </Svg>
      <View className="absolute left-[10px] top-[10px]">
        <MapPin size={18} color={Colors.surface} strokeWidth={2.5} fill="rgba(255,255,255,0.2)" />
      </View>
      <View className="absolute bottom-3 left-3 right-3">
        <Text className="font-nunito-extrabold text-[13px] text-surface">{name}</Text>
        <Text className="mt-0.5 font-nunito-semibold text-[10px] text-[rgba(255,255,255,0.88)]">{country}</Text>
      </View>
    </LinearGradient>
  );
}
