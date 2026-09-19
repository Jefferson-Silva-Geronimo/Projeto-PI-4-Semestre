import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { useAuth } from '../hooks/useAuth';

import type {
  AdminStackParamList,
} from '../types/navigation';

type Props = NativeStackScreenProps<
  AdminStackParamList,
  'AdminHome'
>;

export default function AdminHomeScreen({
  navigation,
}: Props) {
  const {
    user,
    signOut,
  } = useAuth();

  async function handleLogout(): Promise<void> {
    await signOut();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>
          PETSHOP
        </Text>

        <Text style={styles.title}>
          Área administrativa
        </Text>

        <Text style={styles.subtitle}>
          Bem-vindo, {user?.name}.
        </Text>

        <View style={styles.profileCard}>
          <Text style={styles.profileLabel}>
            Perfil autenticado
          </Text>

          <Text style={styles.profileValue}>
            {user?.role}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AdminProducts')}
            accessibilityRole="button"
            accessibilityLabel="Acessar o gerenciamento de produtos"
          >
            <Text style={styles.primaryButtonText}>
              Gerenciar produtos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryActionButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AdminOrders')}
            accessibilityRole="button"
            accessibilityLabel="Acessar o gerenciamento de pedidos"
          >
            <Text style={styles.secondaryActionTitle}>
              Gerenciar pedidos
            </Text>

            <Text style={styles.secondaryActionDescription}>
              Consulte pedidos e atualize o andamento.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.7}
            onPress={() => {
              void handleLogout();
            }}
            accessibilityRole="button"
            accessibilityLabel="Sair da conta"
          >
            <Text style={styles.logoutText}>
              Sair da conta
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logo: {
    color: '#2D6CDF',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  title: {
    color: '#1E293B',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 18,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 8,
  },
  profileCard: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 26,
  },
  profileLabel: {
    color: '#64748B',
    fontSize: 13,
  },
  profileValue: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  actions: {
    marginTop: 18,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    backgroundColor: '#2D6CDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryActionButton: {
    width: '100%',
    minHeight: 76,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    justifyContent: 'center',
    marginTop: 12,
  },
  secondaryActionTitle: {
    color: '#2D6CDF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryActionDescription: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  logoutButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  logoutText: {
    color: '#2D6CDF',
    fontSize: 15,
    fontWeight: '600',
  },
});
