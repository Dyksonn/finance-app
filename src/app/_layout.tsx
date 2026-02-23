import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, ThemeMode } from '@/components/organisms/theme-switch/context';
import { BottomSheetStackProvider } from '@/components/templates/bottom-sheet-stack';
import { getTheme, saveTheme } from '@/storage/asyncStorage';

export default function RootLayout() {
  const [defaultTheme, setDefaultTheme] = useState<ThemeMode>(ThemeMode.Dark);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getTheme()
      .then((saved) => {
        setDefaultTheme(saved === 'light' ? ThemeMode.Light : ThemeMode.Dark);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider
        defaultTheme={defaultTheme}
        onThemeChange={(theme) => saveTheme(theme)}
      >
        <BottomSheetStackProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </BottomSheetStackProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
