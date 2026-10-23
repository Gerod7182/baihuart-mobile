import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, gradients } from '../../theme/colors';

type Props = {
  nombre: string;
  correo: string;
  miembroDesde?: string;
  esAdmin: boolean;
};

export function EncabezadoPerfil({ nombre, correo, miembroDesde, esAdmin }: Readonly<Props>) {
  const inicial = nombre.trim().charAt(0).toUpperCase() || '?';

  return (
    <View style={styles.contenedor}>
      <LinearGradient
        colors={gradients.botonPrincipal}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.avatar}
      >
        <Text style={styles.inicial}>{inicial}</Text>
      </LinearGradient>

      <View style={styles.datos}>
        <Text style={styles.saludo}>Hola,</Text>
        <Text style={styles.nombre} numberOfLines={1}>
          {nombre}
        </Text>
        <Text style={styles.correo} numberOfLines={1}>
          {correo}
        </Text>
        <View style={styles.fila}>
          {esAdmin && (
            <View style={styles.badge}>
              <Text style={styles.textoBadge}>Administrador</Text>
            </View>
          )}
          {miembroDesde ? <Text style={styles.miembro}>Miembro desde {miembroDesde}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.gris,
    borderWidth: 1,
    borderColor: '#2a0a0a',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inicial: { color: colors.blanco, fontFamily: fonts.brand, fontSize: 28 },
  datos: { flex: 1, gap: 2 },
  saludo: { color: '#888888', fontSize: 12 },
  nombre: {
    color: colors.blanco,
    fontFamily: fonts.brand,
    fontSize: 17,
    letterSpacing: 0.5,
  },
  correo: { color: '#999999', fontSize: 12 },
  fila: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  badge: {
    borderWidth: 1,
    borderColor: colors.rojo,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  textoBadge: { color: colors.rojo, fontSize: 10, fontWeight: 'bold' },
  miembro: { color: '#666666', fontSize: 11 },
});