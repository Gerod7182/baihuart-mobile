// Equivalente a la parte de autenticación de navbar.component.ts (menú de
// usuario) + login.component.ts, adaptado a una pantalla completa porque
// en móvil no hay "menú flotante", es su propia pestaña.

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { authService, useUsuarioActual } from '../../services/authService';
import { usePedidosDeUsuario, pedidoService } from '../../services/pedidoService';
import { colors } from '../../theme/colors';
import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';

const ADMIN_EMAIL = 'g3rm4n7115@gmail.com';

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

function PantallaPerfil() {
  const { usuario, esAdmin } = useUsuarioActual();
  const { pedidos, cargando } = usePedidosDeUsuario(usuario?.uid);
  const router = useRouter();

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

      {cargando ? (
        <Text style={styles.textoSecundario}>Cargando pedidos...</Text>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <View style={styles.tarjetaPedido}>
              <View style={styles.filaPedido}>
                <Text style={styles.fechaPedido}>
                  {new Date(item.fecha).toLocaleDateString('es-CO')}
                </Text>
                <Text style={styles.estadoPedido}>{item.estado}</Text>
              </View>
              <Text style={styles.totalPedido}>
                ${item.total.toLocaleString('es-CO')} · {item.items.length} producto(s)
              </Text>
              {item.estado === 'pendiente' && (
                <Pressable
                  style={styles.botonCancelarPedido}
                  onPress={() =>
                    Alert.alert(
                      'Cancelar pedido',
                      'Esto marcará el pedido como cancelado. ¿Continuar?',
                      [
                        { text: 'No', style: 'cancel' },
                        {
                          text: 'Sí, cancelar',
                          style: 'destructive',
                          onPress: () => pedidoService.cancelarPedido(item.id),
                        },
                      ]
                    )
                  }
                >
                  <Text style={styles.textoCancelarPedido}>Cancelar pedido</Text>
                </Pressable>
              )}
              {item.estado === 'cancelado' && (
                <Pressable
                  style={styles.botonCancelarPedido}
                  onPress={() =>
                    Alert.alert(
                      'Eliminar del historial',
                      'Esto borra el pedido por completo, no se puede deshacer. ¿Continuar?',
                      [
                        { text: 'No', style: 'cancel' },
                        {
                          text: 'Sí, eliminar',
                          style: 'destructive',
                          onPress: () => pedidoService.eliminarPedido(item.id),
                        },
                      ]
                    )
                  }
                >
                  <Text style={styles.textoCancelarPedido}>Eliminar del historial</Text>
                </Pressable>
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.textoSecundario}>Aún no tienes pedidos.</Text>
          }
        />
      )}

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
  tarjetaPedido: {
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  filaPedido: { flexDirection: 'row', justifyContent: 'space-between' },
  fechaPedido: { color: '#888', fontSize: 12 },
  estadoPedido: { color: colors.rojo, fontSize: 12, textTransform: 'uppercase' },
  totalPedido: { color: colors.blanco, marginTop: 6, fontWeight: 'bold' },
  botonCancelarPedido: { marginTop: 8, alignSelf: 'flex-start' },
  textoCancelarPedido: { color: '#ff5555', fontSize: 12 },
  botonCerrarSesion: { margin: 16, padding: 14, alignItems: 'center' },
  textoBotonCerrarSesion: { color: '#888', fontSize: 13 },
});
