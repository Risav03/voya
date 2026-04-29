import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from './theme';

export function Button({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.button}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignSelf: 'flex-start', borderRadius: theme.radius.pill, backgroundColor: theme.colors.ink, paddingHorizontal: 18, paddingVertical: 12 },
  label: { color: 'white', fontWeight: '700' },
});
