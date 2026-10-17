import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../theme/colors';
import { BotonDegradado } from '../BotonDegradado';

type Props = {
  onExplorar: () => void;
};

export function CarritoVacio({ onExplorar }: Readonly<Props>) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.circulo}>
        <Ionicons name="cart-outline" size={56} color={colors.rojo} />
      </View>
      <Text style={styles.titulo}>Tu carrito está vacío</Text>
      <Text style={styles.mensaje}>
        Aún no has elegido ninguna pieza. Explora las camisetas, stickers y pósters de
        baihuart y llévate arte que cobra vida.
      </Text>
      <View style={styles.boton}>
        <BotonDegradado texto="Explorar la tienda" onPress={onExplorar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  circulo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#3a1010',
    backgroundColor: colors.gris,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  titulo: {
    color: colors.blanco,
    fontFamily: fonts.brand,
    fontSize: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  mensaje: {
    color: '#9a9a9a',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 28,
  },
  boton: { alignSelf: 'stretch', maxWidth: 360, width: '100%' },
});