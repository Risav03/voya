import { useState } from 'react';
import { router } from 'expo-router';
import { Text } from 'react-native';
import { Button, PremiumCard } from '@voya/ui';
import { Screen } from '../../src/components/screen';
import { FormField } from '../../src/components/form-field';
import { useCreateTrip } from '../../src/features/api/hooks';

export default function CreateTripScreen() {
  const [title, setTitle] = useState('');
  const create = useCreateTrip();
  return (
    <Screen>
      <PremiumCard title="Create trip" subtitle="Start with destination intent; itinerary intelligence is queued after creation.">
        <FormField label="Trip title" value={title} onChangeText={setTitle} placeholder="Weekend in the city" />
        <Button label={create.isPending ? 'Creating...' : 'Create trip'} onPress={() => create.mutate({ title }, { onSuccess: (trip) => router.push(`/trip/${trip.id}/itinerary`) })} />
        {create.error ? <Text>{create.error.message}</Text> : null}
      </PremiumCard>
    </Screen>
  );
}
