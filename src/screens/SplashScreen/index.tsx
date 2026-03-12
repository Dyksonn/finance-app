import GooeyText from "@/components/molecules/gooey-text";
import { StaggeredText } from "@/components/organisms/animated-text";
import { FadeText } from "@/components/organisms/fade-text";
import type { RootStackParamList } from "@/routes/types";
import { splash } from "@/theme/colors";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { width: W } = Dimensions.get("window");

export default function SplashScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowSubtitle(true), 1500);
    const t2 = setTimeout(() => setShowTagline(true), 2500);
    const t3 = setTimeout(
      () => navigation.replace("Tabs", { screen: "Gastos" }),
      4000,
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [navigation]);

  return (
    <LinearGradient
      colors={[splash.gradientStart, splash.gradientMid, splash.gradientEnd]}
      style={styles.container}
    >
      <GooeyText
        texts={["Finance", "Vidas", "Seguras"]}
        fontSize={52}
        color={splash.accent}
        width={W * 0.8}
        height={80}
        fontWeight="bold"
      />

      {showSubtitle && (
        <View style={styles.subtitleRow}>
          <StaggeredText text="D  Y  K  V  S" style={styles.subtitle} />
        </View>
      )}

      {showTagline && (
        <FadeText
          inputs={["Controle suas finanças com inteligência"]}
          fontSize={15}
          color={splash.tagline}
          fontWeight="400"
          wordDelay={120}
          duration={600}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  subtitleRow: {
    alignItems: "center",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "700",
    color: splash.subtitle,
    letterSpacing: 8,
  },
});
