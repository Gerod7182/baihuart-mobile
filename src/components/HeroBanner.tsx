// Equivalente a .hero-home / .hero-galeria / .hero-ofertas en la web:
// imagen de fondo + degradado oscuro encima + título centrado.
// Reutilizable en Tienda, Galería y Ofertas, cada una con su propia
// imagen (mismas que usa la web).

import { ImageBackground, View, Text, StyleSheet } from 'react-native';
import { resolverImagenLocal } from '../services/imageMap';
import { colors } from '../theme/colors';

type Props = {
  nombreImagen: string; // ej. 'samuraiplex.png' — debe existir en imageMap
  titulo: string;
  subtitulo?: string;
  altura?: number;
};

export function HeroBanner({ nombreImagen, titulo, subtitulo, altura = 200 }: Props) {
  const fuente = resolverImagenLocal(nombreImagen);

  return (
    <ImageBackground
      source={fuente}
      style={[styles.contenedor, { height: altura }]}
      resizeMode="cover"
    >
      <View style={styles.superposicion}>
        <Text style={styles.titulo}>{titulo}</Text>
        {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  contenedor: { width: '100%', justifyContent: 'center', alignItems: 'center' },
  superposicion: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  titulo: {
    color: colors.blanco,
    fontSize: 26,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(255,50,35,0.6)',
    textShadowRadius: 14,
    textShadowOffset: { width: 0, height: 0 },
  },
  subtitulo: { color: '#eee', fontSize: 14, marginTop: 8, textAlign: 'center' },
});
