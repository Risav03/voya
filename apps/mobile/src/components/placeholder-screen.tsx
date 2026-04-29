import { PremiumCard, Button, Chip } from '@voya/ui';
import { Text } from 'react-native';
import { Screen } from './screen';

export function PlaceholderScreen({ title, subtitle, premium }: { title: string; subtitle: string; premium?: boolean }) {
  return (
    <Screen>
      <PremiumCard title={title} subtitle={subtitle}>
        {premium ? <Chip label="Premium intelligence" tone="gold" /> : <Chip label="Included in free" tone="blue" />}
        <Text>Production module boundary is wired; provider data and native surfaces plug in here.</Text>
        <Button label="Continue" onPress={() => undefined} />
      </PremiumCard>
    </Screen>
  );
}
