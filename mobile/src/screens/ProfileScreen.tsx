import {
  useCallback,
} from 'react';

import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { useAuth } from '../hooks/useAuth';
import { commonStyles as styles } from '../theme/commonStyles';

import type { ClientStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'Profile'
>;

export default function ProfileScreen({ navigation }: Props) {
  const { user, signOut, refreshUser } = useAuth();

  useFocusEffect(
    useCallback(() => {
      void refreshUser().catch(() => undefined);
    }, [refreshUser]),
  );

  const shortcuts = [
    {
      label: 'Editar perfil',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      label: 'Meus pets',
      onPress: () => navigation.navigate('Pets'),
    },
    {
      label: 'Meus agendamentos',
      onPress: () => navigation.navigate('Appointments'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.formContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{user?.name}</Text>

          <Text style={styles.cardText}>{user?.email}</Text>

          <Text style={styles.cardText}>
            {user?.phone
              ? user.phone
              : 'Telefone não informado'}
          </Text>
        </View>

        {shortcuts.map((shortcut) => (
          <TouchableOpacity
            key={shortcut.label}
            style={styles.outlineButton}
            activeOpacity={0.8}
            onPress={shortcut.onPress}
            accessibilityRole="button"
          >
            <Text style={styles.outlineButtonText}>
              {shortcut.label}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.dangerButton}
          activeOpacity={0.8}
          onPress={() => {
            void signOut();
          }}
          accessibilityRole="button"
        >
          <Text style={styles.dangerButtonText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
