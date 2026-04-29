import { CollectionCard, Colors, type IconComponent } from '@voya/ui';
import { Croissant, Landmark, Plus, Shell, Sparkles, Waves } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { FormField } from '../../src/components/form-field';
import { useCollections, useCreateCollection } from '../../src/features/api/hooks';

const PRESETS: { grad: readonly [string, string]; Icon: IconComponent }[] = [
  { grad: ['#FF6B6B', '#FF8E53'], Icon: Landmark },
  { grad: ['#4ECDC4', '#45B7AA'], Icon: Waves },
  { grad: ['#C77DFF', '#E85FFF'], Icon: Croissant },
  { grad: ['#74C0FC', '#45A8FF'], Icon: Shell },
];

export default function CollectionsScreen() {
  const [name, setName] = useState('');
  const collections = useCollections();
  const create = useCreateCollection();

  const items = Array.isArray(collections.data) ? collections.data : [];

  function createBoard() {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Name needed', 'Enter a board name.');
      return;
    }
    create.mutate(
      { name: trimmed },
      {
        onSuccess: () => setName(''),
        onError: (e: Error) => Alert.alert('Could not create', e.message),
      },
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <LinearGradient colors={['#F0FFF4', Colors.bg]} className="px-[22px] pb-5 pt-[52px]" start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}>
          <View className="mb-1.5 flex-row items-center gap-2.5">
            <Landmark size={34} color={Colors.text} strokeWidth={2} />
            <Text className="font-fredoka text-[32px] text-text">My Collections</Text>
          </View>
          <Text className="mb-[18px] font-nunito-semibold text-sm text-muted">Organise your dream spots</Text>

          <FormField label="New collection" value={name} onChangeText={setName} placeholder="Name your collection" />

          <TouchableOpacity
            onPress={createBoard}
            accessibilityRole="button"
            className="mb-[22px] mt-2.5 flex-row items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#FF6B6B66] bg-surface px-[14px] py-4"
          >
            <Plus size={22} color={Colors.coral} strokeWidth={2.5} />
            <Text className="font-nunito-extrabold text-[15px] text-coral">Create new board</Text>
          </TouchableOpacity>

          <View className="gap-3.5">
            {items.length === 0 ? (
              <View className="mt-2 items-center gap-2">
                <Sparkles size={22} color={Colors.muted} strokeWidth={2} />
                <Text className="text-center font-nunito-semibold text-muted">Saved collections will glow up here</Text>
              </View>
            ) : (
              items.map((item, index) => {
                const preset = PRESETS[index % PRESETS.length]!;
                if (typeof item !== 'object' || !item || !('name' in item)) return null;
                const title = String((item as { name: string }).name);
                return (
                  <CollectionCard
                    key={(item as { id?: string }).id ?? title + index.toString()}
                    title={title}
                    Icon={preset.Icon}
                    gradient={preset.grad}
                    count={Math.max(1, items.length)}
                  />
                );
              })
            )}
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}
