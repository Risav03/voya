import { Colors, type IconComponent, StatCard } from '@voya/ui';
import {
  ArrowRight,
  Clapperboard,
  MapPin,
  Moon,
  Plane,
  Sparkles,
  Sun,
  Sunrise,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useGraphSummary, useMe, useTrips } from '../../src/features/api/hooks';

function greetingBlock(): { text: string; Icon: IconComponent } {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', Icon: Sunrise };
  if (h < 17) return { text: 'Good afternoon', Icon: Sun };
  return { text: 'Good evening', Icon: Moon };
}

function extractName(me: unknown): string {
  if (me && typeof me === 'object' && 'user' in me) {
    const u = (me as { user: { name?: string; email?: string } }).user;
    if (u?.name) return u.name.split(' ')[0] ?? 'traveler';
    if (u?.email) return u.email.split('@')[0] ?? 'traveler';
  }
  return 'traveler';
}

function formatStat(n: number | null | undefined, unknownLabel: string): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return unknownLabel;
  return String(n);
}

export default function HomeFeedScreen() {
  const me = useMe();
  const summary = useGraphSummary();
  const trips = useTrips();
  const greet = greetingBlock();
  const GreetIcon = greet.Icon;

  const name = me.data ? extractName(me.data) : 'traveler';
  const initial = name.slice(0, 1).toUpperCase();

  const edgeCount =
    summary.data && typeof summary.data === 'object' && 'edges' in summary.data
      ? Number((summary.data as { edges?: unknown }).edges)
      : null;
  const placesVal = formatStat(edgeCount, '—');
  const tripsCount = Array.isArray(trips.data) ? trips.data.length : 0;
  const tripsVal = tripsCount > 0 ? String(tripsCount) : '0';

  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerClassName="pb-[100px]" showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#E8F8FF', Colors.bg]} className="px-[22px] pb-5 pt-[56px]" start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}>
          <View className="mb-5 flex-row items-center justify-between">
            <View>
              <View className="mb-0.5 flex-row items-center gap-1.5">
                <GreetIcon size={16} color={Colors.muted} strokeWidth={2.25} />
                <Text className="font-nunito-bold text-[13px] text-muted">{greet.text}</Text>
              </View>
              <Text className="font-fredoka text-[28px] text-text">{name}!</Text>
            </View>
            <LinearGradient colors={[Colors.coral, Colors.sun]} className="h-11 w-11 items-center justify-center rounded-full shadow-black/10 shadow-sm" start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text className="font-fredoka text-lg text-surface">{initial}</Text>
            </LinearGradient>
          </View>
          <View className="flex-row gap-2.5">
            <StatCard Icon={MapPin} value={placesVal} label="Places" accentColor={Colors.coral} />
            <StatCard Icon={Clapperboard} value="—" label="Reels" accentColor={Colors.teal} />
            <StatCard Icon={Plane} value={tripsVal} label="Trips" accentColor={Colors.lavender} />
          </View>
        </LinearGradient>

        <View className="mt-1 gap-1 px-[22px]">
          <Link href="/modal/reel-save" asChild>
            <Pressable className="mb-6 overflow-hidden rounded-[20px] shadow-red-400/30 shadow-md">
              <LinearGradient colors={[Colors.coral, Colors.coralDark]} className="flex-row items-center gap-3.5 rounded-[20px] px-5 py-[18px]" start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View className="h-12 w-12 items-center justify-center rounded-[15px] bg-[rgba(255,255,255,0.25)]">
                  <Clapperboard size={24} color={Colors.surface} strokeWidth={2} />
                </View>
                <View className="flex-1">
                  <Text className="font-nunito-extrabold text-base text-surface">Save a travel reel!</Text>
                  <Text className="mt-0.5 font-nunito-semibold text-xs text-[rgba(255,255,255,0.82)]">Instagram · TikTok · YouTube</Text>
                </View>
                <ArrowRight size={22} color={Colors.surface} strokeWidth={2.5} />
              </LinearGradient>
            </Pressable>
          </Link>

          <View className="mb-3.5 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MapPin size={22} color={Colors.text} strokeWidth={2.25} />
              <Text className="font-fredoka text-xl text-text">Saved Places</Text>
            </View>
            <Text className="font-nunito-bold text-[13px] text-coral">See all</Text>
          </View>

          <View className="mb-2 rounded-2xl border-2 border-dashed border-border bg-surface p-4">
            <Text className="text-center font-nunito-semibold text-sm leading-5 text-muted">
              Places from your saved reels will show here once processing adds them to your graph.
            </Text>
          </View>

          <View className="mb-3.5 mt-3 flex-row items-center gap-2">
            <Sparkles size={22} color={Colors.coral} strokeWidth={2} />
            <Text className="font-fredoka text-xl text-text">AI picks for you</Text>
          </View>
          <View className="mb-2 rounded-2xl border-2 border-dashed border-border bg-surface p-4">
            <Text className="text-center font-nunito-semibold text-sm leading-5 text-muted">
              Personalized suggestions will show here when your travel graph has enough data.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
