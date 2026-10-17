import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../theme/colors';
import { BotonDegradado } from '../BotonDegradado';

type Props = {
  total: number;
  unidades: number;
  textoBoton: string;
  procesando: boolean;
  error: string;
  onComprar: () => void;
};

// Barra fija inferior (como en Temu y Adidas): el total y el botón de compra
// siempre a la vista mientras se recorre la lista.
export function BarraTotal({
  total,
  unidades,
  textoBoton,
  procesando,
  error,
  onComprar,
}: Readonly<Props>) {
  return (
    <View style={styles.contenedor}>
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      <View style={styles.fila}>
        <View>
          <Text style={styles.etiqueta}>
            Total · {unidades} {unidades === 1 ? 'artículo' : 'artículos'}
          </Text>
          <Text style={styles.total}>${total.toLocaleString('es-CO')}</Text>
        </View>
        <View style={styles.boton}>
          <BotonDegradado texto={textoBoton} onPress={onComprar} cargando={procesando} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: colors.gris,
    borderTopWidth: 1,
    borderTopColor: '#2a0a0a',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  etiqueta: { color: '#8a8a8a', fontSize: 11 },
  total: { color: colors.rojo, fontFamily: fonts.brand, fontSize: 20, marginTop: 2 },
  boton: { flex: 1 },
  error: { color: colors.rojo, fontSize: 12, marginBottom: 10 },
});