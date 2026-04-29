import { Colors, Globe3D, StatCard } from '@voya/ui';
import { Globe, LayoutGrid, MapPinned, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Text, View } from 'react-native';

import { useGraphSummary } from '../../src/features/api/hooks';

const BORDER_CYCL = [Colors.coral, Colors.teal, Colors.lavender, Colors.sun];

function formatPlaces(edges: number | null | undefined): string {
  if (edges === null || edges === undefined || !Number.isFinite(edges)) return '—';
  return String(edges);
}

export default function GlobeScreen() {
  const summary = useGraphSummary();
  const edgeRaw =
    summary.data && typeof summary.data === 'object' && 'edges' in summary.data
      ? Number((summary.data as { edges?: unknown }).edges)
      : null;

  const placesVal = formatPlaces(edgeRaw);

  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerClassName="pb-[100px]" showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#E8F8FF', Colors.bg]} className="items-center px-[22px] pb-5 pt-[56px]" start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}>
          <View className="mb-1.5 flex-row items-center gap-2.5">
            <Globe size={30} color={Colors.text} strokeWidth={2} />
            <Text className="font-fredoka text-[28px] text-text">Your world</Text>
          </View>
          <Text className="mb-3 max-w-[300px] text-center font-nunito-semibold text-[13px] leading-5 text-muted">
            Places worth remembering · stats update as you save reels
          </Text>
          <View className="py-2">
            <Globe3D size={240} />
          </View>
          <View className="mt-2 w-full flex-row gap-2.5">
            <StatCard Icon={MapPinned} value="—" label="Countries" accentColor={Colors.coral} />
            <StatCard Icon={MapPin} value={placesVal} label="Places" accentColor={Colors.teal} />
            <StatCard Icon={LayoutGrid} value="—" label="Continents" accentColor={Colors.lavender} />
          </View>
        </LinearGradient>

        <View className="mt-3 px-[22px]">
          <Text className="mb-3.5 font-fredoka text-xl text-text">Visited</Text>
          <View className="self-start flex-row items-center gap-1.5 rounded-full border-2 border-[#FF6B6B55] bg-surface px-3 py-2 shadow-black/10 shadow-sm">
            <MapPin size={14} color={Colors.muted} strokeWidth={2.25} />
            <Text className="flex-1 flex-wrap font-nunito-semibold text-[13px] text-text">
              Cities appear here once your travel graph has visits.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
