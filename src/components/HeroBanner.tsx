
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { resolverImagenLocal } from '../services/imageMap';
import { colors, fonts } from '../theme/colors';

type Props = {
  nombreImagen: string; // ej. 'samuraiplex.png' — debe existir en imageMap
  titulo: string;
  subtitulo?: string;
  altura?: number;
};

export function HeroBanner({ nombreImagen, titulo, subtitulo, altura = 200 }: Readonly<Props>) {
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
        position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  titulo: {
    color: colors.blanco,
    fontFamily: fonts.brand,
    fontSize: 22,
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(255,50,35,0.6)',
    textShadowRadius: 14,
    textShadowOffset: { width: 0, height: 0 },
  },
  subtitulo: {
    color: '#eee',
    fontFamily: fonts.brand,
    fontSize: 12,
    letterSpacing: 1,
    marginTop: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(255,50,35,0.4)',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
});