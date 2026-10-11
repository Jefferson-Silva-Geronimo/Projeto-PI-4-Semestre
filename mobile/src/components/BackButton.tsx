import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { colors, sizes } from '../theme/tokens';

interface BackButtonProps {
  onPress: () => void;
  label?: string;
  accessibilityLabel?: string;
}

export default function BackButton({
  onPress,
  label = 'Voltar',
  accessibilityLabel,
}: BackButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <Text style={styles.text}>{`‹ ${label}`}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: sizes.minTouch,
    minWidth: sizes.minTouch,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    paddingRight: 16,
    marginBottom: 4,
  },
  text: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});
