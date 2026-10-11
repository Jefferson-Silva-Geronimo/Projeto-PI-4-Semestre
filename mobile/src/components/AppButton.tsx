import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, sizes } from '../theme/tokens';

export type AppButtonVariant = 'primary' | 'outline' | 'danger' | 'link';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  size?: 'regular' | 'large';
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

export default function AppButton({
  label,
  onPress,
  variant = 'primary',
  size = 'regular',
  loading = false,
  loadingLabel,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  style,
}: AppButtonProps) {
  const inactive = disabled || loading;
  const visibleLabel = loading && loadingLabel ? loadingLabel : label;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        size === 'large' ? styles.large : undefined,
        variantStyles[variant],
        inactive ? inactiveStyles[variant] : undefined,
        style,
      ]}
      activeOpacity={0.8}
      disabled={inactive}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
    >
      <Text
        style={[
          styles.text,
          textStyles[variant],
          inactive ? styles.textInactive : undefined,
        ]}
      >
        {visibleLabel}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: sizes.minTouch,
    paddingHorizontal: 20,
    borderRadius: sizes.radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  large: {
    minHeight: sizes.controlHeight,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  textInactive: {
    color: colors.disabledText,
  },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.primary },
  outline: { borderWidth: 1, borderColor: colors.primary },
  danger: { borderWidth: 1, borderColor: colors.error },
  link: { paddingHorizontal: 12 },
});

const inactiveStyles = StyleSheet.create({
  primary: { backgroundColor: colors.disabledBackground },
  outline: { borderColor: colors.disabledBorder },
  danger: { borderColor: colors.disabledBorder },
  link: {},
});

const textStyles = StyleSheet.create({
  primary: { color: colors.white },
  outline: { color: colors.primary },
  danger: { color: colors.error },
  link: { color: colors.primary, fontWeight: '600' },
});
