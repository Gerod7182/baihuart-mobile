import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../theme/colors';
import { BotonDegradado } from '../BotonDegradado';

type Props = {
  onVerPedidos: () => void;
  onSeguirComprando: () => void;
};

export function PedidoExitoso({ onVerPedidos, onSeguirComprando }: Readonly<Props>) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.circulo}>
        <Ionicons name="checkmark" size={60} color={colors.verde} />
      </View>
      <Text style={styles.titulo}>¡Pedido realizado!</Text>
      <Text style={styles.mensaje}>
        Gracias por tu compra. Tu pedido quedó registrado como pendiente y puedes seguirlo
        desde tu cuenta.
      </Text>
      <View style={styles.boton}>
        <BotonDegradado texto="Ver mis pedidos" onPress={onVerPedidos} />
      </View>
      <Pressable onPress={onSeguirComprando} style={styles.enlace}>
        <Text style={styles.textoEnlace}>Seguir comprando</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.negro,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  circulo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.verde,
    backgroundColor: colors.gris,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  titulo: {
    color: colors.blanco,
    fontFamily: fonts.brand,
    fontSize: 18,
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
  boton: { alignSelf: 'center', maxWidth: 360, width: '100%' },
  enlace: { marginTop: 18, padding: 8 },
  textoEnlace: { color: '#9a9a9a', fontSize: 13 },
});