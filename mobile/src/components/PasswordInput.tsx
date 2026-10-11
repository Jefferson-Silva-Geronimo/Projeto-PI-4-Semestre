import { forwardRef, useState } from 'react';

import {
  AccessibilityInfo,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { colors, sizes } from '../theme/tokens';

import AppTextField, { type AppTextFieldProps } from './AppTextField';

type PasswordInputProps = Omit<
  AppTextFieldProps,
  'secureTextEntry' | 'rightAccessory'
>;

const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false);

  const toggle = () => {
    const next = !visible;

    setVisible(next);
    AccessibilityInfo.announceForAccessibility(
      next ? 'Senha visível' : 'Senha oculta',
    );
  };

  return (
    <AppTextField
      ref={ref}
      {...props}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      rightAccessory={
        <TouchableOpacity
          style={styles.toggle}
          activeOpacity={0.7}
          onPress={toggle}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
        >
          <Text style={styles.toggleText}>
            {visible ? 'Ocultar' : 'Mostrar'}
          </Text>
        </TouchableOpacity>
      }
    />
  );
});

export default PasswordInput;

const styles = StyleSheet.create({
  toggle: {
    minWidth: 72,
    minHeight: sizes.minTouch,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  toggleText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
