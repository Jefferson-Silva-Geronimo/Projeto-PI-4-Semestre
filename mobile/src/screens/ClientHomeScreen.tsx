import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '../hooks/useAuth';
import { authStyles as styles } from '../theme/authStyles';

export default function ClientHomeScreen() {
  const {
    user,
    signOut,
  } = useAuth();

  async function handleLogout() {
    await signOut();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>
          PETSHOP
        </Text>

        <Text style={styles.title}>
          Área do cliente
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
            onPress={handleLogout}
            accessibilityRole="button"
            accessibilityLabel="Sair da conta"
          >
            <Text style={styles.buttonText}>
              Sair
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}