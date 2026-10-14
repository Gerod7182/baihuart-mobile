import { Orbitron_700Bold, useFonts } from '@expo-google-fonts/orbitron';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { colors } from '../theme/colors';

// Mantiene el splash visible hasta que la fuente esté lista
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fuentesListas, errorFuentes] = useFonts({ Orbitron_700Bold });

  useEffect(() => {
    if (fuentesListas || errorFuentes) {
      void SplashScreen.hideAsync();
    }
  }, [fuentesListas, errorFuentes]);

  if (!fuentesListas && !errorFuentes) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.negro },
        }}
      />
    </>
  );
}
