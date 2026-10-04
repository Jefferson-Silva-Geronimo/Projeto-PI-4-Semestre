import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function OfflineNotice() {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.text}>
        Você está offline. Exibindo dados salvos no aparelho.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#1E293B',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    textAlign: 'center',
  },
});
