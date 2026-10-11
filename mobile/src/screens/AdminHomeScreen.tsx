import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import ScreenTitle from '../components/ScreenTitle';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
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

  const indicators = useAdminDashboard();

  const cards = [
    {
      label: 'Pedidos aguardando',
      value: indicators?.pendingOrders,
    },
    {
      label: 'Agendamentos de hoje',
      value: indicators?.todayAppointments,
    },
    {
      label: 'Estoque baixo',
      value: indicators?.lowStockProducts,
    },
  ];

  async function handleLogout(): Promise<void> {
    await signOut();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>
          PETSHOP
        </Text>

        <ScreenTitle style={styles.title}>
          Área administrativa
        </ScreenTitle>

        <Text style={styles.subtitle}>
          Bem-vindo, {user?.name}.
        </Text>

        <View style={styles.indicators}>
          {cards.map((card) => (
            <View
              key={card.label}
              style={styles.indicatorCard}
              accessible
              accessibilityLabel={`${card.label}: ${card.value ?? 'sem dados'}`}
            >
              <Text style={styles.indicatorValue}>
                {card.value ?? '-'}
              </Text>

              <Text style={styles.indicatorLabel}>
                {card.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <AppButton
            size="large"
            label="Gerenciar produtos"
            style={styles.primaryButton}
            onPress={() => navigation.navigate('AdminProducts')}
          />

          <TouchableOpacity
            style={styles.secondaryActionButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AdminOrders')}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryActionTitle}>
              Gerenciar pedidos
            </Text>

            <Text style={styles.secondaryActionDescription}>
              Consulte pedidos e atualize o andamento.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryActionButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AdminServices')}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryActionTitle}>
              Gerenciar serviços
            </Text>

            <Text style={styles.secondaryActionDescription}>
              Cadastre serviços e preços por porte.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryActionButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AdminAgenda')}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryActionTitle}>
              Agenda do dia
            </Text>

            <Text style={styles.secondaryActionDescription}>
              Confirme, conclua ou cancele atendimentos.
            </Text>
          </TouchableOpacity>

          <AppButton
            variant="link"
            label="Sair da conta"
            style={styles.logoutButton}
            onPress={() => {
              void handleLogout();
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flexGrow: 1,
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
  indicators: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 26,
  },
  indicatorCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  indicatorValue: {
    color: '#2D6CDF',
    fontSize: 24,
    fontWeight: '700',
  },
  indicatorLabel: {
    color: '#475569',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  actions: {
    marginTop: 18,
  },
  primaryButton: {
    width: '100%',
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
    marginTop: 12,
  },
});
