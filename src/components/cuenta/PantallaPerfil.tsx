import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Pedido } from '../../models/types';
import { authService, useUsuarioActual } from '../../services/authService';
import { pedidoService, usePedidosDeUsuario } from '../../services/pedidoService';
import { colors, fonts } from '../../theme/colors';
import { ConfirmarModal } from '../ConfirmarModal';
import { TarjetaPedido } from '../TarjetaPedido';
import { EncabezadoPerfil } from './EncabezadoPerfil';
import { FilaMenu } from './FilaMenu';
import { FiltroPedido, FiltroPedidos } from './FiltroPedidos';

type AccionPedido = { tipo: 'cancelar' | 'eliminar'; id: string } | null;

const MENSAJES_VACIO: Record<FiltroPedido, string> = {
  todos: 'Aún no has hecho ningún pedido.',
  pendiente: 'No tienes pedidos pendientes.',
  entregado: 'Todavía no tienes pedidos entregados.',
  cancelado: 'No tienes pedidos cancelados.',
};

export function PantallaPerfil() {
  const { usuario, esAdmin } = useUsuarioActual();
  const { pedidos, cargando } = usePedidosDeUsuario(usuario?.uid);
  const router = useRouter();
  const [filtro, setFiltro] = useState<FiltroPedido>('todos');
  const [accion, setAccion] = useState<AccionPedido>(null);
  const [procesando, setProcesando] = useState(false);
  const [errorAccion, setErrorAccion] = useState('');
  const [confirmarSalida, setConfirmarSalida] = useState(false);

  const esCancelar = accion?.tipo === 'cancelar';

  const conteos = useMemo(() => {
    const base: Record<FiltroPedido, number> = {
      todos: pedidos.length,
      pendiente: 0,
      entregado: 0,
      cancelado: 0,
    };
    pedidos.forEach((p: Pedido) => {
      base[p.estado] += 1;
    });
    return base;
  }, [pedidos]);

  const pedidosFiltrados = useMemo(
    () => pedidos.filter((p) => filtro === 'todos' || p.estado === filtro),
    [pedidos, filtro]
  );

  const nombre = usuario?.displayName || usuario?.email?.split('@')[0] || 'Cliente';
  const creado = usuario?.metadata.creationTime;
  const miembroDesde = creado
    ? new Date(creado).toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })
    : undefined;

  const confirmarAccion = async () => {
    if (!accion) return;
    setProcesando(true);
    setErrorAccion('');
    try {
      if (accion.tipo === 'cancelar') {
        await pedidoService.cancelarPedido(accion.id);
      } else {
        await pedidoService.eliminarPedido(accion.id);
      }
    } catch (error) {
      console.error('No se pudo completar la acción sobre el pedido:', error);
      setErrorAccion('No se pudo completar la acción. Intenta de nuevo.');
    } finally {
      setAccion(null);
      setProcesando(false);
    }
  };

  const cerrarSesion = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('No se pudo cerrar la sesión:', error);
    } finally {
      setConfirmarSalida(false);
    }
  };

  const encabezado = (
    <View>
      <EncabezadoPerfil
        nombre={nombre}
        correo={usuario?.email ?? ''}
        miembroDesde={miembroDesde}
        esAdmin={esAdmin}
      />
      <Text style={styles.subtitulo}>Mis pedidos</Text>
      <FiltroPedidos filtro={filtro} conteos={conteos} onCambiar={setFiltro} />
      {errorAccion !== '' && <Text style={styles.error}>{errorAccion}</Text>}
    </View>
  );

  const vacio = cargando ? (
    <ActivityIndicator color={colors.rojo} style={styles.cargando} />
  ) : (
    <View style={styles.vacio}>
      <Ionicons name="bag-outline" size={40} color="#444444" />
      <Text style={styles.textoVacio}>{MENSAJES_VACIO[filtro]}</Text>
    </View>
  );

  const menu = (
    <View style={styles.menu}>
      <Text style={styles.subtituloMenu}>Mi cuenta</Text>
      {esAdmin && (
        <FilaMenu
          icono="shield-checkmark-outline"
          titulo="Panel de administración"
          subtitulo="Productos, galería y ofertas"
          onPress={() => router.push('/admin')}
        />
      )}
      <FilaMenu
        icono="storefront-outline"
        titulo="Seguir comprando"
        subtitulo="Explora camisetas, stickers y pósters"
        onPress={() => router.push('/(tabs)')}
      />
      <FilaMenu
        icono="log-out-outline"
        titulo="Cerrar sesión"
        peligro
        onPress={() => setConfirmarSalida(true)}
      />
    </View>
  );

  return (
    <View style={styles.contenedor}>
      <View style={styles.columna}>
        <FlatList
          data={pedidosFiltrados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          ListHeaderComponent={encabezado}
          ListEmptyComponent={vacio}
          ListFooterComponent={menu}
          renderItem={({ item }) => (
            <TarjetaPedido
              pedido={item}
              onCancelar={() => setAccion({ tipo: 'cancelar', id: item.id })}
              onEliminar={() => setAccion({ tipo: 'eliminar', id: item.id })}
            />
          )}
        />
      </View>

      <ConfirmarModal
        visible={accion !== null}
        titulo={esCancelar ? 'Cancelar pedido' : 'Eliminar del historial'}
        mensaje={
          esCancelar
            ? 'Esto marcará el pedido como cancelado. ¿Continuar?'
            : 'Esto borra el pedido por completo, no se puede deshacer. ¿Continuar?'
        }
        textoConfirmar={esCancelar ? 'Sí, cancelar' : 'Sí, eliminar'}
        procesando={procesando}
        onConfirmar={() => void confirmarAccion()}
        onCancelar={() => setAccion(null)}
      />

      <ConfirmarModal
        visible={confirmarSalida}
        titulo="Cerrar sesión"
        mensaje="¿Seguro que quieres salir de tu cuenta?"
        textoConfirmar="Sí, salir"
        textoCancelar="Quedarme"
        onConfirmar={() => void cerrarSesion()}
        onCancelar={() => setConfirmarSalida(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colors.negro },
  columna: { flex: 1, width: '100%', maxWidth: 720, alignSelf: 'center' },
  lista: { paddingHorizontal: 16, paddingBottom: 32 },
  subtitulo: {
    color: colors.blanco,
    fontFamily: fonts.brand,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 24,
    marginBottom: 12,
  },
  error: { color: colors.rojo, fontSize: 12, marginBottom: 12 },
  cargando: { marginVertical: 32 },
  vacio: { alignItems: 'center', gap: 10, paddingVertical: 32 },
  textoVacio: { color: '#777777', fontSize: 13, textAlign: 'center' },
  menu: {
    marginTop: 24,
    backgroundColor: colors.gris,
    borderWidth: 1,
    borderColor: '#2a0a0a',
    borderRadius: 16,
    overflow: 'hidden',
  },
  subtituloMenu: {
    color: '#888888',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
});