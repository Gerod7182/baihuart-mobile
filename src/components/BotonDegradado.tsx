import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, gradients } from '../theme/colors';

type Props = {
  texto: string;
  onPress: () => void;
  cargando?: boolean;
};

// Botón principal de la marca: mismo degradado rojo → naranja que
// .btn-tienda / .hero-btn en la web.
export function BotonDegradado({ texto, onPress, cargando = false }: Readonly<Props>) {
  return (
    <Pressable
      onPress={onPress}
      disabled={cargando}
      style={({ pressed }) => [styles.contenedor, pressed && styles.presionado]}
    >
      <LinearGradient
        colors={gradients.botonPrincipal}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.degradado}
      >
        {cargando ? (
          <ActivityIndicator color={colors.blanco} />
        ) : (
          <Text style={styles.texto}>{texto}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contenedor: { borderRadius: 12, overflow: 'hidden' },
  presionado: { opacity: 0.85 },
  degradado: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  texto: {
    color: colors.blanco,
    fontFamily: fonts.brand,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});