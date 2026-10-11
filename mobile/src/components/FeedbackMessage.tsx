import { useEffect } from 'react';

import {
  AccessibilityInfo,
  Platform,
  StyleSheet,
  Text,
  type StyleProp,
  type TextStyle,
} from 'react-native';

import { colors } from '../theme/tokens';

export type FeedbackKind = 'error' | 'success' | 'info';

interface FeedbackMessageProps {
  kind: FeedbackKind;
  message: string;
  style?: StyleProp<TextStyle>;
}

export default function FeedbackMessage({
  kind,
  message,
  style,
}: FeedbackMessageProps) {
  useEffect(() => {
    if (message && Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibility(message);
    }
  }, [message]);

  if (!message) {
    return null;
  }

  return (
    <Text
      style={[styles.base, kindStyles[kind], style]}
      accessibilityRole={kind === 'error' ? 'alert' : undefined}
      accessibilityLiveRegion={kind === 'error' ? 'assertive' : 'polite'}
    >
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontSize: 14,
    lineHeight: 20,
  },
});

const kindStyles = StyleSheet.create({
  error: { color: colors.error },
  success: { color: colors.success },
  info: { color: colors.textSecondary },
});
