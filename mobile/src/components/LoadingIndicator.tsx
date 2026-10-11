import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors } from '../theme/tokens';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'small' | 'large';
  showMessage?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function LoadingIndicator({
  message = 'Carregando...',
  size = 'large',
  showMessage = true,
  style,
}: LoadingIndicatorProps) {
  return (
    <View
      style={[styles.container, style]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={message}
      accessibilityState={{ busy: true }}
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator size={size} color={colors.primary} />

      {showMessage ? (
        <Text style={styles.message}>{message}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});
