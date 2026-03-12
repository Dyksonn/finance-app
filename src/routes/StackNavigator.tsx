/**
 * src/routes/StackNavigator.tsx
 *
 * Root Stack Navigator — migrado de src/app/_layout.tsx
 *
 * Mapeamento:
 *   src/app/index.tsx (rota "/")          → screen "Splash"
 *   src/app/(tabs)/_layout.tsx (grupo)    → screen "Tabs" (TabNavigator)
 */

import SplashScreen from "@/screens/SplashScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
    </Stack.Navigator>
  );
}
