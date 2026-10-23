import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { subirImagen } from '../../services/cloudinaryService';
import { colors } from '../../theme/colors';
import { CampoAdmin } from './CampoAdmin';
import { ImagenAdmin } from './ImagenAdmin';

type Props = {
  valor: string;
  onCambiar: (nuevo: string) => void;
};

export function SelectorImagen({ valor, onCambiar }: Readonly<Props>) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState('');

  const elegirYSubir = async () => {
    setError('');
    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.9,
      });
      if (resultado.canceled) return;

      setSubiendo(true);
      const url = await subirImagen(resultado.assets[0]);
      onCambiar(url);
    } catch (e) {
      console.error('Error subiendo imagen:', e);
      setError('No se pudo subir la imagen. Revisa tu conexión e intenta de nuevo.');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>Imagen</Text>
      <ImagenAdmin ruta={valor} ancho="100%" alto={220} />

      <Pressable
        onPress={() => void elegirYSubir()}
        disabled={subiendo}
        style={[styles.boton, subiendo && styles.botonDeshabilitado]}
      >
        {subiendo ? (
          <ActivityIndicator color={colors.blanco} />
        ) : (
          <Ionicons name="cloud-upload-outline" size={20} color={colors.blanco} />
        )}
        <Text style={styles.textoBoton}>
          {subiendo ? 'Subiendo...' : 'Elegir foto'}
        </Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <CampoAdmin
        etiqueta="O pega una URL / nombre de archivo"
        ayuda="Se rellena sola al subir una foto."
        value={valor}
        onChangeText={onCambiar}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { marginBottom: 6 },
  etiqueta: {
    color: '#aaaaaa',
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1c1c1c',
    borderWidth: 1,
    borderColor: colors.rojo,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 10,
    marginBottom: 12,
  },
  botonDeshabilitado: { opacity: 0.6 },
  textoBoton: { color: colors.blanco, fontWeight: 'bold', fontSize: 13 },
  error: { color: colors.rojo, fontSize: 12, marginBottom: 10 },
});