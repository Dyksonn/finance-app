/**
 * src/routes/index.tsx
 *
 * Arquivo raiz de navegação. Exporta o componente <Routes /> que:
 * - Envolve toda a árvore com NavigationContainer
 * - Fornece os providers globais (GestureHandler, Theme, BottomSheetStack)
 * - Controla a splash screen nativa via expo-splash-screen (onReady)
 * - Carrega o tema salvo antes de renderizar a navegação
 */

import {
  ThemeMode,
  ThemeProvider,
} from "@/components/organisms/theme-switch/context";
import { BottomSheetStackProvider } from "@/components/templates/bottom-sheet-stack";
import { getTheme, saveTheme } from "@/storage/asyncStorage";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import StackNavigator from "./StackNavigator";

SplashScreen.preventAutoHideAsync();

export default function Routes() {
  const [defaultTheme, setDefaultTheme] = useState<ThemeMode>(ThemeMode.Dark);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getTheme()
      .then((saved) => {
        setDefaultTheme(saved === "light" ? ThemeMode.Light : ThemeMode.Dark);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const onReady = useCallback(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider
        defaultTheme={defaultTheme}
        onThemeChange={(theme) => saveTheme(theme)}
      >
        <BottomSheetStackProvider>
          <NavigationContainer onReady={onReady}>
            <StackNavigator />
          </NavigationContainer>
        </BottomSheetStackProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
