import { useState } from 'react';
import { Text } from 'react-native';
import { Button, PremiumCard } from '@voya/ui';
import { Screen } from '../../src/components/screen';
import { FormField } from '../../src/components/form-field';
import { useCollections, useCreateCollection } from '../../src/features/api/hooks';

export default function CollectionsScreen() {
  const [name, setName] = useState('');
  const collections = useCollections();
  const create = useCreateCollection();
  const items = Array.isArray(collections.data) ? collections.data : [];
  return (
    <Screen>
      <PremiumCard title="Collections" subtitle="Organize saved places into trip-ready boards.">
        <FormField label="New collection" value={name} onChangeText={setName} placeholder="Tokyo cafes" />
        <Button label="Create collection" onPress={() => create.mutate({ name })} />
        {items.map((item, index) => <Text key={index}>{JSON.stringify(item)}</Text>)}
      </PremiumCard>
    </Screen>
  );
}
