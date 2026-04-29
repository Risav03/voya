import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { Button, PremiumCard } from '@voya/ui';
import { Screen } from '../../../src/components/screen';
import { FormField } from '../../../src/components/form-field';
import { useCheckIn } from '../../../src/features/api/hooks';

export default function LiveTripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [placeId, setPlaceId] = useState('');
  const checkIn = useCheckIn();
  return (
    <Screen>
      <PremiumCard title="Live travel mode" subtitle="Capture check-ins and sync progress to your graph.">
        <FormField label="Place ID" value={placeId} onChangeText={setPlaceId} placeholder="Resolved place UUID" />
        <Button label="One-tap check-in" onPress={() => checkIn.mutate({ tripId: id, placeId, coordinates: { latitude: 0, longitude: 0 }, checkedInAt: new Date().toISOString(), mediaAssetIds: [] })} />
        {checkIn.data ? <Text>{JSON.stringify(checkIn.data)}</Text> : null}
      </PremiumCard>
    </Screen>
  );
}
