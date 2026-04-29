import type { IconComponent } from './icon-types';
import { ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Colors } from './colors';

export type CollectionCardProps = {
  title: string;
  count: number;
  Icon: IconComponent;
  gradient: readonly [string, string];
  onPress?: () => void;
};

export function CollectionCard({ title, count, Icon, gradient, onPress }: CollectionCardProps) {
  const content = (
    <View className="overflow-hidden rounded-[20px] bg-surface">
      <LinearGradient colors={[gradient[0], gradient[1]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="relative h-[100px] items-center justify-center">
        <Svg width="100%" height={30} className="absolute left-0 right-0 top-0" viewBox="0 0 300 30" preserveAspectRatio="none">
          <Path d="M0 0 Q75 20 150 10 Q225 0 300 15 L300 0Z" fill="rgba(255,255,255,0.2)" />
        </Svg>
        <View className="shadow-black/20 shadow-sm">
          <Icon size={48} color={Colors.surface} strokeWidth={1.75} />
        </View>
        <View className="absolute right-3 top-2.5 rounded-[10px] bg-[rgba(255,255,255,0.35)] px-2.5 py-1">
          <Text className="font-nunito-extrabold text-[11px] text-surface">{count} places</Text>
        </View>
      </LinearGradient>
      <View className="flex-row items-center gap-2 bg-surface px-4 py-[14px]">
        <Text className="flex-1 font-nunito-extrabold text-[15px] text-text" numberOfLines={2}>
          {title}
        </Text>
        <View className="flex-row items-center gap-1 rounded-[10px] px-2.5 py-1.5" style={{ backgroundColor: `${gradient[0]}22` }}>
          <Text className="font-nunito-extrabold text-[11px]" style={{ color: gradient[0] }}>Open</Text>
          <ArrowRight size={13} color={gradient[0]} strokeWidth={2.5} />
        </View>
      </View>
    </View>
  );

  return (
    <Pressable onPress={onPress} className="overflow-hidden rounded-[20px] shadow-black/10 shadow-sm">
      {content}
    </Pressable>
  );
}
