
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ItemGaleria, Oferta, Producto } from '../models/types';
import { useUsuarioActual } from '../services/authService';
import { crudService, useColeccion } from '../services/crudService';
import { colors } from '../theme/colors';

type Seccion = 'productos' | 'galeria' | 'ofertas';

// ---------------------------------------------------------------------
// Formulario de Productos
// ---------------------------------------------------------------------
function FormularioProductos() {
  const vacio: Producto = { nombre: '', precio: 0, img: '', codigo: '', categoria: 'camisetas' };
  const [producto, setProducto] = useState<Producto>(vacio);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState('');
  const { items } = useColeccion<Producto>('productos');

  const guardar = async () => {
    if (!producto.nombre || !producto.codigo || !producto.img) {
      setMensaje('Faltan datos obligatorios (nombre, código e imagen).');
      return;
    }
    try {
      await crudService.guardar('productos', producto, editandoId);
      setMensaje(editandoId ? '¡Producto actualizado! ✏️' : '¡Producto guardado! ☁️');
      setProducto(vacio);
      setEditandoId(null);
    } catch (e) {
      console.error(e);
      setMensaje('No se pudo guardar el producto.');
    }
  };

  const editar = (p: Producto & { id: string }) => {
    setProducto({ nombre: p.nombre, precio: p.precio, img: p.img, codigo: p.codigo, categoria: p.categoria });
    setEditandoId(p.id);
    setMensaje('');
  };

  const duplicar = (p: Producto & { id: string }) => {
    setProducto({ ...p, codigo: p.codigo + '-copia' });
    setEditandoId(null);
    setMensaje('Cambia el código y guarda para crear la copia.');
  };

  const eliminar = (id: string) => {
    Alert.alert('Eliminar producto', 'No se puede deshacer. ¿Continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await crudService.eliminar('productos', id);
        },
      },
    ]);
  };

  return (
    <View>
      <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#666"
        value={producto.nombre} onChangeText={(v) => setProducto({ ...producto, nombre: v })} />
      <TextInput style={styles.input} placeholder="Código" placeholderTextColor="#666"
        value={producto.codigo} onChangeText={(v) => setProducto({ ...producto, codigo: v })} />
      <TextInput style={styles.input} placeholder="Precio" placeholderTextColor="#666" keyboardType="numeric"
        value={producto.precio ? String(producto.precio) : ''}
        onChangeText={(v) => setProducto({ ...producto, precio: Number(v) || 0 })} />
      <TextInput style={styles.input} placeholder="URL de la imagen" placeholderTextColor="#666"
        autoCapitalize="none" value={producto.img} onChangeText={(v) => setProducto({ ...producto, img: v })} />

      <View style={styles.filaChips}>
        {(['camisetas', 'stickers', 'posters'] as const).map((cat) => (
          <Pressable key={cat} onPress={() => setProducto({ ...producto, categoria: cat })}
            style={[styles.chip, producto.categoria === cat && styles.chipActivo]}>
            <Text style={[styles.textoChip, producto.categoria === cat && styles.textoChipActivo]}>{cat}</Text>
          </Pressable>
        ))}
      </View>

      {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}

      <Pressable style={styles.botonGuardar} onPress={guardar}>
        <Text style={styles.textoBotonGuardar}>{editandoId ? 'Actualizar' : 'Guardar'}</Text>
      </Pressable>
      {editandoId && (
        <Pressable onPress={() => { setProducto(vacio); setEditandoId(null); }}>
          <Text style={styles.cancelar}>Cancelar edición</Text>
        </Pressable>
      )}

      <Text style={styles.subtitulo}>Productos existentes ({items.length})</Text>
      {items.map((p) => (
        <View key={p.id} style={styles.filaItem}>
          {p.img?.startsWith('http') && <Image source={{ uri: p.img }} style={styles.miniatura} />}
          <View style={{ flex: 1 }}>
            <Text style={styles.nombreItem}>{p.nombre}</Text>
            <Text style={styles.detalleItem}>{p.codigo} · ${p.precio?.toLocaleString('es-CO')}</Text>
          </View>
          <Pressable onPress={() => editar(p)}><Text style={styles.accion}>Editar</Text></Pressable>
          <Pressable onPress={() => duplicar(p)}><Text style={styles.accion}>Duplicar</Text></Pressable>
          <Pressable onPress={() => eliminar(p.id)}><Text style={styles.accionEliminar}>Eliminar</Text></Pressable>
        </View>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------
// Formulario de Galería
// ---------------------------------------------------------------------
function FormularioGaleria() {
  const vacio: ItemGaleria = { img: '', categoria: 'espiritual', titulo: '', descripcion: '' };
  const [item, setItem] = useState<ItemGaleria>(vacio);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState('');
  const { items } = useColeccion<ItemGaleria>('galeria');

  const guardar = async () => {
    if (!item.titulo || !item.img) {
      setMensaje('Faltan datos obligatorios (título e imagen).');
      return;
    }
    try {
      await crudService.guardar('galeria', item, editandoId);
      setMensaje(editandoId ? '¡Actualizado! ✏️' : '¡Agregado a la galería! 🖼️');
      setItem(vacio);
      setEditandoId(null);
    } catch (e) {
      console.error(e);
      setMensaje('No se pudo guardar.');
    }
  };

  const editar = (g: ItemGaleria & { id: string }) => {
    setItem({ img: g.img, categoria: g.categoria, titulo: g.titulo, descripcion: g.descripcion });
    setEditandoId(g.id);
    setMensaje('');
  };

  const eliminar = (id: string) => {
    Alert.alert('Quitar imagen', '¿Seguro que quieres quitar esta imagen de la galería?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => crudService.eliminar('galeria', id) },
    ]);
  };

  return (
    <View>
      <TextInput style={styles.input} placeholder="Título" placeholderTextColor="#666"
        value={item.titulo} onChangeText={(v) => setItem({ ...item, titulo: v })} />
      <TextInput style={styles.input} placeholder="Descripción" placeholderTextColor="#666" multiline
        value={item.descripcion} onChangeText={(v) => setItem({ ...item, descripcion: v })} />
      <TextInput style={styles.input} placeholder="URL de la imagen" placeholderTextColor="#666"
        autoCapitalize="none" value={item.img} onChangeText={(v) => setItem({ ...item, img: v })} />

      <View style={styles.filaChips}>
        {(['espiritual', 'anime', 'pop'] as const).map((cat) => (
          <Pressable key={cat} onPress={() => setItem({ ...item, categoria: cat })}
            style={[styles.chip, item.categoria === cat && styles.chipActivo]}>
            <Text style={[styles.textoChip, item.categoria === cat && styles.textoChipActivo]}>{cat}</Text>
          </Pressable>
        ))}
      </View>

      {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}

      <Pressable style={styles.botonGuardar} onPress={guardar}>
        <Text style={styles.textoBotonGuardar}>{editandoId ? 'Actualizar' : 'Guardar'}</Text>
      </Pressable>
      {editandoId && (
        <Pressable onPress={() => { setItem(vacio); setEditandoId(null); }}>
          <Text style={styles.cancelar}>Cancelar edición</Text>
        </Pressable>
      )}

      <Text style={styles.subtitulo}>Items existentes ({items.length})</Text>
      {items.map((g) => (
        <View key={g.id} style={styles.filaItem}>
          {g.img?.startsWith('http') && <Image source={{ uri: g.img }} style={styles.miniatura} />}
          <View style={{ flex: 1 }}>
            <Text style={styles.nombreItem}>{g.titulo}</Text>
            <Text style={styles.detalleItem}>{g.categoria}</Text>
          </View>
          <Pressable onPress={() => editar(g)}><Text style={styles.accion}>Editar</Text></Pressable>
          <Pressable onPress={() => eliminar(g.id)}><Text style={styles.accionEliminar}>Eliminar</Text></Pressable>
        </View>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------
// Formulario de Ofertas
// ---------------------------------------------------------------------
function FormularioOfertas() {
  const vacio: Oferta = { nombre: '', img: '', precioAntes: 0, precioAhora: 0 };
  const [oferta, setOferta] = useState<Oferta>(vacio);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState('');
  const { items } = useColeccion<Oferta>('ofertas');

  const guardar = async () => {
    if (!oferta.nombre || !oferta.img) {
      setMensaje('Faltan datos obligatorios (nombre e imagen).');
      return;
    }
    try {
      await crudService.guardar('ofertas', oferta, editandoId);
      setMensaje(editandoId ? '¡Oferta actualizada! ✏️' : '¡Oferta publicada! 🔥');
      setOferta(vacio);
      setEditandoId(null);
    } catch (e) {
      console.error(e);
      setMensaje('No se pudo guardar la oferta.');
    }
  };

  const editar = (o: Oferta & { id: string }) => {
    setOferta({ nombre: o.nombre, img: o.img, precioAntes: o.precioAntes, precioAhora: o.precioAhora });
    setEditandoId(o.id);
    setMensaje('');
  };

  const eliminar = (id: string) => {
    Alert.alert('Quitar oferta', '¿Seguro que quieres quitar esta oferta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => crudService.eliminar('ofertas', id) },
    ]);
  };

  return (
    <View>
      <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#666"
        value={oferta.nombre} onChangeText={(v) => setOferta({ ...oferta, nombre: v })} />
      <TextInput style={styles.input} placeholder="URL de la imagen" placeholderTextColor="#666"
        autoCapitalize="none" value={oferta.img} onChangeText={(v) => setOferta({ ...oferta, img: v })} />
      <TextInput style={styles.input} placeholder="Precio antes" placeholderTextColor="#666" keyboardType="numeric"
        value={oferta.precioAntes ? String(oferta.precioAntes) : ''}
        onChangeText={(v) => setOferta({ ...oferta, precioAntes: Number(v) || 0 })} />
      <TextInput style={styles.input} placeholder="Precio ahora" placeholderTextColor="#666" keyboardType="numeric"
        value={oferta.precioAhora ? String(oferta.precioAhora) : ''}
        onChangeText={(v) => setOferta({ ...oferta, precioAhora: Number(v) || 0 })} />

      {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}

      <Pressable style={styles.botonGuardar} onPress={guardar}>
        <Text style={styles.textoBotonGuardar}>{editandoId ? 'Actualizar' : 'Guardar'}</Text>
      </Pressable>
      {editandoId && (
        <Pressable onPress={() => { setOferta(vacio); setEditandoId(null); }}>
          <Text style={styles.cancelar}>Cancelar edición</Text>
        </Pressable>
      )}

      <Text style={styles.subtitulo}>Ofertas existentes ({items.length})</Text>
      {items.map((o) => (
        <View key={o.id} style={styles.filaItem}>
          {o.img?.startsWith('http') && <Image source={{ uri: o.img }} style={styles.miniatura} />}
          <View style={{ flex: 1 }}>
            <Text style={styles.nombreItem}>{o.nombre}</Text>
            <Text style={styles.detalleItem}>
              ${o.precioAntes?.toLocaleString('es-CO')} → ${o.precioAhora?.toLocaleString('es-CO')}
            </Text>
          </View>
          <Pressable onPress={() => editar(o)}><Text style={styles.accion}>Editar</Text></Pressable>
          <Pressable onPress={() => eliminar(o.id)}><Text style={styles.accionEliminar}>Eliminar</Text></Pressable>
        </View>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------
// Pantalla principal con protección de acceso
// ---------------------------------------------------------------------
export default function AdminScreen() {
  const { usuario, esAdmin, cargando } = useUsuarioActual();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [seccion, setSeccion] = useState<Seccion>('productos');

  // Equivalente al AdminGuard: exige correo admin Y correo verificado.
  const tieneAcceso = usuario && esAdmin && usuario.emailVerified;

  if (cargando) return null;

  if (!tieneAcceso) {
    return (
      <View style={[styles.contenedor, styles.centrado, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.textoSinAcceso}>No tienes acceso a esta sección.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.volver}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      {/* El header nativo de expo-router a veces queda oculto por el
          layout raíz, así que armamos uno propio que SIEMPRE respeta
          el área segura (evita que la barra de estado del celular
          tape los botones, que era el bug original). */}
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.encabezado, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.blanco} />
        </Pressable>
        <Text style={styles.tituloEncabezado}>Panel Admin</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.filaChips}>
        {(['productos', 'galeria', 'ofertas'] as const).map((s) => (
          <Pressable key={s} onPress={() => setSeccion(s)}
            style={[styles.chipSeccion, seccion === s && styles.chipActivo]}>
            <Text style={[styles.textoChip, seccion === s && styles.textoChipActivo]}>{s}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {seccion === 'productos' && <FormularioProductos />}
        {seccion === 'galeria' && <FormularioGaleria />}
        {seccion === 'ofertas' && <FormularioOfertas />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colors.negro },
  centrado: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  textoSinAcceso: { color: colors.blanco, fontSize: 15 },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  tituloEncabezado: { color: colors.blanco, fontSize: 17, fontWeight: 'bold' },
  volver: { color: colors.rojo, fontSize: 14 },
  input: {
    borderWidth: 1, borderColor: '#333', borderRadius: 8, color: colors.blanco,
    padding: 12, marginBottom: 10,
  },
  filaChips: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 12, marginBottom: 10, flexWrap: 'wrap' },
  chip: { borderWidth: 1, borderColor: colors.rojo, borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12 },
  chipSeccion: { borderWidth: 1, borderColor: colors.rojo, borderRadius: 16, paddingVertical: 8, paddingHorizontal: 14 },
  chipActivo: { backgroundColor: colors.rojo },
  textoChip: { color: colors.rojo, fontSize: 12, textTransform: 'capitalize' },
  textoChipActivo: { color: colors.blanco, fontWeight: 'bold' },
  mensaje: { color: colors.amarillo ?? '#ffd000', fontSize: 12, marginBottom: 8 },
  botonGuardar: { backgroundColor: colors.rojo, borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  textoBotonGuardar: { color: colors.blanco, fontWeight: 'bold' },
  cancelar: { color: '#888', textAlign: 'center', marginTop: 8, fontSize: 12 },
  subtitulo: { color: colors.blanco, fontWeight: 'bold', fontSize: 14, marginTop: 24, marginBottom: 10, textTransform: 'uppercase' },
  filaItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1a1a1a', paddingBottom: 10 },
  miniatura: { width: 40, height: 40, borderRadius: 6 },
  nombreItem: { color: colors.blanco, fontSize: 13 },
  detalleItem: { color: '#888', fontSize: 11 },
  accion: { color: colors.rojo, fontSize: 11, marginLeft: 6 },
  accionEliminar: { color: '#ff5555', fontSize: 11, marginLeft: 6 },
});
