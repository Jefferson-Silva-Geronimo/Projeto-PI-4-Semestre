import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { useAuth } from '../hooks/useAuth';

import AuthNavigator from './AuthNavigator';
import ClientNavigator from './ClientNavigator';
import AdminNavigator from './AdminNavigator';

function SessionLoadingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>
          PETSHOP
        </Text>

        <ActivityIndicator
          size="large"
          color="#2D6CDF"
        />

        <Text style={styles.message}>
          Verificando sua sessão...
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default function RootNavigator() {
  const {
    user,
    isAuthenticated,
    isLoadingSession,
  } = useAuth();

  if (isLoadingSession) {
    return <SessionLoadingScreen />;
  }

  return (
    <NavigationContainer>
      {!isAuthenticated || !user ? (
        <AuthNavigator />
      ) : user.role === 'ADMIN' ? (
        <AdminNavigator />
      ) : (
        <ClientNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 24,
  },

  logo: {
    color: '#2D6CDF',
    fontSize: 32,
    fontWeight: '700',
  },

  message: {
    color: '#475569',
    fontSize: 16,
    textAlign: 'center',
  },
});