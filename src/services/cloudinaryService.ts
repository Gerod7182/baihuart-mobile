import type { ImagePickerAsset } from 'expo-image-picker';
import { Platform } from 'react-native';


const CLOUD_NAME = 'vprc5qut';
const UPLOAD_PRESET = 'baihuart_app';

// formato y calidad automáticos, máximo 1200 px de ancho.
const TRANSFORMACION = 'f_auto,q_auto,c_limit,w_1200';

type RespuestaCloudinary = {
  secure_url?: string;
  error?: { message: string };
};

export async function subirImagen(asset: ImagePickerAsset): Promise<string> {
  const formulario = new FormData();

  if (Platform.OS === 'web' && asset.file) {
    formulario.append('file', asset.file);
  } else {
    formulario.append('file', {
      uri: asset.uri,
      name: asset.fileName ?? 'diseno.jpg',
      type: asset.mimeType ?? 'image/jpeg',
    } as unknown as Blob);
  }
  formulario.append('upload_preset', UPLOAD_PRESET);

  const respuesta = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formulario }
  );
  const datos = (await respuesta.json()) as RespuestaCloudinary;

  if (!respuesta.ok || !datos.secure_url) {
    throw new Error(datos.error?.message ?? 'No se pudo subir la imagen');
  }
  return datos.secure_url.replace('/upload/', `/upload/${TRANSFORMACION}/`);
}