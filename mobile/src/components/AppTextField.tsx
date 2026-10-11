import { forwardRef, useId, type ReactNode } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { authStyles } from '../theme/authStyles';
import { colors } from '../theme/tokens';

import FeedbackMessage from './FeedbackMessage';

export interface AppTextFieldProps extends TextInputProps {
  label: string;
  helperText?: string;
  errorMessage?: string;
  rightAccessory?: ReactNode;
}

const AppTextField = forwardRef<TextInput, AppTextFieldProps>(
  function AppTextField(
    {
      label,
      helperText,
      errorMessage,
      rightAccessory,
      style,
      editable = true,
      multiline,
      ...props
    },
    ref,
  ) {
    const labelId = useId();
    const android = Platform.OS === 'android';

    return (
      <View style={styles.container}>
        <Text
          nativeID={labelId}
          accessible={Platform.OS !== 'ios'}
          style={styles.label}
        >
          {label}
        </Text>

        <View>
          <TextInput
            ref={ref}
            {...props}
            editable={editable}
            multiline={multiline}
            placeholderTextColor={colors.textMuted}
            style={[
              authStyles.input,
              multiline ? styles.multiline : undefined,
              rightAccessory ? styles.withAccessory : undefined,
              errorMessage ? authStyles.inputError : undefined,
              !editable ? authStyles.inputDisabled : undefined,
              style,
            ]}
            accessibilityLabel={android ? undefined : label}
            accessibilityLabelledBy={android ? labelId : undefined}
            accessibilityHint={helperText}
            accessibilityState={{ disabled: !editable }}
          />

          {rightAccessory ? (
            <View style={styles.accessory}>{rightAccessory}</View>
          ) : null}
        </View>

        {errorMessage ? (
          <FeedbackMessage kind="error" message={errorMessage} />
        ) : helperText ? (
          <Text style={styles.helper}>{helperText}</Text>
        ) : null}
      </View>
    );
  },
);

export default AppTextField;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 6,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  multiline: {
    minHeight: 96,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  withAccessory: {
    paddingRight: 96,
  },
  accessory: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  helper: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
