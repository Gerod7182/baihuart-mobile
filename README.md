# Baihuart

Aplicación móvil de la tienda de merchandising de cómics, anime y videojuegos **Baihuart**. Permite explorar el catálogo, ver la galería de diseños, comprar con un carrito y seguir los pedidos; un administrador gestiona productos, galería y ofertas desde la misma aplicación. Está en español, inglés y portugués.

Proyecto académico de Calidad de Software (ISD33, grupo 30111) de Ingeniería de Sistemas, CUN.

**Equipo:** German Alejandro Rodríguez Bermudez, Juan David Martinez Cubillos y Fabian Steven Castillo Murillo.

## Descargar la aplicación (Android)

APK de la versión 1.0.0: https://expo.dev/artifacts/eas/qUVJllyM0lZjxDKwbBNMsxPvddQ0kw7iIHPrG5loXg8.apk

1. Abre el enlace desde un celular Android y descarga el archivo.
2. Si Android lo pide, permite instalar aplicaciones de esta fuente.
3. Abre el archivo y pulsa Instalar.
4. Abre Baihuart. La primera vez necesita internet.

## Tecnologías

- Expo SDK 58, React Native 0.88, React 19 y Expo Router
- TypeScript en modo estricto
- Firebase (Authentication y Cloud Firestore), proyecto `baihuart-store`, compartido con el sitio web en Angular
- Cloudinary para las fotos que sube el administrador
- EAS Build para generar el APK
- SonarQube Cloud para el análisis de calidad

## Ejecutar en desarrollo

Requisitos: Node.js y la aplicación Expo Go en el celular.

```bash
npm install
npx expo start
```

Escanea el código QR con Expo Go. Para comprobar los tipos:

```bash
npx tsc --noEmit
```

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `src/app` | Pantallas: Tienda, Galería, Ofertas, Carrito, Cuenta y panel de administración |
| `src/components` | Componentes reutilizables |
| `src/services` | Firebase, carrito, pedidos, galería, traducciones y Cloudinary |
| `src/theme` | Colores, tipografía y medidas responsivas |
| `src/models` y `src/types` | Modelos de datos y declaraciones de tipos |

## Compilar el APK

```bash
npx eas-cli build --platform android --profile preview
```

## Calidad

El código se analiza con SonarQube Cloud en cada cambio de la rama `master`. Resultado de la versión 1.0.0: 0 problemas abiertos en seguridad, fiabilidad y mantenibilidad (las tres con calificación A) y 0,0 % de código duplicado. Las pruebas funcionales y las métricas están en el informe técnico de la entrega.

## Licencia

Consulta el archivo `LICENSE`.
