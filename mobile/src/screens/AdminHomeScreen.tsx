import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAuth } from '../hooks/useAuth';
import { authStyles as styles } from '../theme/authStyles';

import type { AdminStackParamList } from '../types/navigation';

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

  async function handleLogout() {
    await signOut();
  }

  function handleOpenProducts() {
    navigation.navigate('AdminProducts');
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

        <View style={styles.form}>
          <Text style={styles.helperText}>
            Perfil autenticado: {user?.role}
          </Text>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handleOpenProducts}
            accessibilityRole="button"
            accessibilityLabel="Acessar o gerenciamento de produtos"
          >
            <Text style={styles.buttonText}>
              Gerenciar produtos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleLogout}
            accessibilityRole="button"
            accessibilityLabel="Sair da conta"
          >
            <Text style={styles.link}>
              Sair da conta
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}