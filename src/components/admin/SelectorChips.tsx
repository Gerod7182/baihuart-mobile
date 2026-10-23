import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type Props<T extends string> = {
  etiqueta: string;
  opciones: readonly T[];
  valor: T;
  onCambiar: (nuevo: T) => void;
};

export function SelectorChips<T extends string>({
  etiqueta,
  opciones,
  valor,
  onCambiar,
}: Readonly<Props<T>>) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <View style={styles.fila}>
        {opciones.map((opcion) => {
          const activo = opcion === valor;
          return (
            <Pressable
              key={opcion}
              onPress={() => onCambiar(opcion)}
              style={[styles.chip, activo && styles.chipActivo]}
            >
              <Text style={[styles.texto, activo && styles.textoActivo]}>{opcion}</Text>
            </Pressable>
          );
        })}
      </View>
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
  fila: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: '#3a1010',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  chipActivo: { backgroundColor: colors.rojo, borderColor: colors.rojo },
  texto: { color: '#cccccc', fontSize: 12, textTransform: 'capitalize' },
  textoActivo: { color: colors.blanco, fontWeight: 'bold' },
});