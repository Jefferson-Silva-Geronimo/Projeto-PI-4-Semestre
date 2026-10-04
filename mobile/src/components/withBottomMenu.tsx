import type { ComponentType } from 'react';

import { View } from 'react-native';

import type { NavigationProp } from '@react-navigation/native';

import type { ClientStackParamList } from '../types/navigation';

import BottomMenu, { type MenuTab } from './BottomMenu';

export function withBottomMenu<
  P extends {
    navigation: NavigationProp<ClientStackParamList>;
  },
>(Screen: ComponentType<P>, current: MenuTab) {
  return function ScreenWithMenu(props: P) {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Screen {...props} />
        </View>

        <BottomMenu
          current={current}
          navigation={props.navigation}
        />
      </View>
    );
  };
}
