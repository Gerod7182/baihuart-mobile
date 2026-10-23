import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Pedido } from '../../models/types';
import { colors, fonts } from '../../theme/colors';

export type FiltroPedido = 'todos' | Pedido['estado'];
type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Props = {
  filtro: FiltroPedido;
  conteos: Record<FiltroPedido, number>;
  onCambiar: (nuevo: FiltroPedido) => void;
};

const OPCIONES: { clave: FiltroPedido; etiqueta: string; icono: IconName; color: string }[] = [
  { clave: 'todos', etiqueta: 'Todos', icono: 'receipt-outline', color: colors.blanco },
  { clave: 'pendiente', etiqueta: 'Pendientes', icono: 'time-outline', color: colors.amarillo },
  { clave: 'entregado', etiqueta: 'Entregados', icono: 'checkmark-circle-outline', color: colors.verde },
  { clave: 'cancelado', etiqueta: 'Cancelados', icono: 'close-circle-outline', color: '#888888' },
];

export function FiltroPedidos({ filtro, conteos, onCambiar }: Readonly<Props>) {
  return (
    <View style={styles.fila}>
      {OPCIONES.map((op) => {
        const activo = op.clave === filtro;
        return (
          <Pressable
            key={op.clave}
            onPress={() => onCambiar(op.clave)}
            style={[styles.tarjeta, activo && { borderColor: op.color, backgroundColor: '#161616' }]}
          >
            <Ionicons name={op.icono} size={22} color={op.color} />
            <Text style={styles.conteo}>{conteos[op.clave]}</Text>
            <Text style={[styles.etiqueta, activo && styles.etiquetaActiva]} numberOfLines={1}>
              {op.etiqueta}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tarjeta: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.gris,
    borderWidth: 1,
    borderColor: '#2a0a0a',
    borderRadius: 14,
    paddingVertical: 12,
  },
  conteo: { color: colors.blanco, fontFamily: fonts.brand, fontSize: 18 },
  etiqueta: { color: '#888888', fontSize: 10 },
  etiquetaActiva: { color: colors.blanco, fontWeight: 'bold' },
});