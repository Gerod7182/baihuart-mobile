
import { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { HeroBanner } from '../../components/HeroBanner';
import { Toast } from '../../components/Toast';
import { Product } from '../../models/types';
import { cartService } from '../../services/cartService';
import { resolverImagenLocal } from '../../services/imageMap';
import { useProductosPorCategoria } from '../../services/productService';
import { useTranslations } from '../../services/translations';
import { colors } from '../../theme/colors';

function obtenerFuenteImagen(img?: string) {
  if (!img) return undefined;
  return img.startsWith('http') ? { uri: img } : resolverImagenLocal(img);
}

function SeccionProductos({
  titulo,
  categoria,
  onAbrirProducto,
}: Readonly<{
  titulo: string;
  categoria: string;
  onAbrirProducto: (producto: Product) => void;
}>) {
  const { productos, cargando } = useProductosPorCategoria(categoria);

  if (cargando) {
    return <Text style={styles.textoSecundario}>Cargando {titulo.toLowerCase()}...</Text>;
  }

  return (
    <View style={styles.seccion}>
      <Text style={styles.tituloSeccion}>{titulo}</Text>
      <FlatList
        data={productos}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const fuente = obtenerFuenteImagen(item.img);
          return (
            <Pressable style={styles.tarjeta} onPress={() => onAbrirProducto(item)}>
              {fuente ? (
                <Image source={fuente} style={styles.imagen} resizeMode="cover" />
              ) : (
                <View style={[styles.imagen, styles.imagenFaltante]}>
                  <Text style={styles.textoImagenFaltante}>Sin imagen</Text>
                </View>
              )}
              {/* Botón de "agregado rápido": suma 1 unidad sin salir de la
                  lista, para cuando el usuario ya sabe lo que quiere y no
                  necesita ver el detalle. La tarjeta en sí solo abre la
                  vista rápida — ninguna de las dos acciones es ambigua. */}
              <Pressable
                style={styles.botonAgregadoRapido}
                onPress={(e) => {
                  e.stopPropagation();
                  onAbrirProducto(item); // abre igual la vista para confirmar cantidad
                }}
                hitSlop={8}
              >
                <Text style={styles.textoAgregadoRapido}>+</Text>
              </Pressable>
              <Text style={styles.nombreProducto} numberOfLines={1}>
                {item.nombre}
              </Text>
              <Text style={styles.precio}>${item.precio?.toLocaleString('es-CO')}</Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.textoSecundario}>Aún no hay productos aquí.</Text>
        }
      />
    </View>
  );
}

export default function HomeScreen() {
  const { textos } = useTranslations();
  const [productoSeleccionado, setProductoSeleccionado] = useState<Product | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [mensajeToast, setMensajeToast] = useState('');

  const abrirProducto = (producto: Product) => {
    setProductoSeleccionado(producto);
    setCantidad(1);
  };

  const cerrarProducto = () => setProductoSeleccionado(null);

  const mostrarToast = (mensaje: string) => {
    setMensajeToast(mensaje);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1800);
  };

    const confirmarAgregar = async () => {
    if (!productoSeleccionado) return;
    const { id, img, precio, nombre } = productoSeleccionado;
    try {
      await cartService.agregarItem(id, img, precio, nombre || '', cantidad);
      mostrarToast(`"${nombre}" agregado al carrito 🔥`);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      mostrarToast('No se pudo agregar el producto. Intenta de nuevo.');
    } finally {
      cerrarProducto();
    }
  };

  const fuenteModal = obtenerFuenteImagen(productoSeleccionado?.img);

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={[
          { key: 'camisetas', titulo: textos?.['sec-camisetas'] ?? 'Camisetas' },
          { key: 'stickers', titulo: textos?.['sec-stickers'] ?? 'Stickers' },
          { key: 'posters', titulo: textos?.['sec-posters'] ?? 'Posters' },
        ]}
        keyExtractor={(item) => item.key}
        ListHeaderComponent={
          <HeroBanner
            nombreImagen="samuraiplex.png"
            titulo="BAIHUART"
            subtitulo={textos?.['slogan'] ?? 'Arte original, llevado a tu ropa'}
            altura={240}
          />
        }
        renderItem={({ item }) => (
          <SeccionProductos
            titulo={item.titulo}
            categoria={item.key}
            onAbrirProducto={abrirProducto}
          />
        )}
      />

      <Modal
        visible={productoSeleccionado !== null}
        transparent
        animationType="slide"
        onRequestClose={cerrarProducto}
      >
        <Pressable style={styles.fondoModal} onPress={cerrarProducto}>
          <Pressable style={styles.hojaModal} onPress={(e) => e.stopPropagation()}>
            {fuenteModal ? (
              <Image source={fuenteModal} style={styles.imagenModal} resizeMode="cover" />
            ) : (
              <View style={[styles.imagenModal, styles.imagenFaltante]} />
            )}

            <Text style={styles.nombreModal}>{productoSeleccionado?.nombre}</Text>
            <Text style={styles.precioModal}>
              ${productoSeleccionado?.precio?.toLocaleString('es-CO')}
            </Text>

            <View style={styles.selectorCantidad}>
              <Pressable
                style={styles.botonCantidad}
                onPress={() => setCantidad((c) => Math.max(1, c - 1))}
              >
                <Text style={styles.textoBotonCantidad}>−</Text>
              </Pressable>
              <Text style={styles.valorCantidad}>{cantidad}</Text>
              <Pressable
                style={styles.botonCantidad}
                onPress={() => setCantidad((c) => c + 1)}
              >
                <Text style={styles.textoBotonCantidad}>+</Text>
              </Pressable>
            </View>

            <Pressable style={styles.botonAgregar} onPress={confirmarAgregar}>
              <Text style={styles.textoBotonAgregar}>
                Agregar al carrito · $
                {((productoSeleccionado?.precio ?? 0) * cantidad).toLocaleString('es-CO')}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Toast mensaje={mensajeToast} visible={toastVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colors.negro },
  seccion: { marginTop: 24, paddingHorizontal: 16 },
  tituloSeccion: {
    color: colors.blanco,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  tarjeta: {
    backgroundColor: colors.negro,
    borderWidth: 1,
    borderColor: 'rgba(255,50,35,0.2)',
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    width: 140,
  },
  imagen: { width: '100%', height: 140, borderRadius: 8 },
  imagenFaltante: {
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoImagenFaltante: { color: '#555', fontSize: 11 },
  botonAgregadoRapido: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.rojo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoAgregadoRapido: { color: colors.blanco, fontWeight: 'bold', fontSize: 16, lineHeight: 18 },
  nombreProducto: { color: colors.blanco, marginTop: 8, fontSize: 13 },
  precio: { color: colors.rojo, marginTop: 4, fontWeight: 'bold' },
  textoSecundario: { color: '#888', paddingHorizontal: 16 },

  fondoModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  hojaModal: {
    backgroundColor: colors.gris,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
  },
  imagenModal: { width: '100%', height: 220, borderRadius: 12 },
  nombreModal: { color: colors.blanco, fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  precioModal: { color: colors.rojo, fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  selectorCantidad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 20,
  },
  botonCantidad: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.rojo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotonCantidad: { color: colors.rojo, fontSize: 18, fontWeight: 'bold' },
  valorCantidad: { color: colors.blanco, fontSize: 16, fontWeight: 'bold', minWidth: 24, textAlign: 'center' },
  botonAgregar: {
    backgroundColor: colors.rojo,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  textoBotonAgregar: { color: colors.blanco, fontWeight: 'bold', fontSize: 15 },
});
