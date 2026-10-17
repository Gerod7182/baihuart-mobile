import type { ComponentType } from 'react';
import { Image, Modal, Pressable, StyleSheet } from 'react-native';

type Props = {
  images: { uri: string }[];
  imageIndex: number;
  visible: boolean;
  onRequestClose: () => void;
  FooterComponent?: ComponentType<{ imageIndex: number }>;
};

export function VisorImagenes({
  images,
  imageIndex,
  visible,
  onRequestClose,
  FooterComponent,
}: Readonly<Props>) {
  const imagen = images[imageIndex];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <Pressable style={styles.fondo} onPress={onRequestClose}>
        {imagen ? (
          <Image source={{ uri: imagen.uri }} style={styles.imagen} resizeMode="contain" />
        ) : null}
        {FooterComponent ? <FooterComponent imageIndex={imageIndex} /> : null}
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagen: { width: '90%', height: '70%' },
});