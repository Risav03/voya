import { Award, ChevronLeft } from 'lucide-react-native';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Colors } from '@voya/ui';

import { VoyaScreen } from '../src/components/voya-screen';

export default function AchievementsScreen() {
  return (
    <VoyaScreen scroll={false}>
      <View className="mb-2 flex-row items-center gap-2.5">
        <Award size={32} color="#FF6B6B" strokeWidth={2} />
        <Text className="font-fredoka text-[28px] text-text">Achievements</Text>
      </View>
      <Text className="mb-5 font-nunito-semibold text-[15px] text-muted opacity-70">
        Tracks, stamps, badges, and rewards will shine here soon.
      </Text>
      <Link href="/(tabs)" asChild>
        <Pressable className="mt-3 flex-row items-center gap-1" accessibilityRole="link">
          <ChevronLeft size={18} color={Colors.coral} strokeWidth={2.25} />
          <Text className="font-nunito-bold text-[15px] text-coral">Back to Home</Text>
        </Pressable>
      </Link>
    </VoyaScreen>
  );
}
