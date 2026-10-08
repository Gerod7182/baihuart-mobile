
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ItemPedido, Pedido, Product } from '../../models/types';
import { useUsuarioActual } from '../../services/authService';
import { cartService } from '../../services/cartService';
import { resolverImagenLocal } from '../../services/imageMap';
import { pedidoService } from '../../services/pedidoService';
import { colors } from '../../theme/colors';

export default function CarritoScreen() {
  const [carrito, setCarrito] = useState<Product[]>([]);
  const [procesando, setProcesando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const { usuario } = useUsuarioActual();
  const router = useRouter();

    const cargarCarrito = useCallback(async () => {
    try {
      const items = await cartService.obtenerItems();
      setCarrito(items);
    } catch (error) {
      console.error('No se pudo cargar el carrito:', error);
    }
  }, []);
   useFocusEffect(
    useCallback(() => {
      void cargarCarrito();
    }, [cargarCarrito])
  );

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * (item.cantidad ?? 0),
    0
  );

    const eliminarItem = async (id: string) => {
    await cartService.eliminarItem(id);
    await cargarCarrito();
  };

  const cambiarCantidad = async (id: string, cantidadActual: number, delta: number) => {
    await cartService.actualizarCantidad(id, cantidadActual + delta);
    await cargarCarrito();
  };

  const finalizarCompra = async () => {
    if (carrito.length === 0) return;

    if (!usuario) {
      setMensajeError('Debes iniciar sesión para finalizar tu compra.');
      router.push('/(tabs)/cuenta');
      return;
    }

    setProcesando(true);
    setMensajeError('');

    const items: ItemPedido[] = carrito.map((item) => ({
      productoId: item.id,
      nombre: item.nombre ?? '',
      img: item.img,
      precio: item.precio,
      cantidad: item.cantidad ?? 0,
    }));

    const pedido: Pedido = {
      usuarioId: usuario.uid,
      usuarioEmail: usuario.email ?? '',
      fecha: new Date().toISOString(),
      estado: 'pendiente',
      total,
      items,
    };

       try {
      await pedidoService.crearPedido(pedido);
      await cartService.vaciarCarrito();
      setCarrito([]);
      Alert.alert(
        '¡Gracias por tu compra!',
        'Tu pedido fue registrado correctamente.',
        [{ text: 'Volver al inicio', onPress: () => router.replace('/(tabs)') }]
      );
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
      setMensajeError('No se pudo procesar tu compra. Intenta de nuevo.');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Carrito</Text>

      <FlatList
        data={carrito}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const fuente = item.img?.startsWith('http')
            ? { uri: item.img }
            : resolverImagenLocal(item.img);
          return (
            <View style={styles.fila}>
              {fuente ? (
                <Image source={fuente} style={styles.imagenFila} />
              ) : (
                <View style={[styles.imagenFila, styles.imagenFaltante]} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.nombreFila} numberOfLines={1}>
                  {item.nombre}
                </Text>
                <Text style={styles.detalleFila}>
                  ${item.precio?.toLocaleString('es-CO')} c/u
                </Text>

                <View style={styles.selectorCantidadFila}>
                  <Pressable
                    style={styles.botonCantidadFila}
                    onPress={() => cambiarCantidad(item.id, item.cantidad ?? 0, -1)}
                  >
                    <Text style={styles.textoBotonCantidadFila}>−</Text>
                  </Pressable>
                  <Text style={styles.valorCantidadFila}>{item.cantidad}</Text>
                  <Pressable
                    style={styles.botonCantidadFila}
                    onPress={() => cambiarCantidad(item.id, item.cantidad ?? 0, 1)}
                  >
                    <Text style={styles.textoBotonCantidadFila}>+</Text>
                  </Pressable>
                </View>
              </View>

              <View style={{ alignItems: 'flex-end', gap: 10 }}>
                <Text style={styles.subtotalFila}>
                  ${((item.cantidad ?? 0) * item.precio).toLocaleString('es-CO')}
                </Text>
                <Pressable onPress={() => eliminarItem(item.id)}>
                  <Text style={styles.eliminar}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.textoSecundario}>Tu carrito está vacío.</Text>
        }
      />

      {carrito.length > 0 && (
        <View style={styles.piePagina}>
          <View style={styles.filaTotal}>
            <Text style={styles.textoTotal}>Total</Text>
            <Text style={styles.valorTotal}>${total.toLocaleString('es-CO')}</Text>
          </View>

          {mensajeError ? (
            <Text style={styles.textoError}>{mensajeError}</Text>
          ) : null}

          <Pressable
            style={styles.botonComprar}
            onPress={finalizarCompra}
            disabled={procesando}
          >
            {procesando ? (
              <ActivityIndicator color={colors.blanco} />
            ) : (
              <Text style={styles.textoBotonComprar}>Finalizar compra</Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colors.negro },
  titulo: {
    color: colors.blanco,
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    paddingBottom: 14,
  },
  imagenFila: { width: 56, height: 56, borderRadius: 8 },
  imagenFaltante: { backgroundColor: '#1a1a1a' },
  nombreFila: { color: colors.blanco, fontSize: 14 },
  detalleFila: { color: '#888', fontSize: 12, marginTop: 2 },
  selectorCantidadFila: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  botonCantidadFila: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.rojo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotonCantidadFila: { color: colors.rojo, fontSize: 14, fontWeight: 'bold' },
  valorCantidadFila: { color: colors.blanco, fontSize: 13, fontWeight: 'bold', minWidth: 18, textAlign: 'center' },
  subtotalFila: { color: colors.blanco, fontSize: 13, fontWeight: 'bold' },
  eliminar: { color: colors.rojo, fontSize: 12 },
  textoSecundario: { color: '#888', padding: 16 },
  piePagina: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    backgroundColor: colors.negro,
  },
  filaTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  textoTotal: { color: colors.blanco, fontSize: 16 },
  valorTotal: { color: colors.rojo, fontSize: 18, fontWeight: 'bold' },
  textoError: { color: colors.rojo, fontSize: 12, marginBottom: 8 },
  botonComprar: {
    backgroundColor: colors.rojo,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  textoBotonComprar: { color: colors.blanco, fontWeight: 'bold', fontSize: 15 },
});
