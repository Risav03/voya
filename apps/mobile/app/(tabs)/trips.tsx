import { Link } from 'expo-router';
import { Text } from 'react-native';
import { Button, PremiumCard } from '@voya/ui';
import { Screen } from '../../src/components/screen';
import { useTrips } from '../../src/features/api/hooks';

export default function TripsScreen() {
  const trips = useTrips();
  const items = Array.isArray(trips.data) ? trips.data as Array<{ id?: string; title?: string; status?: string }> : [];
  return (
    <Screen>
      <PremiumCard title="Trips" subtitle="Create trips from saved places and generate intelligent day plans.">
        <Link href="/trip/create" asChild><Button label="Create trip" onPress={() => undefined} /></Link>
        {items.map((trip, index) => <Link key={trip.id ?? index} href={`/trip/${trip.id}/itinerary`}><Text>{trip.title} - {trip.status}</Text></Link>)}
      </PremiumCard>
    </Screen>
  );
}
