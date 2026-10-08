// Equivalente a las variables :root de src/styles.css en baihuart-app.
// Mismos valores exactos, para que la app se vea consistente con la web.

export const colors = {
  negro: '#0a0a0a',
  gris: '#111111',
  rojo: '#ff2a2a',
  naranja: '#ff6b00',
  amarillo: '#ffd000',
  verde: '#00ff88',
  blanco: '#ffffff',
};

// La web usa la fuente 'Orbitron' para títulos y botones.
// En Expo hay que cargarla como fuente personalizada:
//   npx expo install expo-font @expo-google-fonts/orbitron
// y luego usar useFonts() en el layout raíz (app/_layout.tsx) antes
// de renderizar la app, igual como Angular la carga vía CSS @import.
export const fonts = {
  brand: 'Orbitron_700Bold', // nombre que expone @expo-google-fonts/orbitron
};

// Gradiente rojo→naranja que usan .btn-tienda / .hero-btn en la web.
// React Native no soporta linear-gradient con CSS puro; se usa la
// librería expo-linear-gradient para reproducir el mismo efecto:
//   npx expo install expo-linear-gradient
export const gradients = {
  botonPrincipal: [colors.rojo, colors.naranja] as const,
};
