import { Colors } from '@voya/ui';
import { ArrowRight, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
    <LinearGradient colors={['#E8F8FF', Colors.bg]} className="flex-1 justify-center p-6" start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}>
      <View className="gap-4 rounded-[24px] border-2 border-border bg-surface p-6">
        <Text className="font-fredoka text-[32px] text-text">Welcome back</Text>
        <Text className="font-nunito-semibold text-[15px] leading-[22px] text-muted">
          Sign in connects your reels, trips, and map through the existing API boundary — OAuth and email flows land here next.
        </Text>
        <Pressable accessibilityRole="button" className="mt-1 overflow-hidden rounded-full" onPress={() => router.replace('/(tabs)')}>
          <LinearGradient colors={[Colors.coral, Colors.coralDark]} className="flex-row items-center justify-center gap-2 py-3.5" start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text className="font-nunito-extrabold text-base text-surface">Browse the app</Text>
            <ArrowRight size={18} color={Colors.surface} strokeWidth={2.5} />
          </LinearGradient>
        </Pressable>
        <Link href="/(auth)" asChild>
          <Pressable accessibilityRole="link" className="mt-2 flex-row items-center justify-center gap-0.5">
            <ChevronLeft size={18} color={Colors.coral} strokeWidth={2.25} />
            <Text className="font-nunito-semibold text-sm text-coral">Back to intro</Text>
          </Pressable>
        </Link>
      </View>
    </LinearGradient>
    </SafeAreaView>
  );
}
