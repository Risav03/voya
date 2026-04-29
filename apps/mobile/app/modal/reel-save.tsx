import { Colors, type IconComponent } from '@voya/ui';
import type { PlaceCandidate, ReelIngestionJob } from '@voya/types';
import {
  Bookmark,
  Bot,
  Camera,
  ChevronLeft,
  Crosshair,
  Film,
  Link2,
  MapPin,
  MessageCircle,
  Music,
  Plane,
  PlayCircle,
  Search,
  Smartphone,
  Sparkles,
  Unlock,
  X as XIcon,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useIngestReel, useIngestionJob } from '../../src/features/api/hooks';

const PLATFORMS: { label: string; id: 'instagram' | 'tiktok' | 'youtube' | 'other'; Icon: IconComponent }[] = [
  { label: 'Instagram', id: 'instagram', Icon: Camera },
  { label: 'TikTok', id: 'tiktok', Icon: Music },
  { label: 'YouTube', id: 'youtube', Icon: PlayCircle },
  { label: 'Twitter', id: 'other', Icon: MessageCircle },
];

const TIP_LINES = [
  { Icon: Smartphone, text: 'Share any reel or video post' },
  { Icon: Unlock, text: 'Works with public posts only' },
  { Icon: Crosshair, text: 'AI extracts GPS-level accuracy' },
] as const;

type Phase = 'idle' | 'processing' | 'done' | 'failed';

function coerceJob(data: unknown): ReelIngestionJob | null {
  if (typeof data !== 'object' || !data) return null;
  return data as ReelIngestionJob;
}

