import type { TravelGraphEdge, TravelGraphNode } from '@voya/types';
import { View, Text, StyleSheet } from 'react-native';

export function TravelGlobe({ nodes, edges }: { nodes: TravelGraphNode[]; edges: TravelGraphEdge[] }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>3D Travel Globe</Text>
      <Text style={styles.copy}>{nodes.length} nodes and {edges.length} arcs prepared for React Three Fiber.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: 260, borderRadius: 32, padding: 24, backgroundColor: '#111827' },
  title: { fontSize: 22, fontWeight: '800', color: 'white' },
  copy: { marginTop: 8, color: '#c7d2fe' },
});
