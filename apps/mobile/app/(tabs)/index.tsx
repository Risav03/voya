import { Link } from 'expo-router';
import { Text } from 'react-native';
import { Button, PremiumCard } from '@voya/ui';
import { Screen } from '../../src/components/screen';
import { useMe, useGraphSummary } from '../../src/features/api/hooks';

export default function HomeFeedScreen() {
  const me = useMe();
  const summary = useGraphSummary();
  return (
    <Screen>
      <PremiumCard title="Reels to real trips" subtitle="Save inspiration, resolve places, and turn them into live travel plans.">
        <Text>{me.data ? 'Signed in and synced.' : 'Sign in to sync your travel graph.'}</Text>
        <Text>Map summary: {summary.isLoading ? 'loading' : JSON.stringify(summary.data ?? {})}</Text>
        <Link href="/modal/reel-save" asChild><Button label="Save a reel" onPress={() => undefined} /></Link>
      </PremiumCard>
    </Screen>
  );
}
