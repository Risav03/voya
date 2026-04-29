import type { IconComponent } from './icon-types';
import { Text, View } from 'react-native';

export type StatCardProps = {
  Icon: IconComponent;
  value: string;
  label: string;
  accentColor: string;
};

export function StatCard({ Icon, value, label, accentColor }: StatCardProps) {
  const borderTint = `${accentColor}22`;
  return (
    <View className="flex-1 items-center rounded-2xl border-2 bg-surface px-2 py-[14px] shadow-black/10 shadow-sm" style={{ borderColor: borderTint }}>
      <View className="mb-0.5 h-[22px] justify-center">
        <Icon size={20} color={accentColor} strokeWidth={2.5} />
      </View>
      <Text className="font-fredoka text-2xl" style={{ color: accentColor }}>{value}</Text>
      <Text className="mt-0.5 font-nunito-bold text-[10px] text-muted">{label}</Text>
    </View>
  );
}
