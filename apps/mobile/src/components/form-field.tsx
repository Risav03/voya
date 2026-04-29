import { StyleSheet, Text, TextInput, View } from 'react-native';

export function FormField({ label, value, onChangeText, placeholder, secureTextEntry }: { label: string; value: string; onChangeText: (value: string) => void; placeholder?: string; secureTextEntry?: boolean }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} secureTextEntry={secureTextEntry} style={styles.input} autoCapitalize="none" />
    </View>
  );
}
const styles = StyleSheet.create({ wrap: { gap: 6 }, label: { fontWeight: '700', color: '#10233f' }, input: { borderWidth: 1, borderColor: '#dbe3ef', backgroundColor: 'white', borderRadius: 16, padding: 14 } });
