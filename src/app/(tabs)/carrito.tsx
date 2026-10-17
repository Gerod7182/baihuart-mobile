
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { BarraTotal } from '../../components/carrito/BarraTotal';
import { CarritoVacio } from '../../components/carrito/CarritoVacio';
import { ItemCarrito } from '../../components/carrito/ItemCarrito';
import { PedidoExitoso } from '../../components/carrito/PedidoExitoso';
import { ItemPedido, Pedido, Product } from '../../models/types';
import { useUsuarioActual } from '../../services/authService';
import { cartService } from '../../services/cartService';
import { pedidoService } from '../../services/pedidoService';
import { colors, fonts } from '../../theme/colors';

export default function CarritoScreen() {
  const [carrito, setCarrito] = useState<Product[]>([]);
  const [procesando, setProcesando] = useState(false);
  const [pedidoRealizado, setPedidoRealizado] = useState(false);
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
      // Al salir de la pestaña se descarta la pantalla de "pedido realizado".
      return () => setPedidoRealizado(false);
    }, [cargarCarrito])
  );

  const unidades = carrito.reduce((acc, item) => acc + (item.cantidad ?? 0), 0);
  const total = carrito.reduce(
    (acc, item) => acc + item.precio * (item.cantidad ?? 0),
    0
  );

  const eliminarItem = async (id: string) => {
    try {
      await cartService.eliminarItem(id);
      await cargarCarrito();
    } catch (error) {
      console.error('No se pudo eliminar el producto del carrito:', error);
      setMensajeError('No se pudo eliminar el producto. Intenta de nuevo.');
    }
  };

  const cambiarCantidad = async (id: string, cantidadActual: number, delta: number) => {
    try {
      await cartService.actualizarCantidad(id, cantidadActual + delta);
      await cargarCarrito();
    } catch (error) {
      console.error('No se pudo actualizar la cantidad:', error);
      setMensajeError('No se pudo actualizar la cantidad. Intenta de nuevo.');
    }
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
      setPedidoRealizado(true);
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
      setMensajeError('No se pudo procesar tu compra. Intenta de nuevo.');
    } finally {
      setProcesando(false);
    }
  };

  if (pedidoRealizado) {
    return (
      <PedidoExitoso
        onVerPedidos={() => router.push('/(tabs)/cuenta')}
        onSeguirComprando={() => router.push('/(tabs)')}
      />
    );
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <View>
          <Text style={styles.titulo}>Mi carrito</Text>
          <View style={styles.subrayado} />
        </View>
        {unidades > 0 && (
          <View style={styles.chip}>
            <Text style={styles.textoChip}>
              {unidades} {unidades === 1 ? 'artículo' : 'artículos'}
            </Text>
          </View>
        )}
      </View>

      {carrito.length === 0 ? (
        <CarritoVacio onExplorar={() => router.push('/(tabs)')} />
      ) : (
        <>
          <FlatList
            data={carrito}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <ItemCarrito
                item={item}
                onCambiarCantidad={(delta) =>
                  void cambiarCantidad(item.id, item.cantidad ?? 0, delta)
                }
                onEliminar={() => void eliminarItem(item.id)}
              />
            )}
          />
          <BarraTotal
            total={total}
            unidades={unidades}
            textoBoton={usuario ? 'Finalizar compra' : 'Inicia sesión para comprar'}
            procesando={procesando}
            error={mensajeError}
            onComprar={() => void finalizarCompra()}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colors.negro },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  titulo: {
    color: colors.blanco,
    fontFamily: fonts.brand,
    fontSize: 22,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  subrayado: { width: 60, height: 3, backgroundColor: colors.rojo, marginTop: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.rojo,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  textoChip: { color: colors.rojo, fontSize: 12, fontWeight: 'bold' },
});
