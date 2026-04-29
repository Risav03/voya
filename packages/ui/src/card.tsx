import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from './theme';

export function PremiumCard({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: theme.radius.card, padding: theme.spacing.lg, backgroundColor: theme.colors.surface, gap: theme.spacing.md, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20 },
  title: { color: theme.colors.ink, fontSize: 24, fontWeight: '800' },
  subtitle: { color: theme.colors.muted, fontSize: 15, lineHeight: 22 },
  body: { gap: theme.spacing.md },
});
