import { StyleSheet, Text, View } from 'react-native';
import { theme } from './theme';

export function Chip({ label, tone = 'blue' }: { label: string; tone?: 'blue' | 'gold' }) {
  return (
    <View style={[styles.chip, tone === 'gold' && styles.gold]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  chip: { alignSelf: 'flex-start', borderRadius: theme.radius.pill, backgroundColor: theme.colors.softBlue, paddingHorizontal: 12, paddingVertical: 7 },
  gold: { backgroundColor: theme.colors.gold },
  label: { color: theme.colors.ink, fontWeight: '700', fontSize: 12 },
});

