import type { Coordinates } from '@voya/types';
import { View, Text, StyleSheet } from 'react-native';

export interface MapPin {
  id: string;
  title: string;
  coordinates: Coordinates;
  status: 'saved' | 'visited' | 'planned';
}

export interface TravelMapProps {
  pins: MapPin[];
  center?: Coordinates;
  onPinPress?: (pin: MapPin) => void;
}

export function TravelMap({ pins }: TravelMapProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google Maps provider abstraction</Text>
      <Text style={styles.copy}>{pins.length} pins ready for native map rendering.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: 240, borderRadius: 28, padding: 20, backgroundColor: '#eaf3ff' },
  title: { fontSize: 18, fontWeight: '700', color: '#10233f' },
  copy: { marginTop: 8, color: '#516070' },
});
