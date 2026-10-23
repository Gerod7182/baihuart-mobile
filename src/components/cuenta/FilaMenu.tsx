import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Props = {
  icono: IconName;
  titulo: string;
  subtitulo?: string;
  peligro?: boolean;
  onPress: () => void;
};

export function FilaMenu({ icono, titulo, subtitulo, peligro = false, onPress }: Readonly<Props>) {
  const color = peligro ? colors.rojo : colors.blanco;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.fila, pressed && styles.presionada]}
    >
      <View style={styles.icono}>
        <Ionicons name={icono} size={20} color={color} />
      </View>
      <View style={styles.textos}>
        <Text style={[styles.titulo, { color }]}>{titulo}</Text>
        {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#555555" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  presionada: { backgroundColor: '#161616' },
  icono: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1c1c1c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: { flex: 1 },
  titulo: { fontSize: 14, fontWeight: 'bold' },
  subtitulo: { color: '#888888', fontSize: 12, marginTop: 2 },
});