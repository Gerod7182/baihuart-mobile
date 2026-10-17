import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../../models/types';
import { resolverImagenLocal } from '../../services/imageMap';
import { colors, fonts } from '../../theme/colors';

type Props = {
  item: Product;
  onCambiarCantidad: (delta: number) => void;
  onEliminar: () => void;
};

export function ItemCarrito({ item, onCambiarCantidad, onEliminar }: Readonly<Props>) {
  const cantidad = item.cantidad ?? 0;
  const fuente = item.img?.startsWith('http')
    ? { uri: item.img }
    : resolverImagenLocal(item.img);

  return (
    <View style={styles.tarjeta}>
      {fuente ? (
        <Image source={fuente} style={styles.imagen} />
      ) : (
        <View style={[styles.imagen, styles.imagenFaltante]} />
      )}

      <View style={styles.centro}>
        <Text style={styles.nombre} numberOfLines={2}>
          {item.nombre}
        </Text>
        <Text style={styles.precioUnitario}>
          ${item.precio.toLocaleString('es-CO')} c/u
        </Text>

        <View style={styles.selector}>
          <Pressable
            accessibilityLabel="Quitar una unidad"
            style={styles.botonCantidad}
            onPress={() => onCambiarCantidad(-1)}
          >
            <Ionicons name="remove" size={16} color={colors.rojo} />
          </Pressable>
          <Text style={styles.cantidad}>{cantidad}</Text>
          <Pressable
            accessibilityLabel="Agregar una unidad"
            style={styles.botonCantidad}
            onPress={() => onCambiarCantidad(1)}
          >
            <Ionicons name="add" size={16} color={colors.rojo} />
          </Pressable>
        </View>
      </View>

      <View style={styles.derecha}>
        <Pressable accessibilityLabel="Eliminar del carrito" onPress={onEliminar} hitSlop={10}>
          <Ionicons name="trash-outline" size={20} color="#8a8a8a" />
        </Pressable>
        <Text style={styles.subtotal}>${(cantidad * item.precio).toLocaleString('es-CO')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.gris,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a0a0a',
    padding: 12,
    marginBottom: 12,
  },
  imagen: { width: 88, height: 88, borderRadius: 10, backgroundColor: '#ffffff' },
  imagenFaltante: { backgroundColor: '#222222' },
  centro: { flex: 1, justifyContent: 'space-between' },
  nombre: { color: colors.blanco, fontSize: 14, lineHeight: 19 },
  precioUnitario: { color: '#8a8a8a', fontSize: 12, marginTop: 2 },
  selector: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  botonCantidad: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.rojo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cantidad: {
    color: colors.blanco,
    fontSize: 15,
    fontWeight: 'bold',
    minWidth: 22,
    textAlign: 'center',
  },
  derecha: { justifyContent: 'space-between', alignItems: 'flex-end' },
  subtotal: { color: colors.rojo, fontFamily: fonts.brand, fontSize: 14 },
});