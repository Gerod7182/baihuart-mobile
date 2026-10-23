import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CampoAdmin } from '../components/admin/CampoAdmin';
import { SelectorChips } from '../components/admin/SelectorChips';
import { SelectorImagen } from '../components/admin/SelectorImagen';
import { TarjetaAdmin } from '../components/admin/TarjetaAdmin';
import { BotonDegradado } from '../components/BotonDegradado';
import { useConfirmarEliminar } from '../components/useConfirmarEliminar';
import { ItemGaleria, Oferta, Producto } from '../models/types';
import { useUsuarioActual } from '../services/authService';
import { crudService, useColeccion } from '../services/crudService';
import { colors, fonts } from '../theme/colors';

type Seccion = 'productos' | 'galeria' | 'ofertas';
type IconName = React.ComponentProps<typeof Ionicons>['name'];

const SECCIONES: { clave: Seccion; titulo: string; icono: IconName }[] = [
  { clave: 'productos', titulo: 'Productos', icono: 'shirt-outline' },
  { clave: 'galeria', titulo: 'Galería', icono: 'images-outline' },
  { clave: 'ofertas', titulo: 'Ofertas', icono: 'pricetag-outline' },
];

type PropsFormulario = { onIrArriba: () => void };

// ---------------------------------------------------------------------
// Encabezado de cada formulario: dice si estás creando o editando
// ---------------------------------------------------------------------
function BannerFormulario({
  titulo,
  editando,
  onCancelar,
}: Readonly<{ titulo: string; editando: boolean; onCancelar: () => void }>) {
  return (
    <View style={styles.banner}>
      <Ionicons
        name={editando ? 'create-outline' : 'add-circle-outline'}
        size={20}
        color={colors.rojo}
      />
      <Text style={styles.textoBanner} numberOfLines={1}>
        {titulo}
      </Text>
      {editando && (
        <Pressable onPress={onCancelar} hitSlop={8}>
          <Text style={styles.cancelar}>Cancelar</Text>
        </Pressable>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------
// Productos
// ---------------------------------------------------------------------
function FormularioProductos({ onIrArriba }: Readonly<PropsFormulario>) {
  const vacio: Producto = { nombre: '', precio: 0, img: '', codigo: '', categoria: 'camisetas' };
  const [producto, setProducto] = useState<Producto>(vacio);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);
  const { items } = useColeccion<Producto>('productos');
  const { pedirEliminar, modalEliminar } = useConfirmarEliminar(
    'productos',
    'No se puede deshacer. ¿Continuar?'
  );

  const limpiar = () => {
    setProducto(vacio);
    setEditandoId(null);
  };

  const guardar = async () => {
    if (!producto.nombre || !producto.codigo || !producto.img) {
      setMensaje('Faltan datos obligatorios (nombre, código e imagen).');
      return;
    }
    setGuardando(true);
    try {
      await crudService.guardar('productos', producto, editandoId);
      setMensaje(editandoId ? '¡Producto actualizado! ✏️' : '¡Producto guardado! ☁️');
      limpiar();
    } catch (e) {
      console.error(e);
      setMensaje('No se pudo guardar el producto.');
    } finally {
      setGuardando(false);
    }
  };

  const editar = (p: Producto & { id: string }) => {
    setProducto({
      nombre: p.nombre,
      precio: p.precio,
      img: p.img,
      codigo: p.codigo,
      categoria: p.categoria,
    });
    setEditandoId(p.id);
    setMensaje('');
    onIrArriba();
  };

  const duplicar = (p: Producto & { id: string }) => {
    setProducto({
      nombre: p.nombre,
      precio: p.precio,
      img: p.img,
      codigo: p.codigo + '-copia',
      categoria: p.categoria,
    });
    setEditandoId(null);
    setMensaje('Cambia el código y guarda para crear la copia.');
    onIrArriba();
  };

  return (
    <View>
      {modalEliminar}
      <View style={styles.tarjetaFormulario}>
        <BannerFormulario
          titulo={editandoId ? `Editando: ${producto.nombre || 'producto'}` : 'Nuevo producto'}
          editando={editandoId !== null}
          onCancelar={limpiar}
        />

        <CampoAdmin
          etiqueta="Nombre"
          placeholder="Ej: Póster Optimus Prime"
          value={producto.nombre}
          onChangeText={(v) => setProducto({ ...producto, nombre: v })}
        />
        <CampoAdmin
          etiqueta="Código (único)"
          placeholder="Ej: prod-post-optimus"
          autoCapitalize="none"
          value={producto.codigo}
          onChangeText={(v) => setProducto({ ...producto, codigo: v })}
        />
        <CampoAdmin
          etiqueta="Precio"
          placeholder="20000"
          keyboardType="numeric"
          value={producto.precio ? String(producto.precio) : ''}
          onChangeText={(v) => setProducto({ ...producto, precio: Number(v) || 0 })}
        />
        <SelectorChips
          etiqueta="Categoría"
          opciones={['camisetas', 'stickers', 'posters'] as const}
          valor={producto.categoria}
          onCambiar={(cat) => setProducto({ ...producto, categoria: cat })}
        />
        <SelectorImagen
          valor={producto.img}
          onCambiar={(url) => setProducto({ ...producto, img: url })}
        />

        {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}

        <BotonDegradado
          texto={editandoId ? 'Actualizar producto' : 'Guardar producto'}
          onPress={() => void guardar()}
          cargando={guardando}
        />
      </View>

      <Text style={styles.subtitulo}>Productos guardados ({items.length})</Text>
      {items.length === 0 && <Text style={styles.vacio}>Aún no hay productos.</Text>}
      {items.map((p) => (
        <TarjetaAdmin
          key={p.id}
          ruta={p.img}
          titulo={p.nombre}
          subtitulo={`${p.codigo} · $${p.precio?.toLocaleString('es-CO')}`}
          etiqueta={p.categoria}
          resaltada={p.id === editandoId}
          onEditar={() => editar(p)}
          onDuplicar={() => duplicar(p)}
          onEliminar={() => pedirEliminar(p.id)}
        />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------
// Galería
// ---------------------------------------------------------------------
function FormularioGaleria({ onIrArriba }: Readonly<PropsFormulario>) {
  const vacio: ItemGaleria = { img: '', categoria: 'espiritual', titulo: '', descripcion: '' };
  const [item, setItem] = useState<ItemGaleria>(vacio);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);
  const { items } = useColeccion<ItemGaleria>('galeria');
  const { pedirEliminar, modalEliminar } = useConfirmarEliminar(
    'galeria',
    '¿Seguro que quieres quitar esta imagen de la galería?'
  );

  const limpiar = () => {
    setItem(vacio);
    setEditandoId(null);
  };

  const guardar = async () => {
    if (!item.titulo || !item.img) {
      setMensaje('Faltan datos obligatorios (título e imagen).');
      return;
    }
    setGuardando(true);
    try {
      await crudService.guardar('galeria', item, editandoId);
      setMensaje(editandoId ? '¡Actualizado! ✏️' : '¡Agregado a la galería! 🖼️');
      limpiar();
    } catch (e) {
      console.error(e);
      setMensaje('No se pudo guardar.');
    } finally {
      setGuardando(false);
    }
  };

  const editar = (g: ItemGaleria & { id: string }) => {
    setItem({
      img: g.img,
      categoria: g.categoria,
      titulo: g.titulo,
      descripcion: g.descripcion,
    });
    setEditandoId(g.id);
    setMensaje('');
    onIrArriba();
  };

  return (
    <View>
      {modalEliminar}
      <View style={styles.tarjetaFormulario}>
        <BannerFormulario
          titulo={editandoId ? `Editando: ${item.titulo || 'imagen'}` : 'Nueva imagen de galería'}
          editando={editandoId !== null}
          onCancelar={limpiar}
        />

        <CampoAdmin
          etiqueta="Título"
          placeholder="Ej: Optimus Prime"
          value={item.titulo}
          onChangeText={(v) => setItem({ ...item, titulo: v })}
        />
        <CampoAdmin
          etiqueta="Descripción"
          placeholder="Breve descripción del diseño"
          multiline
          style={styles.campoLargo}
          value={item.descripcion}
          onChangeText={(v) => setItem({ ...item, descripcion: v })}
        />
        <SelectorChips
          etiqueta="Categoría"
          opciones={['espiritual', 'anime', 'pop'] as const}
          valor={item.categoria}
          onCambiar={(cat) => setItem({ ...item, categoria: cat })}
        />
        <SelectorImagen valor={item.img} onCambiar={(url) => setItem({ ...item, img: url })} />

        {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}

        <BotonDegradado
          texto={editandoId ? 'Actualizar imagen' : 'Guardar imagen'}
          onPress={() => void guardar()}
          cargando={guardando}
        />
      </View>

      <Text style={styles.subtitulo}>Imágenes de la galería ({items.length})</Text>
      {items.length === 0 && <Text style={styles.vacio}>Aún no hay imágenes.</Text>}
      {items.map((g) => (
        <TarjetaAdmin
          key={g.id}
          ruta={g.img}
          titulo={g.titulo}
          subtitulo={g.descripcion}
          etiqueta={g.categoria}
          resaltada={g.id === editandoId}
          onEditar={() => editar(g)}
          onEliminar={() => pedirEliminar(g.id)}
        />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------
// Ofertas
// ---------------------------------------------------------------------
function FormularioOfertas({ onIrArriba }: Readonly<PropsFormulario>) {
  const vacio: Oferta = { nombre: '', img: '', precioAntes: 0, precioAhora: 0 };
  const [oferta, setOferta] = useState<Oferta>(vacio);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);
  const { items } = useColeccion<Oferta>('ofertas');
  const { pedirEliminar, modalEliminar } = useConfirmarEliminar(
    'ofertas',
    '¿Seguro que quieres quitar esta oferta?'
  );

  const limpiar = () => {
    setOferta(vacio);
    setEditandoId(null);
  };

  const guardar = async () => {
    if (!oferta.nombre || !oferta.img) {
      setMensaje('Faltan datos obligatorios (nombre e imagen).');
      return;
    }
    setGuardando(true);
    try {
      await crudService.guardar('ofertas', oferta, editandoId);
      setMensaje(editandoId ? '¡Oferta actualizada! ✏️' : '¡Oferta publicada! 🔥');
      limpiar();
    } catch (e) {
      console.error(e);
      setMensaje('No se pudo guardar la oferta.');
    } finally {
      setGuardando(false);
    }
  };

  const editar = (o: Oferta & { id: string }) => {
    setOferta({
      nombre: o.nombre,
      img: o.img,
      precioAntes: o.precioAntes,
      precioAhora: o.precioAhora,
    });
    setEditandoId(o.id);
    setMensaje('');
    onIrArriba();
  };

  return (
    <View>
      {modalEliminar}
      <View style={styles.tarjetaFormulario}>
        <BannerFormulario
          titulo={editandoId ? `Editando: ${oferta.nombre || 'oferta'}` : 'Nueva oferta'}
          editando={editandoId !== null}
          onCancelar={limpiar}
        />

        <CampoAdmin
          etiqueta="Nombre"
          placeholder="Ej: Pack: Camiseta + Sticker"
          value={oferta.nombre}
          onChangeText={(v) => setOferta({ ...oferta, nombre: v })}
        />
        <CampoAdmin
          etiqueta="Precio antes"
          placeholder="40000"
          keyboardType="numeric"
          value={oferta.precioAntes ? String(oferta.precioAntes) : ''}
          onChangeText={(v) => setOferta({ ...oferta, precioAntes: Number(v) || 0 })}
        />
        <CampoAdmin
          etiqueta="Precio ahora"
          placeholder="25000"
          keyboardType="numeric"
          value={oferta.precioAhora ? String(oferta.precioAhora) : ''}
          onChangeText={(v) => setOferta({ ...oferta, precioAhora: Number(v) || 0 })}
        />
        <SelectorImagen
          valor={oferta.img}
          onCambiar={(url) => setOferta({ ...oferta, img: url })}
        />

        {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}

        <BotonDegradado
          texto={editandoId ? 'Actualizar oferta' : 'Publicar oferta'}
          onPress={() => void guardar()}
          cargando={guardando}
        />
      </View>

      <Text style={styles.subtitulo}>Ofertas activas ({items.length})</Text>
      {items.length === 0 && <Text style={styles.vacio}>Aún no hay ofertas.</Text>}
      {items.map((o) => (
        <TarjetaAdmin
          key={o.id}
          ruta={o.img}
          titulo={o.nombre}
          subtitulo={`$${o.precioAntes?.toLocaleString('es-CO')} → $${o.precioAhora?.toLocaleString('es-CO')}`}
          resaltada={o.id === editandoId}
          onEditar={() => editar(o)}
          onEliminar={() => pedirEliminar(o.id)}
        />
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
  const scrollRef = useRef<ScrollView>(null);

  // Solo para mostrar el contador en cada pestaña.
  const cantidades: Record<Seccion, number> = {
    productos: useColeccion<Producto>('productos').items.length,
    galeria: useColeccion<ItemGaleria>('galeria').items.length,
    ofertas: useColeccion<Oferta>('ofertas').items.length,
  };

  const irArriba = () => scrollRef.current?.scrollTo({ y: 0, animated: true });

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
      {/* Encabezado propio que respeta el área segura del celular. */}
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.encabezado, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.blanco} />
        </Pressable>
        <Text style={styles.tituloEncabezado}>Panel Admin</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.tabs}>
        {SECCIONES.map((s) => {
          const activa = seccion === s.clave;
          return (
            <Pressable
              key={s.clave}
              onPress={() => setSeccion(s.clave)}
              style={[styles.tab, activa && styles.tabActiva]}
            >
              <Ionicons name={s.icono} size={20} color={activa ? colors.blanco : colors.rojo} />
              <Text style={[styles.textoTab, activa && styles.textoTabActivo]}>
                {s.titulo} ({cantidades[s.clave]})
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContenido}>
        <View style={styles.columna}>
          {seccion === 'productos' && <FormularioProductos onIrArriba={irArriba} />}
          {seccion === 'galeria' && <FormularioGaleria onIrArriba={irArriba} />}
          {seccion === 'ofertas' && <FormularioOfertas onIrArriba={irArriba} />}
        </View>
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
  tituloEncabezado: {
    color: colors.blanco,
    fontFamily: fonts.brand,
    fontSize: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  volver: { color: colors.rojo, fontSize: 14 },
  tabs: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#3a1010',
    borderRadius: 12,
    paddingVertical: 10,
  },
  tabActiva: { backgroundColor: colors.rojo, borderColor: colors.rojo },
  textoTab: { color: '#cccccc', fontSize: 11 },
  textoTabActivo: { color: colors.blanco, fontWeight: 'bold' },
  scrollContenido: { padding: 16, paddingBottom: 48, alignItems: 'center' },
  columna: { width: '100%', maxWidth: 720 },
  tarjetaFormulario: {
    backgroundColor: colors.gris,
    borderWidth: 1,
    borderColor: '#2a0a0a',
    borderRadius: 16,
    padding: 16,
  },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  textoBanner: {
    flex: 1,
    color: colors.blanco,
    fontFamily: fonts.brand,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  cancelar: { color: '#aaaaaa', fontSize: 12 },
  campoLargo: { minHeight: 80, textAlignVertical: 'top' },
  mensaje: { color: colors.amarillo, fontSize: 12, marginBottom: 12 },
  subtitulo: {
    color: colors.blanco,
    fontFamily: fonts.brand,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 28,
    marginBottom: 12,
  },
  vacio: { color: '#777777', textAlign: 'center', padding: 20 },
});