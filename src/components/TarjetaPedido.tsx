import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ItemPedido, Pedido } from '../models/types';
import { resolverImagenLocal } from '../services/imageMap';
import { colors, fonts } from '../theme/colors';

type Props = {
  pedido: Pedido & { id: string };
  onCancelar: () => void;
  onEliminar: () => void;
};

const COLORES_ESTADO: Record<Pedido['estado'], string> = {
  pendiente: colors.amarillo,
  entregado: colors.verde,
  cancelado: '#888888',
};

const ETIQUETAS_ESTADO: Record<Pedido['estado'], string> = {
  pendiente: 'Pendiente',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const MAX_MINIATURAS = 4;

function fuenteImagen(img?: string) {
  if (!img) return undefined;
  return img.startsWith('http') ? { uri: img } : resolverImagenLocal(img);
}

function Miniatura({ item }: Readonly<{ item: ItemPedido }>) {
  const fuente = fuenteImagen(item.img);
  return (
    <View style={styles.miniaturaCaja}>
      {fuente ? (
        <Image source={fuente} style={styles.miniatura} />
      ) : (
        <View style={[styles.miniatura, styles.miniaturaVacia]} />
      )}
      {item.cantidad > 1 && (
        <View style={styles.cantidadBadge}>
          <Text style={styles.cantidadTexto}>×{item.cantidad}</Text>
        </View>
      )}
    </View>
  );
}

export function TarjetaPedido({ pedido, onCancelar, onEliminar }: Readonly<Props>) {
  const color = COLORES_ESTADO[pedido.estado];
  const unidades = pedido.items.reduce((acc, item) => acc + item.cantidad, 0);
  const restantes = pedido.items.length - MAX_MINIATURAS;
  const fecha = new Date(pedido.fecha).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.tarjeta}>
      <View style={styles.encabezado}>
        <View>
          <Text style={styles.numero}>Pedido #{pedido.id.slice(-6).toUpperCase()}</Text>
          <Text style={styles.fecha}>{fecha}</Text>
        </View>
        <View style={[styles.estado, { borderColor: color }]}>
          <Text style={[styles.estadoTexto, { color }]}>{ETIQUETAS_ESTADO[pedido.estado]}</Text>
        </View>
      </View>

      <View style={styles.miniaturas}>
        {pedido.items.slice(0, MAX_MINIATURAS).map((item) => (
          <Miniatura key={item.productoId} item={item} />
        ))}
        {restantes > 0 && <Text style={styles.mas}>+{restantes}</Text>}
      </View>

      <Text style={styles.detalle} numberOfLines={2}>
        {pedido.items.map((item) => `${item.cantidad} × ${item.nombre}`).join(' · ')}
      </Text>

      <View style={styles.pie}>
        <View>
          <Text style={styles.unidades}>
            {unidades} {unidades === 1 ? 'artículo' : 'artículos'}
          </Text>
          <Text style={styles.total}>${pedido.total.toLocaleString('es-CO')}</Text>
        </View>
        {pedido.estado === 'pendiente' && (
          <Pressable style={styles.boton} onPress={onCancelar}>
            <Text style={styles.textoBoton}>Cancelar pedido</Text>
          </Pressable>
        )}
        {pedido.estado === 'cancelado' && (
          <Pressable style={styles.boton} onPress={onEliminar}>
            <Text style={styles.textoBoton}>Eliminar</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colors.gris,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a0a0a',
    padding: 14,
    marginBottom: 14,
  },
  encabezado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  numero: { color: colors.blanco, fontFamily: fonts.brand, fontSize: 13 },
  fecha: { color: '#8a8a8a', fontSize: 12, marginTop: 4 },
  estado: { borderWidth: 1, borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10 },
  estadoTexto: { fontSize: 11, fontWeight: 'bold' },
  miniaturas: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  miniaturaCaja: { width: 58, height: 58 },
  miniatura: { width: 58, height: 58, borderRadius: 8, backgroundColor: '#ffffff' },
  miniaturaVacia: { backgroundColor: '#222222' },
  cantidadBadge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: colors.rojo,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  cantidadTexto: { color: colors.blanco, fontSize: 10, fontWeight: 'bold' },
  mas: { color: '#8a8a8a', fontSize: 13, marginLeft: 4 },
  detalle: { color: '#bbbbbb', fontSize: 12, lineHeight: 18, marginTop: 12 },
  pie: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#222222',
  },
  unidades: { color: '#8a8a8a', fontSize: 11 },
  total: { color: colors.rojo, fontFamily: fonts.brand, fontSize: 16, marginTop: 2 },
  boton: {
    borderWidth: 1,
    borderColor: '#ff5555',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  textoBoton: { color: '#ff5555', fontSize: 12, fontWeight: 'bold' },
});