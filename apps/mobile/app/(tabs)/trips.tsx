import { ActiveTripCard, Colors, type IconComponent, TrophyCard } from '@voya/ui';
import {
  Building2,
  CircleDot,
  Landmark,
  Leaf,
  Mountain,
  Palmtree,
  Plane,
  Sparkles,
  TowerControl,
  Trophy,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import { useTrip, useTrips } from '../../src/features/api/hooks';

/** Visual accents for trophy cards (icons + gradients only — titles come from real trips). */
const TROPHY_ACCENTS = [
  { Icon: Palmtree, c1: '#4ECDC4', c2: '#45EDE4' },
  { Icon: Mountain, c1: '#FFD93D', c2: '#FFB830' },
  { Icon: Landmark, c1: '#C77DFF', c2: '#E85FFF' },
  { Icon: TowerControl, c1: '#74C0FC', c2: '#45A8FF' },
  { Icon: Building2, c1: '#FF6B6B', c2: '#FF8E53' },
  { Icon: Leaf, c1: '#6BCB77', c2: '#45B855' },
];

type TrophyItem = {
  title: string;
  Icon: IconComponent;
  year: string;
  days: number;
  c1: string;
  c2: string;
  id: string;
};

type TripLite = {
  id: string;
  title: string;
  status: string;
  startDate?: string;
  endDate?: string;
};

function coerceTrip(raw: unknown, index: number): TripLite | null {
  if (typeof raw !== 'object' || !raw) return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : `idx-${index}`;
  const title = typeof o.title === 'string' ? o.title : 'Trip';
  const status = typeof o.status === 'string' ? o.status : 'planning';
  const startDate = typeof o.startDate === 'string' ? o.startDate : undefined;
  const endDate = typeof o.endDate === 'string' ? o.endDate : undefined;
  return { id, title, status, startDate, endDate };
}

function formatDates(t: TripLite): string {
  if (t.startDate && t.endDate) return `${t.startDate} · ${t.endDate}`;
  if (t.startDate) return t.startDate;
  return 'Dates TBD';
}

function countItineraryStops(trip: unknown): number {
  if (!trip || typeof trip !== 'object') return 0;
  const it = (trip as { itinerary?: { payload?: unknown } }).itinerary;
  const payload = it?.payload;
  if (!payload || typeof payload !== 'object') return 0;
  const days = (payload as { days?: unknown }).days;
  if (!Array.isArray(days)) return 0;
  let n = 0;
  for (const day of days) {
    if (day && typeof day === 'object' && 'stops' in day) {
      const stops = (day as { stops?: unknown }).stops;
      if (Array.isArray(stops)) n += stops.length;
    }
  }
  return n;
}

export default function TripsScreen() {
  const router = useRouter();
  const tripsQuery = useTrips();
  const { width } = useWindowDimensions();
  const gap = 14;
  const colW = (width - 44 - gap) / 2;

  const raw = tripsQuery.data;
  const list: TripLite[] = Array.isArray(raw)
    ? (raw.map((item, index) => coerceTrip(item, index)).filter(Boolean) as TripLite[])
    : [];

  const active = list.find((t) => t.status === 'live');

  const completedTrips = list.filter((t) => t.status === 'completed');

  const activeTripDetail = useTrip(active?.id);
  const activeStops = active ? countItineraryStops(activeTripDetail.data) : 0;

  const trophyPast: TrophyItem[] =
    completedTrips.length > 0
      ? completedTrips.map((t, i) => {
          const a = TROPHY_ACCENTS[i % TROPHY_ACCENTS.length]!;
          return {
            title: t.title,
            Icon: a.Icon,
            year: pickYear(t),
            days: estimateDays(t),
            c1: a.c1,
            c2: a.c2,
            id: t.id,
          };
        })
      : [];

  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerClassName="pb-[100px]">
        <LinearGradient colors={['#FFF0E6', Colors.bg]} className="px-[22px] pb-5 pt-[52px]" start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}>
          <View className="mb-1 flex-row items-center gap-2.5">
            <Plane size={32} color={Colors.text} strokeWidth={2} />
            <Text className="font-fredoka text-[32px] text-text">My Trips</Text>
          </View>
          <Text className="mb-5 font-nunito-semibold text-sm text-muted">Adventures past & future</Text>

          <Link href="/trip/create" asChild>
            <Pressable className="mb-6 overflow-hidden rounded-2xl" accessibilityRole="button">
              <LinearGradient colors={[Colors.coral, Colors.coralDark]} className="flex-row items-center justify-center gap-2 py-[15px]" start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Plane size={20} color={Colors.surface} strokeWidth={2.25} />
                <Text className="font-nunito-extrabold text-base text-surface">Plan a new trip!</Text>
              </LinearGradient>
            </Pressable>
          </Link>

          <View className="mb-3 flex-row items-center gap-2">
            <CircleDot size={20} color={Colors.mint} strokeWidth={2.5} fill={Colors.mint} />
            <Text className="mb-3 font-fredoka text-lg text-text">Active Now</Text>
          </View>

          {active ? (
            <ActiveTripCard
              title={active.title}
              HeroIcon={Sparkles}
              dates={formatDates(active)}
              stops={activeStops}
              progressPercent={0}
              onContinue={() => router.push(`/trip/${active.id}/itinerary`)}
            />
          ) : (
            <View className="mb-2 rounded-2xl border-2 border-dashed border-border bg-surface p-[14px]">
              <Text className="text-center font-nunito-semibold text-muted">No live trip — start planning when you are ready.</Text>
            </View>
          )}

          <View className="mb-3 mt-4 flex-row items-center gap-2">
            <Trophy size={22} color={Colors.sun} strokeWidth={2.25} />
            <Text className="mb-0 font-fredoka text-lg text-text">Trophy Case</Text>
          </View>
          <Text className="mb-4 font-nunito-semibold text-xs text-muted">Every trip you have conquered!</Text>

          {trophyPast.length === 0 ? (
            <View className="mb-2 rounded-2xl border-2 border-dashed border-border bg-surface p-[14px]">
              <Text className="text-center font-nunito-semibold text-muted">No completed trips yet — finish a trip to fill your trophy case.</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap" style={{ gap }}>
              {trophyPast.map((item) => {
                const TripIcon = item.Icon;
                return (
                  <View key={item.id} style={{ width: colW }}>
                    <Link href={`/trip/${item.id}/itinerary`} asChild>
                      <Pressable accessibilityRole="link">
                        <TrophyCard title={item.title} Icon={TripIcon} year={item.year} days={item.days} color1={item.c1} color2={item.c2} />
                      </Pressable>
                    </Link>
                  </View>
                );
              })}
            </View>
          )}

          {tripsQuery.isLoading ? <Text className="mt-3 text-center font-nunito-semibold text-muted">Loading trips…</Text> : null}
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

function pickYear(t: TripLite): string {
  const y = t.endDate ?? t.startDate ?? '';
  const match = /\d{4}/.exec(y);
  return match ? match[0]! : '—';
}

function estimateDays(t: TripLite): number {
  if (!t.startDate || !t.endDate) return 0;
  const a = new Date(t.startDate).getTime();
  const b = new Date(t.endDate).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.max(1, Math.round((b - a) / (86400 * 1000)));
}
