import {
  AlegreyaSans_400Regular,
  AlegreyaSans_400Regular_Italic,
  AlegreyaSans_500Medium,
  AlegreyaSans_700Bold,
} from '@expo-google-fonts/alegreya-sans';
import { Cinzel_600SemiBold, Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { Kalam_400Regular } from '@expo-google-fonts/kalam';
import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';

import { colors } from '@/theme/theme';

// Der Splash-Screen bleibt sichtbar, bis die Schriften geladen sind.
// So sieht man nie kurz die falsche Schrift aufblitzen.
SplashScreen.preventAutoHideAsync();

// Navigations-Theme: dunkle Farben aus unseren Tokens, damit beim
// Wechseln zwischen Screens nichts weiß aufblitzt.
const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.night,
    card: colors.forest,
    text: colors.moon,
    border: colors.moss,
    primary: colors.rune,
  },
};

export default function RootLayout() {
  const ruhig = useReducedMotion();
  const [fontsLoaded, fontError] = useFonts({
    Cinzel_600SemiBold,
    Cinzel_700Bold,
    AlegreyaSans_400Regular,
    AlegreyaSans_400Regular_Italic,
    AlegreyaSans_500Medium,
    AlegreyaSans_700Bold,
    Kalam_400Regular, // nur Lehrbuch-Zeichnungen
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.night }}>
      <ThemeProvider value={navTheme}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.night },
            animation: ruhig ? 'none' : 'fade', // sanfte Übergänge – aus bei "Bewegung reduzieren"
          }}
        >
          {/* Sammeln öffnet sich als Vollbild von unten und ist ein eigener Moment */}
          <Stack.Screen
            name="sammeln/[id]"
            options={{ presentation: 'fullScreenModal', animation: ruhig ? 'none' : 'slide_from_bottom' }}
          />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
