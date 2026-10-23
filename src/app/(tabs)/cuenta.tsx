import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { PantallaPerfil } from '../../components/cuenta/PantallaPerfil';
import { authService, useUsuarioActual } from '../../services/authService';
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
});