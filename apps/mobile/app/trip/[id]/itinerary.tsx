import { Link, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { Button, PremiumCard } from '@voya/ui';
import { Screen } from '../../../src/components/screen';
import { useGenerateItinerary, useTrip } from '../../../src/features/api/hooks';

export default function ItineraryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = useTrip(id);
  const generate = useGenerateItinerary(id);
  return (
    <Screen>
      <PremiumCard title="Itinerary" subtitle="Generate a day-wise plan optimized for pacing and route quality.">
        <Text>{JSON.stringify(trip.data ?? {}, null, 2)}</Text>
        <Button label={generate.isPending ? 'Generating...' : 'Generate itinerary'} onPress={() => generate.mutate()} />
        <Link href={`/trip/${id}/live`} asChild><Button label="Start live mode" onPress={() => undefined} /></Link>
      </PremiumCard>
    </Screen>
  );
}
