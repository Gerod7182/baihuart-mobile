import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { ImagenAdmin } from './ImagenAdmin';

type Props = {
  ruta?: string;
  titulo: string;
  subtitulo?: string;
  etiqueta?: string;
  resaltada?: boolean;
  onEditar: () => void;
  onDuplicar?: () => void;
  onEliminar: () => void;
};

export function TarjetaAdmin({
  ruta,
  titulo,
  subtitulo,
  etiqueta,
  resaltada = false,
  onEditar,
  onDuplicar,
  onEliminar,
}: Readonly<Props>) {
  return (
    <View style={[styles.tarjeta, resaltada && styles.resaltada]}>
      <ImagenAdmin ruta={ruta} ancho={72} alto={72} />
      <View style={styles.textos}>
        <Text style={styles.titulo} numberOfLines={2}>
          {titulo}
        </Text>
        {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
        {etiqueta ? (
          <View style={styles.etiqueta}>
            <Text style={styles.textoEtiqueta}>{etiqueta}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.acciones}>
        <Pressable onPress={onEditar} hitSlop={8} style={styles.boton} accessibilityLabel="Editar">
          <Ionicons name="create-outline" size={18} color={colors.blanco} />
        </Pressable>
        {onDuplicar ? (
          <Pressable onPress={onDuplicar} hitSlop={8} style={styles.boton} accessibilityLabel="Duplicar">
            <Ionicons name="copy-outline" size={18} color={colors.blanco} />
          </Pressable>
        ) : null}
        <Pressable
          onPress={onEliminar}
          hitSlop={8}
          style={[styles.boton, styles.botonPeligro]}
          accessibilityLabel="Eliminar"
        >
          <Ionicons name="trash-outline" size={18} color={colors.rojo} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.gris,
    borderWidth: 1,
    borderColor: '#2a0a0a',
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
  },
  resaltada: { borderColor: colors.rojo },
  textos: { flex: 1, gap: 3 },
  titulo: { color: colors.blanco, fontSize: 14, fontWeight: 'bold' },
  subtitulo: { color: '#999999', fontSize: 12 },
  etiqueta: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#3a1010',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
  },
  textoEtiqueta: { color: colors.rojo, fontSize: 10, textTransform: 'capitalize' },
  acciones: { gap: 8 },
  boton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#1c1c1c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonPeligro: { backgroundColor: '#2a0a0a' },
});