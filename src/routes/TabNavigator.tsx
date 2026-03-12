/**
 * src/routes/TabNavigator.tsx
 *
 * Bottom Tab Navigator — migrado de src/app/(tabs)/_layout.tsx
 *
 * Mapeamento:
 *   Tabs.Screen name="empresas"      → screen "Empresas"
 *   Tabs.Screen name="gastos"        → screen "Gastos"
 *   Tabs.Screen name="configuracoes" → screen "Configuracoes"
 */

import { useTheme } from "@/components/organisms/theme-switch/hooks";
import CompaniesScreen from "@/screens/CompaniesScreen";
import ConfigurationScreen from "@/screens/ConfigurationScreen";
import ExpensesScreen from "@/screens/ExpensesScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text } from "react-native";
import type { TabParamList } from "./types";

const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={[styles.icon, focused && styles.iconFocused]}>{emoji}</Text>
  );
}

export default function TabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Gastos"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Empresas"
        component={CompaniesScreen}
        options={{
          title: "Empresas",
          tabBarIcon: ({ focused }) => <TabIcon emoji="💼" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Gastos"
        component={ExpensesScreen}
        options={{
          title: "Gastos",
          tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Configuracoes"
        component={ConfigurationScreen}
        options={{
          title: "Config",
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: { fontSize: 20, opacity: 0.6 },
  iconFocused: { opacity: 1 },
});
