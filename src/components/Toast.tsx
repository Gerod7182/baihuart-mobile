

import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

export function Toast({ mensaje, visible }: { mensaje: string; visible: boolean }) {
  const opacidad = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacidad, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible, opacidad]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.contenedor, { opacity: opacidad }]}
    >
      <Text style={styles.texto}>{mensaje}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: colors.rojo,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  texto: { color: colors.blanco, fontWeight: 'bold', fontSize: 13 },
});
