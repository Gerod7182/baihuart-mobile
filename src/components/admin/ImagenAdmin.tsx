import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { DimensionValue, Image, StyleSheet, Text, View } from 'react-native';
import { resolverImagenLocal } from '../../services/imageMap';

type Props = {
  ruta?: string;
  ancho?: DimensionValue;
  alto?: DimensionValue;
};

// Una URL https se muestra directa; un nombre de archivo se busca en imageMap.
export function obtenerFuenteAdmin(ruta?: string) {
  if (!ruta) return undefined;
  return ruta.startsWith('http') ? { uri: ruta } : resolverImagenLocal(ruta);
}

export function ImagenAdmin({ ruta, ancho = 72, alto = 72 }: Readonly<Props>) {
  const [fallo, setFallo] = useState(false);
  const fuente = obtenerFuenteAdmin(ruta);

  useEffect(() => {
    setFallo(false);
  }, [ruta]);

  if (!fuente || fallo) {
    return (
      <View style={[styles.vacio, { width: ancho, height: alto }]}>
        <Ionicons name="image-outline" size={22} color="#555555" />
        <Text style={styles.textoVacio}>Sin imagen</Text>
      </View>
    );
  }

  return (
    <Image
      source={fuente}
      style={[styles.imagen, { width: ancho, height: alto }]}
      resizeMode="cover"
      onError={() => setFallo(true)}
    />
  );
}

const styles = StyleSheet.create({
  imagen: { borderRadius: 10, backgroundColor: '#1a1a1a' },
  vacio: {
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  textoVacio: { color: '#555555', fontSize: 10 },
});