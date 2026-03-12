/**
 * src/routes/types.ts
 *
 * Tipagem estrita para todos os navegadores e telas do app.
 *
 * Mapeamento expo-router → react-navigation:
 *   src/app/index.tsx           → RootStack "Splash"
 *   src/app/(tabs)/_layout.tsx  → RootStack "Tabs" (TabNavigator)
 *   src/app/(tabs)/empresas.tsx → TabParamList "Empresas"
 *   src/app/(tabs)/gastos.tsx   → TabParamList "Gastos"
 *   src/app/(tabs)/configuracoes.tsx → TabParamList "Configuracoes"
 */

import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// ── Tab Navigator ────────────────────────────────────────────────────────────

export type TabParamList = {
  Empresas: undefined;
  Gastos: undefined;
  Configuracoes: undefined;
};

// ── Root Stack Navigator ─────────────────────────────────────────────────────

export type RootStackParamList = {
  Splash: undefined;
  Tabs: NavigatorScreenParams<TabParamList>;
};

// ── Screen props helpers ─────────────────────────────────────────────────────

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> =
  BottomTabScreenProps<TabParamList, T>;
