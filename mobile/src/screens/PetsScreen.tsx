import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import ListState from '../components/ListState';
import ScreenHeader from '../components/ScreenHeader';
import { useRemoteList } from '../hooks/useRemoteList';
import { petService } from '../services/pet.service';
import { commonStyles as styles } from '../theme/commonStyles';

import type { ClientStackParamList } from '../types/navigation';
import { getSizeLabel, type Pet } from '../types/pet';
import { getSpeciesLabel } from '../types/product';

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'Pets'
>;

export default function PetsScreen({ navigation }: Props) {
  const {
    items: pets,
    loading,
    refreshing,
    errorMessage,
    load,
    refresh,
  } = useRemoteList(
    petService.list,
    'Não foi possível carregar seus pets.',
  );

  function renderPet({ item }: { item: Pet }) {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('PetForm', {
            petId: item.id,
          })
        }
        accessibilityRole="button"
        accessibilityLabel={`Editar ${item.name}`}
      >
        <Text style={styles.cardTitle}>{item.name}</Text>

        <Text style={styles.cardText}>
          {getSpeciesLabel(item.species)}
          {item.breed ? ` · ${item.breed}` : ''}
          {` · Porte ${getSizeLabel(item.size)}`}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Meus pets"
        subtitle="Cadastre seus pets para agendar serviços."
        onBack={() => navigation.goBack()}
        actionLabel="Adicionar pet"
        onAction={() => navigation.navigate('PetForm', {})}
      />

      {loading || (errorMessage && pets.length === 0) ? (
        <ListState
          loading={loading}
          errorMessage={errorMessage}
          onRetry={() => {
            void load();
          }}
        />
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={renderPet}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                void refresh();
              }}
              colors={['#2D6CDF']}
              tintColor="#2D6CDF"
            />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyTitle}>
                Nenhum pet cadastrado
              </Text>

              <Text style={styles.emptyText}>
                Adicione seu primeiro pet para agendar um
                serviço.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
