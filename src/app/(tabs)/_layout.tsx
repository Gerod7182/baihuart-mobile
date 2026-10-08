import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function icono(name: IconName) {
  return ({ color, size }: { color: string; size: number }) => (
    <Ionicons name={name} color={color} size={size} />
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Las pantallas no manejan la barra de estado por sí solas,
        // así que el margen superior se aplica aquí una sola vez.
        sceneStyle: { backgroundColor: colors.negro, paddingTop: insets.top },
        tabBarActiveTintColor: colors.rojo,
        tabBarInactiveTintColor: '#8a8a8a',
        tabBarStyle: {
          backgroundColor: colors.gris,
          borderTopColor: '#2a0a0a',
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Tienda', tabBarIcon: icono('storefront') }} />
      <Tabs.Screen name="galeria" options={{ title: 'Galería', tabBarIcon: icono('images') }} />
      <Tabs.Screen name="ofertas" options={{ title: 'Ofertas', tabBarIcon: icono('pricetag') }} />
      <Tabs.Screen name="carrito" options={{ title: 'Carrito', tabBarIcon: icono('cart') }} />
      <Tabs.Screen name="cuenta" options={{ title: 'Cuenta', tabBarIcon: icono('person') }} />
    </Tabs>
  );
}
