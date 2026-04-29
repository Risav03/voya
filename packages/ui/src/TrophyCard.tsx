import type { IconComponent } from './icon-types';
import { Calendar, CheckCircle2 } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Colors } from './colors';
import { Trophy3D } from './illustrations/Trophy3D';

export type TrophyCardProps = {
  title: string;
  Icon: IconComponent;
  year: string;
  days: number;
  color1: string;
  color2: string;
  onPress?: () => void;
};

export function TrophyCard({ title, Icon: TripIcon, year, days, color1, color2, onPress }: TrophyCardProps) {
  const content = (
    <View className="items-center overflow-hidden rounded-[20px] border-2 bg-surface px-2.5 pb-3 pt-4 shadow-black/10 shadow-sm" style={{ borderColor: `${color1}22` }}>
      <View className="absolute -right-5 -top-5 h-20 w-20 rounded-full" style={{ backgroundColor: `${color1}14` }} />
      <View className="mb-1">
        <View className="relative items-center">
          <Trophy3D color1={color1} color2={color2} size={105} />
          <View className="absolute left-0 right-0 top-[18px] h-full items-center justify-center pb-2">
            <TripIcon size={36} color={Colors.text} strokeWidth={2} />
          </View>
        </View>
      </View>
      <Text className="mt-1.5 min-h-9 text-center font-fredoka text-sm leading-[18px] text-text" numberOfLines={2}>
        {title}
      </Text>
      <View className="mt-1 flex-row items-center gap-1">
        <Calendar size={12} color={Colors.muted} strokeWidth={2.25} />
        <Text className="font-nunito-bold text-[11px] text-muted">
          {year && year !== '—' ? year : '—'} · {days > 0 ? `${days}d` : '—'}
        </Text>
      </View>
      <View className="mt-2 flex-row items-center gap-1 rounded-full px-2.5 py-1" style={{ backgroundColor: `${color1}1A` }}>
        <CheckCircle2 size={12} color={color1} strokeWidth={2.5} />
        <Text className="font-nunito-extrabold text-[10px]" style={{ color: color1 }}>Completed</Text>
      </View>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}
