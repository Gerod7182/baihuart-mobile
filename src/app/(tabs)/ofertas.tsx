
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { HeroBanner } from '../../components/HeroBanner';
import { Oferta } from '../../models/types';
import { cartService } from '../../services/cartService';
import { db } from '../../services/firebase';
import { resolverImagenLocal } from '../../services/imageMap';
import { colors } from '../../theme/colors';

type OfertaConId = Oferta & { id: string };

function useOfertas() {
  const [ofertas, setOfertas] = useState<OfertaConId[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const ofertasRef = collection(db, 'ofertas');
    const unsubscribe = onSnapshot(ofertasRef, (snapshot) => {
      const datos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as OfertaConId[];
      setOfertas(datos);
      setCargando(false);
    });
    return () => unsubscribe();
  }, []);

  return { ofertas, cargando };
}

export default function OfertasScreen() {
  const { ofertas, cargando } = useOfertas();

  const agregarAlCarrito = (oferta: OfertaConId) => {
    cartService.agregarItem(oferta.id, oferta.img, oferta.precioAhora, oferta.nombre);
  };

  return (
    <View style={styles.contenedor}>
      <HeroBanner nombreImagen="sabiosamu.png" titulo="Ofertas Especiales" altura={180} />

      {cargando ? (
        <Text style={styles.textoSecundario}>Cargando ofertas...</Text>
      ) : (
        <FlatList
          data={ofertas}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 12 }}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item }) => {
            const fuente = item.img?.startsWith('http')
              ? { uri: item.img }
              : resolverImagenLocal(item.img);
            const descuento = Math.round(
              (1 - item.precioAhora / item.precioAntes) * 100
            );

            return (
              <Pressable style={styles.tarjeta} onPress={() => agregarAlCarrito(item)}>
                {fuente ? (
                  <Image source={fuente} style={styles.imagen} />
                ) : (
                  <View style={[styles.imagen, styles.imagenFaltante]}>
                    <Text style={styles.textoImagenFaltante}>Sin imagen</Text>
                  </View>
                )}
                {descuento > 0 && (
                  <View style={styles.badgeDescuento}>
                    <Text style={styles.textoBadge}>-{descuento}%</Text>
                  </View>
                )}
                <Text style={styles.nombreProducto} numberOfLines={1}>
                  {item.nombre}
                </Text>
                <View style={styles.filaPrecios}>
                  <Text style={styles.precioAntes}>
                    ${item.precioAntes?.toLocaleString('es-CO')}
                  </Text>
                  <Text style={styles.precioAhora}>
                    ${item.precioAhora?.toLocaleString('es-CO')}
                  </Text>
                </View>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.textoSecundario}>No hay ofertas activas por ahora.</Text>
          }
        />
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
  tarjeta: {
    flex: 1,
    backgroundColor: colors.negro,
    borderWidth: 1,
    borderColor: 'rgba(255,50,35,0.2)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  imagen: { width: '100%', height: 140, borderRadius: 8 },
  imagenFaltante: {
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoImagenFaltante: { color: '#555', fontSize: 11 },
  badgeDescuento: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.rojo,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  textoBadge: { color: colors.blanco, fontSize: 11, fontWeight: 'bold' },
  nombreProducto: { color: colors.blanco, marginTop: 8, fontSize: 13 },
  filaPrecios: { flexDirection: 'row', gap: 8, marginTop: 4, alignItems: 'center' },
  precioAntes: { color: '#777', fontSize: 12, textDecorationLine: 'line-through' },
  precioAhora: { color: colors.rojo, fontWeight: 'bold' },
  textoSecundario: { color: '#888', padding: 16 },
});
