import { lightColors, darkColors } from "@/theme/colors";
import { AnimationType, EasingType } from "./types";

// Re-export para compatibilidade
export { lightColors, darkColors };

// Default animation settings
export const DEFAULT_ANIMATION_DURATION = 600;
export const DEFAULT_ANIMATION_TYPE = AnimationType.Circular;
export const DEFAULT_SWITCH_DELAY = 80;
export const DEFAULT_EASING = EasingType.EaseInOut;
