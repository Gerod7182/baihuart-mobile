
import { ImageSourcePropType } from 'react-native';

export const imageMap: Record<string, ImageSourcePropType> = {
  '1.jpg': require('../../assets/img/1.jpg'),
  '2.jpg': require('../../assets/img/2.jpg'),
  '3.jpg': require('../../assets/img/3.jpg'),
  '4.jpg': require('../../assets/img/4.jpg'),
  '5.png': require('../../assets/img/5.png'),
  '6.jpg': require('../../assets/img/6.jpg'),
  'BAIHU.png': require('../../assets/img/BAIHU.png'),
  'Fenixcamisa.png': require('../../assets/img/Fenixcamisa.png'),
  'HEBI.png': require('../../assets/img/HEBI.png'),
  'Myers.png': require('../../assets/img/Myers.png'),
  'Samurai1_Mesa de trabajo 1.png': require('../../assets/img/Samurai1_Mesa_de_trabajo_1.png'),
  'VI.png': require('../../assets/img/VI.png'),
  'VI_Mesa de trabajo 1.png': require('../../assets/img/VI_Mesa_de_trabajo_1.png'),
  'armor.png': require('../../assets/img/armor.png'),
  'baihulogo.png': require('../../assets/img/baihulogo.png'),
  'burstinatrix sticker.png': require('../../assets/img/burstinatrix_sticker.png'),
  'burstinatrix.png': require('../../assets/img/burstinatrix.png'),
  'cheetara.png': require('../../assets/img/cheetara.png'),
  'ciudad.png': require('../../assets/img/ciudad.png'),
  'ciudad_Mesa de trabajo 1.png': require('../../assets/img/ciudad_Mesa_de_trabajo_1.png'),
  'cofre.png': require('../../assets/img/cofre.png'),
  'dragon sticker-01.png': require('../../assets/img/dragon_sticker-01.png'),
  'dragonsword.png': require('../../assets/img/dragonsword.png'),
  'fenghua.png': require('../../assets/img/fenghua.png'),
  'helmet.png': require('../../assets/img/helmet.png'),
  'jason.png': require('../../assets/img/jason.png'),
  'nami1.png': require('../../assets/img/nami1.png'),
  'qr-baihu.png': require('../../assets/img/qr-baihu.png'),
  'sabiocrown.png': require('../../assets/img/sabiocrown.png'),
  'sabiosamu.png': require('../../assets/img/sabiosamu.png'),
  'samurai.png': require('../../assets/img/samurai.png'),
  'samuraiplex.png': require('../../assets/img/samuraiplex.png'),
  'samurairoot.png': require('../../assets/img/samurairoot.png'),
  'sanji.png': require('../../assets/img/sanji.png'),
  'sanji1.png': require('../../assets/img/sanji1.png'),
  'serpientef.png': require('../../assets/img/serpientef.png'),
  'sticker cobra.png': require('../../assets/img/sticker_cobra.png'),
  'sticker tigre.png': require('../../assets/img/sticker_tigre.png'),
  'stickerfenix.png': require('../../assets/img/stickerfenix.png'),
  'vader.png': require('../../assets/img/vader.png'),
  'zoro.png': require('../../assets/img/zoro.png'),
  'zoro1.png': require('../../assets/img/zoro1.png'),
};

/**
 * Recibe el valor tal cual viene de Firestore (ej. "assets/img/zoro1.png")
 * y devuelve la imagen local correspondiente, o undefined si no la
 * encuentra en el mapa (por ejemplo, si algún producto nuevo usa una
 * URL real de internet en vez de una ruta local — en ese caso, usa
 * esa URL directo con { uri: ... } en vez de este mapa).
 */
export function resolverImagenLocal(rutaFirestore?: string): ImageSourcePropType | undefined {
  if (!rutaFirestore) return undefined;
  const nombreArchivo = rutaFirestore.split('/').pop();
  return nombreArchivo ? imageMap[nombreArchivo] : undefined;
}

