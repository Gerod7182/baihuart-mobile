import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../../theme/colors';

type Props = TextInputProps & {
  etiqueta: string;
  ayuda?: string;
};

export function CampoAdmin({ etiqueta, ayuda, style, ...resto }: Readonly<Props>) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <TextInput
        placeholderTextColor="#555555"
        selectionColor={colors.rojo}
        style={[styles.input, style]}
        {...resto}
      />
      {ayuda ? <Text style={styles.ayuda}>{ayuda}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { marginBottom: 14 },
  etiqueta: {
    color: '#aaaaaa',
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 10,
    color: colors.blanco,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  ayuda: { color: '#666666', fontSize: 11, marginTop: 5 },
});