import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme/colors';

type Props = {
  visible: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar: string;
  textoCancelar?: string;
  procesando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
};

export function ConfirmarModal({
  visible,
  titulo,
  mensaje,
  textoConfirmar,
  textoCancelar = 'No',
  procesando = false,
  onConfirmar,
  onCancelar,
}: Readonly<Props>) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancelar}>
      <View style={styles.fondo}>
        <View style={styles.caja}>
          <Text style={styles.titulo}>{titulo}</Text>
          <Text style={styles.mensaje}>{mensaje}</Text>
          <View style={styles.botones}>
            <Pressable
              style={[styles.boton, styles.botonSecundario]}
              onPress={onCancelar}
              disabled={procesando}
            >
              <Text style={styles.textoSecundario}>{textoCancelar}</Text>
            </Pressable>
            <Pressable
              style={[styles.boton, styles.botonPeligro, procesando && styles.deshabilitado]}
              onPress={onConfirmar}
              disabled={procesando}
            >
              <Text style={styles.textoPeligro}>
                {procesando ? 'Procesando...' : textoConfirmar}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  caja: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.gris,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#3a1010',
    padding: 20,
  },
  titulo: { color: colors.blanco, fontFamily: fonts.brand, fontSize: 15, marginBottom: 10 },
  mensaje: { color: '#bbbbbb', fontSize: 14, lineHeight: 20, marginBottom: 20 },
  botones: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  boton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  botonSecundario: { borderWidth: 1, borderColor: '#444444' },
  botonPeligro: { backgroundColor: colors.rojo },
  deshabilitado: { opacity: 0.6 },
  textoSecundario: { color: colors.blanco, fontSize: 13 },
  textoPeligro: { color: colors.blanco, fontWeight: 'bold', fontSize: 13 },
});