export default function ReelSaveModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sourceUrl, setSourceUrl] = useState('');
  const [focused, setFocused] = useState(false);
  const [platform, setPlatform] = useState<(typeof PLATFORMS)[number]['id']>('other');

  const ingest = useIngestReel();
  const jobId = ingest.data?.job.id;
  const job = useIngestionJob(jobId);

  const j = coerceJob(job.data);

  const phase: Phase = useMemo(() => {
    if (ingest.isError) return 'failed';
    if (j?.status === 'failed') return 'failed';
    if (j?.status === 'completed') return 'done';
    if (ingest.isPending) return 'processing';
    if (jobId && job.isFetching && !job.isFetched) return 'processing';
    if (jobId && j && ['draft', 'active', 'paused'].includes(j.status)) return 'processing';
    return 'idle';
  }, [ingest.isError, ingest.isPending, j, job.isFetched, job.isFetching, jobId]);

  const topCandidate: PlaceCandidate | undefined = j?.candidatePlaces?.[0];

  function submit() {
    const u = sourceUrl.trim();
    if (!u) return;
    ingest.mutate({ sourceUrl: u, sourcePlatform: platform, rawSharePayload: {} });
  }

  const canSubmit = sourceUrl.trim().length > 0 && !ingest.isPending;

  return (
    <View className="flex-1 bg-bg" style={{ paddingBottom: insets.bottom + 12 }}>
      <LinearGradient colors={['#FFF0E6', Colors.bg]} className="border-b-2 border-border px-[22px] pb-4" style={{ paddingTop: insets.top + 12 }} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}>
        <Pressable className="mb-3.5 self-start flex-row items-center gap-1 rounded-full border-[1.5px] border-border bg-surface px-3 py-1.5" onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back">
          <ChevronLeft size={18} color={Colors.muted} strokeWidth={2.25} />
          <Text className="font-nunito-bold text-[13px] text-muted">Back</Text>
        </Pressable>
        <View className="mb-1 flex-row items-center gap-2.5">
          <Film size={32} color={Colors.coral} strokeWidth={2} />
          <Text className="font-fredoka text-[30px] text-text">Save a Reel</Text>
        </View>
        <Text className="font-nunito-semibold text-[13px] text-muted">Paste any travel video link — AI finds the real place!</Text>
      </LinearGradient>

      <ScrollView contentContainerClassName="gap-[18px] p-[22px] pb-10" keyboardShouldPersistTaps="handled">
        <View className="flex-row gap-2.5">
          {PLATFORMS.map((p) => {
            const on = platform === p.id;
            const PIcon = p.Icon;
            return (
              <Pressable key={p.id} onPress={() => setPlatform(p.id)} className={`flex-1 items-center gap-1.5 rounded-2xl border-[1.5px] bg-surface py-2.5 shadow-black/10 shadow-sm ${on ? 'border-coral' : 'border-border'}`} accessibilityRole="button">
                <PIcon size={18} color={on ? Colors.coral : Colors.muted} strokeWidth={2.25} />
                <Text className="font-nunito-bold text-[9px] text-muted">{p.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View className="flex-row items-center gap-2.5 rounded-2xl border-2 bg-surface px-[14px] py-3" style={{ borderColor: sourceUrl.length ? Colors.coral : Colors.border }}>
          <Link2 size={18} color={Colors.muted} strokeWidth={2.25} />
          <TextInput
            value={sourceUrl}
            onChangeText={setSourceUrl}
            placeholder="Paste your travel reel link here..."
            placeholderTextColor={Colors.muted}
            className="flex-1 py-0 font-nunito-semibold text-sm text-text"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          {sourceUrl.length > 0 ? (
            <Pressable onPress={() => setSourceUrl('')} hitSlop={8} accessibilityLabel="Clear URL">
              <XIcon size={22} color={Colors.muted} strokeWidth={2.5} />
            </Pressable>
          ) : null}
        </View>

        {phase === 'idle' || phase === 'failed' ? (
          <>
            <Pressable
              className={`flex-row items-center justify-center gap-2 rounded-2xl py-4 ${canSubmit ? 'bg-coral' : 'bg-[#F0EDE8]'}`}
              onPress={submit}
              disabled={!canSubmit}
              accessibilityRole="button"
            >
              <Search size={18} color={canSubmit ? Colors.surface : Colors.muted} strokeWidth={2.5} />
              <Text className={`font-nunito-extrabold text-base ${canSubmit ? 'text-surface' : 'text-muted'}`}>
                {canSubmit ? 'Find that place!' : 'Paste a link first'}
              </Text>
            </Pressable>
            {ingest.error ? <Text className="font-nunito-semibold text-[13px] text-red-700">{ingest.error.message}</Text> : null}
            {phase === 'failed' ? <Text className="font-nunito-semibold text-[13px] text-red-700">Something went wrong. Try again.</Text> : null}
          </>
        ) : null}

        {phase === 'processing' ? (
          <View className="items-center rounded-[20px] border-2 bg-surface p-7" style={{ borderColor: `${Colors.teal}44` }}>
            <Bot size={44} color={Colors.teal} strokeWidth={2} />
            <View className="mb-3.5 flex-row items-center gap-2">
              {[Colors.coral, Colors.teal, '#FFD93D'].map((c, i) => (
                <View key={i} className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </View>
            <Text className="mb-1.5 font-nunito-extrabold text-base text-text">AI is working its magic...</Text>
            <View className="max-w-[280px] flex-row items-start gap-2">
              <Sparkles size={16} color={Colors.muted} strokeWidth={2} />
              <Text className="flex-1 font-nunito-semibold text-[13px] text-muted">Scanning video for location clues</Text>
            </View>
            <ActivityIndicator color={Colors.coral} className="mt-3" />
          </View>
        ) : null}

        {phase === 'done' && topCandidate ? (
          <View className="rounded-[20px] border-2 bg-surface p-4 shadow-black/10 shadow-sm" style={{ borderColor: `${Colors.mint}55` }}>
            <View className="mb-3.5 flex-row items-center gap-3 rounded-xl p-[14px]" style={{ backgroundColor: `${Colors.mint}18` }}>
              <MapPin size={32} color={Colors.mint} strokeWidth={2.25} />
              <View className="flex-1">
                <Text className="font-nunito-extrabold text-base text-text">{topCandidate.name}</Text>
                <Text className="mt-0.5 font-nunito-semibold text-xs text-muted">Confidence: {Math.round(topCandidate.confidence * 100)}% · Found from reel!</Text>
              </View>
              <View className="rounded-[10px] bg-mint px-2.5 py-[5px]">
                <Text className="font-nunito-extrabold text-[11px] text-surface">Saved</Text>
              </View>
            </View>
            <View className="flex-row gap-2.5">
              <Link href="/(tabs)/collections" asChild>
                <Pressable className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border-2 border-border bg-[#F7F7F7] py-3">
                  <Bookmark size={16} color={Colors.text} strokeWidth={2.25} />
                  <Text className="font-nunito-bold text-[13px] text-text">Add to board</Text>
                </Pressable>
              </Link>
              <Link href="/trip/create" asChild>
                <Pressable className="flex-1">
                  <LinearGradient colors={[Colors.coral, Colors.coralDark]} className="flex-row items-center justify-center gap-1.5 rounded-xl py-3" start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <Plane size={16} color={Colors.surface} strokeWidth={2.25} />
                    <Text className="font-nunito-extrabold text-[13px] text-surface">Create trip!</Text>
                  </LinearGradient>
                </Pressable>
              </Link>
            </View>
          </View>
        ) : null}

        {phase === 'done' && !topCandidate ? (
          <View className="items-center rounded-[20px] border-2 border-border bg-surface p-7">
            <Text className="mb-1.5 font-nunito-extrabold text-base text-text">Saved!</Text>
            <Text className="font-nunito-semibold text-[13px] text-muted">We queued your reel — check collections soon.</Text>
            <Link href="/(tabs)/collections" asChild>
              <Pressable className="mt-3 w-full">
                <LinearGradient colors={[Colors.coral, Colors.coralDark]} className="flex-row items-center justify-center gap-1.5 rounded-xl py-3" start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Text className="font-nunito-extrabold text-[13px] text-surface">Open collections</Text>
                </LinearGradient>
              </Pressable>
            </Link>
          </View>
        ) : null}

        {phase === 'idle' ? (
          <View className="gap-3">
            <Text className="mb-1 font-fredoka text-base text-muted">Supported platforms</Text>
            <View className="rounded-2xl border-[1.5px] border-border bg-surface px-[14px] py-2">
              {TIP_LINES.map((tip, i) => {
                const Ti = tip.Icon;
                return (
                  <View key={tip.text} className={`flex-row items-center gap-2.5 py-2 ${i < TIP_LINES.length - 1 ? 'border-b border-border' : ''}`}>
                    <Ti size={16} color={Colors.coral} strokeWidth={2.25} />
                    <Text className="flex-1 font-nunito-semibold text-sm text-text">{tip.text}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
