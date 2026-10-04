import { useState } from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
} from 'react-native';

import { authStyles } from '../theme/authStyles';

export default function PasswordInput({
  style,
  ...props
}: Omit<TextInputProps, 'secureTextEntry'>) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        style={[authStyles.input, style, styles.input]}
        placeholderTextColor="#64748B"
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={styles.toggle}
        activeOpacity={0.7}
        onPress={() => setVisible((current) => !current)}
        accessibilityRole="button"
        accessibilityLabel={
          visible ? 'Ocultar senha' : 'Mostrar senha'
        }
      >
        <Text style={styles.toggleText}>
          {visible ? 'Ocultar' : 'Mostrar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
  },
  input: {
    paddingRight: 88,
  },
  toggle: {
    position: 'absolute',
    right: 16,
    height: 56,
    justifyContent: 'center',
  },
  toggleText: {
    color: '#2D6CDF',
    fontSize: 14,
    fontWeight: '600',
  },
});
