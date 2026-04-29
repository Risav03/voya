import type { IconComponent } from './icon-types';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

import { Colors } from './colors';

export type AIPickCardProps = {
  Icon: IconComponent;
  title: string;
  subtitle: string;
  borderColor: string;
  buttonLabel?: string;
  buttonGradient?: readonly [string, string];
  onPlanPress?: () => void;
};

export function AIPickCard({
  Icon,
  title,
  subtitle,
  borderColor,
  buttonLabel = 'Plan it!',
  buttonGradient = [Colors.teal, Colors.tealDark],
  onPlanPress,
}: AIPickCardProps) {
  return (
    <View className="flex-row items-center gap-3 rounded-[20px] border-2 bg-surface p-[18px] shadow-black/10 shadow-sm" style={{ borderColor }}>
      <View className="w-[42px] items-center justify-center">
        <Icon size={36} color={Colors.text} strokeWidth={2} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="mb-0.5 font-nunito-extrabold text-[15px] text-text">{title}</Text>
        <Text className="font-nunito-semibold text-xs leading-[18px] text-muted">{subtitle}</Text>
      </View>
      <Pressable accessibilityRole="button" onPress={onPlanPress} disabled={!onPlanPress}>
        <LinearGradient colors={[buttonGradient[0], buttonGradient[1]]} className="rounded-[10px] px-3.5 py-2" start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text className="font-nunito-extrabold text-xs text-surface">{buttonLabel}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}
