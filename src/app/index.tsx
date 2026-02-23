import GooeyText from "@/components/molecules/gooey-text";
import { StaggeredText } from "@/components/organisms/animated-text";
import { FadeText } from "@/components/organisms/fade-text";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { width: W } = Dimensions.get("window");

export default function SplashScreen() {
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowSubtitle(true), 1500);
    const t2 = setTimeout(() => setShowTagline(true), 2500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t3 = setTimeout(() => router.replace("/(tabs)/gastos" as any), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <LinearGradient
      colors={["#0A0A0F", "#1A1035", "#0A0A0F"]}
      style={styles.container}
    >
      <GooeyText
        texts={["Finance", "Finance"]}
        fontSize={52}
        color="#6C5CE7"
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
          color="#A0A0B2"
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
    color: "#F2F2F7",
    letterSpacing: 8,
  },
});
