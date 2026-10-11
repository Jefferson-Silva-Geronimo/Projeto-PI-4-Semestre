import {
  useCallback,
} from 'react';

import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import ScreenTitle from '../components/ScreenTitle';
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

  const phoneText = user?.phone
    ? user.phone
    : 'Telefone não informado';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ScreenTitle style={styles.title}>Perfil</ScreenTitle>
      </View>

      <ScrollView contentContainerStyle={styles.formContent}>
        <View
          style={styles.card}
          accessible
          accessibilityLabel={`${user?.name}, ${user?.email}, ${phoneText}`}
        >
          <Text style={styles.cardTitle}>{user?.name}</Text>

          <Text style={styles.cardText}>{user?.email}</Text>

          <Text style={styles.cardText}>{phoneText}</Text>
        </View>

        {shortcuts.map((shortcut) => (
          <AppButton
            key={shortcut.label}
            variant="outline"
            label={shortcut.label}
            onPress={shortcut.onPress}
          />
        ))}

        <AppButton
          variant="danger"
          label="Sair"
          onPress={() => {
            void signOut();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
