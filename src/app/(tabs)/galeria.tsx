// Equivalente a src/app/pages/galeria/galeria.component.ts + .html en baihuart-app.
// El modal de imagen ampliada ahora usa react-native-image-viewing, que
// replica el visor de Instagram/Google Photos: pinch-to-zoom, doble tap
// para zoom, y deslizar hacia abajo para cerrar.
// Instalar: npx expo install react-native-image-viewing

import { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import { useGaleria } from '../../services/galeriaService';
import { resolverImagenLocal } from '../../services/imageMap';
import { useTranslations } from '../../services/translations';
import { colors } from '../../theme/colors';
import { HeroBanner } from '../../components/HeroBanner';

const FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'espiritual', label: 'Espiritual' },
  { key: 'anime', label: 'Anime' },
  { key: 'pop', label: 'Pop' },
] as const;

export default function GaleriaScreen() {
  const { items, cargando } = useGaleria();
  const { textos } = useTranslations();
  const [filtroActivo, setFiltroActivo] = useState<string>('todos');
  const [indiceAbierto, setIndiceAbierto] = useState<number | null>(null);

  const itemsFiltrados = items.filter(
    (item) => filtroActivo === 'todos' || filtroActivo === item.categoria
  );

  const obtenerFuenteImagen = (rutaImg?: string) => {
    if (!rutaImg) return undefined;
    return rutaImg.startsWith('http')
      ? { uri: rutaImg }
      : resolverImagenLocal(rutaImg);
  };

  // react-native-image-viewing necesita un arreglo de { uri } — para las
  // imágenes locales (require()) resolvemos el número de asset con
  // Image.resolveAssetSource() para sacarle la uri real.
  const imagenesParaVisor = useMemo(
    () =>
      itemsFiltrados.map((item) => {
        const fuente = obtenerFuenteImagen(item.img);
        if (!fuente) return { uri: '' };
        if (typeof fuente === 'number') return Image.resolveAssetSource(fuente);
        if ('uri' in fuente) return fuente;
        return Image.resolveAssetSource(fuente);
      }),
    [itemsFiltrados]
  );

  return (
    <View style={styles.contenedor}>
      <HeroBanner
        nombreImagen="samurai.png"
        titulo={textos?.['galeria-titulo'] ?? 'Galería de Diseños'}
        altura={180}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtros}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 32, gap: 10 }}
      >
        {FILTROS.map((filtro) => (
          <Pressable
            key={filtro.key}
            onPress={() => setFiltroActivo(filtro.key)}
            style={[
              styles.botonFiltro,
              filtroActivo === filtro.key && styles.botonFiltroActivo,
            ]}
          >
            <Text
              style={[
                styles.textoFiltro,
                filtroActivo === filtro.key && styles.textoFiltroActivo,
              ]}
            >
              {textos?.[`filtro-${filtro.key}`] ?? filtro.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {cargando ? (
        <Text style={styles.textoSecundario}>Cargando galería...</Text>
      ) : (
        <FlatList
          data={itemsFiltrados}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 12 }}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item, index }) => {
            const fuente = obtenerFuenteImagen(item.img);
            return (
              <Pressable
                style={styles.itemGrid}
                onPress={() => setIndiceAbierto(index)}
              >
                {fuente ? (
                  <Image source={fuente} style={styles.imagenGrid} resizeMode="cover" />
                ) : (
                  <View style={[styles.imagenGrid, styles.imagenFaltante]}>
                    <Text style={styles.textoImagenFaltante}>Sin imagen</Text>
                  </View>
                )}
                <Text style={styles.tituloItem} numberOfLines={1}>
                  {item.titulo ?? ''}
                </Text>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.textoSecundario}>
              No hay imágenes en esta categoría todavía.
            </Text>
          }
        />
      )}

      <ImageView
        images={imagenesParaVisor}
        imageIndex={indiceAbierto ?? 0}
        visible={indiceAbierto !== null}
        onRequestClose={() => setIndiceAbierto(null)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
        FooterComponent={({ imageIndex }) => {
          const item = itemsFiltrados[imageIndex];
          if (!item) return null;
          return (
            <View style={styles.piePagina}>
              <Text style={styles.tituloModal}>{item.titulo}</Text>
              <Text style={styles.descModal}>{item.descripcion}</Text>
            </View>
          );
        }}
      />
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
  filtros: { marginTop: 18, marginBottom: 12, flexGrow: 0 },
  botonFiltro: {
    borderWidth: 1.5,
    borderColor: colors.rojo,
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minHeight: 38,
    justifyContent: 'center',
  },
  botonFiltroActivo: { backgroundColor: colors.rojo },
  textoFiltro: { color: colors.rojo, fontSize: 14, fontWeight: '600' },
  textoFiltroActivo: { color: colors.blanco, fontWeight: 'bold' },
  itemGrid: { flex: 1, marginBottom: 12 },
  imagenGrid: { width: '100%', height: 160, borderRadius: 8 },
  imagenFaltante: {
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoImagenFaltante: { color: '#555', fontSize: 11 },
  tituloItem: { color: colors.blanco, fontSize: 12, marginTop: 4 },
  textoSecundario: { color: '#888', padding: 16 },
  piePagina: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  tituloModal: { color: colors.blanco, fontSize: 16, fontWeight: 'bold' },
  descModal: { color: '#ccc', marginTop: 4, fontSize: 13 },
});
