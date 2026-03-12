/**
 * Design Tokens e temas centralizados (design-tokens skill).
 * Tokens = valores primitivos | Theme = mapeamento semântico
 */

// --- Tokens primitivos (raw) ---

export const neutral = {
  50: "#FAFAFA",
  100: "#F5F5F5",
  200: "#E5E5E5",
  300: "#D4D4D4",
  400: "#A3A3A3",
  500: "#71717A",
  600: "#52525B",
  700: "#3F3F46",
  800: "#27272A",
  900: "#18181B",
} as const;

export const primary = {
  50: "#EFF6FF",
  100: "#DBEAFE",
  200: "#BFDBFE",
  300: "#93C5FD",
  400: "#60A5FA",
  500: "#3B82F6",
  600: "#2563EB",
  700: "#1D4ED8",
  800: "#1E40AF",
  900: "#1E3A8A",
} as const;

export const semantic = {
  success: "#10B981",
  successLight: "#34D399",
  error: "#EF4444",
  errorLight: "#F87171",
  warning: "#F59E0B",
  warningLight: "#FBBF24",
  info: "#3B82F6",
  infoLight: "#60A5FA",
} as const;

export const splash = {
  gradientStart: "#0A0A0F",
  gradientMid: "#1A1035",
  gradientEnd: "#0A0A0F",
  accent: "#6C5CE7",
  subtitle: "#F2F2F7",
  tagline: "#A0A0B2",
} as const;

// Overlay/backdrop (uso em dialogs, modals)
export const overlay = {
  light: "rgba(0, 0, 0, 0.5)",
  dark: "rgba(0, 0, 0, 0.6)",
} as const;

// --- Tema semântico (light/dark) ---

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  muted: string;
  mutedForeground: string;
  success: string;
  warning: string;
  info: string;
  overlay: string;
}

export const lightTheme: ThemeColors = {
  background: "#FFFFFF",
  foreground: "#000000",
  card: "#F5F5F5",
  text: "#1A1A1A",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  primary: primary[500],
  primaryForeground: "#FFFFFF",
  secondary: neutral[600],
  secondaryForeground: "#FFFFFF",
  accent: "#8B5CF6",
  accentForeground: "#FFFFFF",
  destructive: semantic.error,
  destructiveForeground: "#FFFFFF",
  muted: "#F3F4F6",
  mutedForeground: neutral[600],
  success: semantic.success,
  warning: semantic.warning,
  info: primary[500],
  overlay: overlay.light,
};

export const darkTheme: ThemeColors = {
  background: "#0A0A0A",
  foreground: "#FAFAFA",
  card: "#1A1A1A",
  text: "#FAFAFA",
  textSecondary: "#A1A1AA",
  border: "#27272A",
  primary: primary[400],
  primaryForeground: "#0A0A0A",
  secondary: neutral[400],
  secondaryForeground: "#0A0A0A",
  accent: "#A78BFA",
  accentForeground: "#0A0A0A",
  destructive: semantic.errorLight,
  destructiveForeground: "#0A0A0A",
  muted: "#1F1F23",
  mutedForeground: neutral[400],
  success: semantic.successLight,
  warning: semantic.warningLight,
  info: primary[400],
  overlay: overlay.dark,
};

// Aliases para compatibilidade com theme-switch/conf
export const lightColors = lightTheme;
export const darkColors = darkTheme;
