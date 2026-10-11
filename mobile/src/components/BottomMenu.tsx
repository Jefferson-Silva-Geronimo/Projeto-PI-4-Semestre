import {
  useCallback,
  useState,
} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  StackActions,
  useFocusEffect,
  type NavigationProp,
} from '@react-navigation/native';

import { cartService } from '../services/cart.service';
import { colors } from '../theme/tokens';

import type { ClientStackParamList } from '../types/navigation';

export type MenuTab =
  | 'ClientHome'
  | 'Services'
  | 'Cart'
  | 'Orders'
  | 'Profile';

const tabs: Array<{ route: MenuTab; label: string }> = [
  { route: 'ClientHome', label: 'Início' },
  { route: 'Services', label: 'Serviços' },
  { route: 'Cart', label: 'Carrinho' },
  { route: 'Orders', label: 'Pedidos' },
  { route: 'Profile', label: 'Perfil' },
];

interface BottomMenuProps {
  current: MenuTab;
  navigation: NavigationProp<ClientStackParamList>;
}

export default function BottomMenu({
  current,
  navigation,
}: BottomMenuProps) {
  const [cartCount, setCartCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      cartService
        .get()
        .then((cart) => setCartCount(cart.totalItems))
        .catch(() => setCartCount(0));
    }, []),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container} accessibilityRole="tablist">
        {tabs.map((tab) => {
          const selected = tab.route === current;
          const cartLabel =
            tab.route === 'Cart' && cartCount > 0
              ? `Carrinho, ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`
              : undefined;

          return (
            <TouchableOpacity
              key={tab.route}
              style={styles.tab}
              activeOpacity={0.7}
              onPress={() => {
                if (!selected) {
                  navigation.dispatch(
                    StackActions.replace(tab.route),
                  );
                }
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={cartLabel}
            >
              <Text
                numberOfLines={1}
                maxFontSizeMultiplier={1.3}
                style={[
                  styles.label,
                  selected ? styles.labelSelected : undefined,
                ]}
              >
                {tab.label}
              </Text>

              {tab.route === 'Cart' && cartCount > 0 ? (
                <View
                  style={styles.badge}
                  importantForAccessibility="no-hide-descendants"
                  accessibilityElementsHidden
                >
                  <Text style={styles.badgeText}>
                    {cartCount}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  container: {
    flexDirection: 'row',
    minHeight: 56,
  },
  tab: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  labelSelected: {
    color: '#2D6CDF',
  },
  badge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: '#2D6CDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
