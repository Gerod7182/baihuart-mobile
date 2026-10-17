
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ConfirmarModal } from '../../components/ConfirmarModal';
import { TarjetaPedido } from '../../components/TarjetaPedido';
import { authService, useUsuarioActual } from '../../services/authService';
import { pedidoService, usePedidosDeUsuario } from '../../services/pedidoService';
import { colors } from '../../theme/colors';

function PantallaLogin() {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const enviar = async () => {
    setError('');
    setCargando(true);
    try {
      if (modoRegistro) {
        await authService.register(email.trim(), password, nombre.trim());
      } else {
        await authService.login(email.trim(), password);
      }
    } catch (e: any) {
      // Mensajes típicos de Firebase Auth — puedes traducirlos si quieres
      // mostrar algo más amigable que el código de error crudo.
      setError(e?.message ?? 'Ocurrió un error, intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.contenedorLogin}>
      <Text style={styles.titulo}>
        {modoRegistro ? 'Crear cuenta' : 'Iniciar sesión'}
      </Text>

      {modoRegistro && (
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#666"
          value={nombre}
          onChangeText={setNombre}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Correo"
        placeholderTextColor="#666"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#666"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.textoError}>{error}</Text> : null}

      <Pressable style={styles.boton} onPress={enviar} disabled={cargando}>
        {cargando ? (
          <ActivityIndicator color={colors.blanco} />
        ) : (
          <Text style={styles.textoBoton}>
            {modoRegistro ? 'Registrarme' : 'Entrar'}
          </Text>
        )}
      </Pressable>

      <Pressable onPress={() => setModoRegistro(!modoRegistro)}>
        <Text style={styles.textoCambiarModo}>
          {modoRegistro
            ? '¿Ya tienes cuenta? Inicia sesión'
            : '¿No tienes cuenta? Regístrate'}
        </Text>
      </Pressable>
    </View>
  );
}

type AccionPedido = { tipo: 'cancelar' | 'eliminar'; id: string } | null;

function PantallaPerfil() {
  const { usuario, esAdmin } = useUsuarioActual();
  const { pedidos, cargando } = usePedidosDeUsuario(usuario?.uid);
  const router = useRouter();
  const [accion, setAccion] = useState<AccionPedido>(null);
  const [procesando, setProcesando] = useState(false);
  const [errorAccion, setErrorAccion] = useState('');

  const esCancelar = accion?.tipo === 'cancelar';

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

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezadoPerfil}>
        <Text style={styles.nombreUsuario}>
          {usuario?.displayName || usuario?.email}
        </Text>
        <Text style={styles.correoUsuario}>{usuario?.email}</Text>
        {esAdmin && <Text style={styles.badgeAdmin}>Administrador</Text>}
        {esAdmin && (
          <Pressable style={styles.botonPanelAdmin} onPress={() => router.push('/admin')}>
            <Text style={styles.textoBotonPanelAdmin}>Panel Admin</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.subtitulo}>Historial de pedidos</Text>
      {errorAccion !== '' && <Text style={styles.textoSecundario}>{errorAccion}</Text>}

      {cargando ? (
        <Text style={styles.textoSecundario}>Cargando pedidos...</Text>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TarjetaPedido
              pedido={item}
              onCancelar={() => setAccion({ tipo: 'cancelar', id: item.id })}
              onEliminar={() => setAccion({ tipo: 'eliminar', id: item.id })}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.textoSecundario}>Aún no tienes pedidos.</Text>
          }
        />
      )}

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

      <Pressable style={styles.botonCerrarSesion} onPress={() => authService.logout()}>
        <Text style={styles.textoBotonCerrarSesion}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

export default function CuentaScreen() {
  const { usuario, cargando } = useUsuarioActual();

  if (cargando) {
    return (
      <View style={[styles.contenedor, styles.centrado]}>
        <ActivityIndicator color={colors.rojo} />
      </View>
    );
  }

  return usuario ? <PantallaPerfil /> : <PantallaLogin />;
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colors.negro },
  centrado: { alignItems: 'center', justifyContent: 'center' },
  contenedorLogin: {
    flex: 1,
    backgroundColor: colors.negro,
    padding: 24,
    justifyContent: 'center',
  },
  titulo: {
    color: colors.blanco,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    color: colors.blanco,
    padding: 12,
    marginBottom: 12,
  },
  boton: {
    backgroundColor: colors.rojo,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBoton: { color: colors.blanco, fontWeight: 'bold' },
  textoCambiarModo: { color: '#888', textAlign: 'center', marginTop: 16, fontSize: 13 },
  textoError: { color: colors.rojo, fontSize: 12, marginBottom: 8 },
  encabezadoPerfil: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  nombreUsuario: { color: colors.blanco, fontSize: 18, fontWeight: 'bold' },
  correoUsuario: { color: '#888', fontSize: 13, marginTop: 2 },
  badgeAdmin: { color: colors.rojo, fontSize: 12, marginTop: 6, fontWeight: 'bold' },
  botonPanelAdmin: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.rojo,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
  },
  textoBotonPanelAdmin: { color: colors.rojo, fontSize: 12, fontWeight: 'bold' },
  subtitulo: {
    color: colors.blanco,
    fontSize: 15,
    fontWeight: 'bold',
    padding: 16,
    textTransform: 'uppercase',
  },
  textoSecundario: { color: '#888', paddingHorizontal: 16 },
  botonCerrarSesion: { margin: 16, padding: 14, alignItems: 'center' },
  textoBotonCerrarSesion: { color: '#888', fontSize: 13 },
});