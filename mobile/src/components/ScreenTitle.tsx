import { useCallback, useRef } from 'react';

import {
  AccessibilityInfo,
  findNodeHandle,
  Platform,
  Text,
  type StyleProp,
  type TextStyle,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

interface ScreenTitleProps {
  children: string;
  style?: StyleProp<TextStyle>;
}

export default function ScreenTitle({
  children,
  style,
}: ScreenTitleProps) {
  const ref = useRef<Text>(null);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'web') {
        return undefined;
      }

      const timer = setTimeout(() => {
        const node = findNodeHandle(ref.current);

        if (node) {
          AccessibilityInfo.setAccessibilityFocus(node);
        }
      }, 350);

      return () => clearTimeout(timer);
    }, []),
  );

  return (
    <Text ref={ref} accessible accessibilityRole="header" style={style}>
      {children}
    </Text>
  );
}
