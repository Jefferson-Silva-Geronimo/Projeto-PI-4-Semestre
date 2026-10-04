import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { commonStyles as styles } from '../theme/commonStyles';

interface ListStateProps {
  loading: boolean;
  errorMessage: string;
  onRetry: () => void;
}

export default function ListState({
  loading,
  errorMessage,
  onRetry,
}: ListStateProps) {
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2D6CDF" />
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      <Text
        style={styles.errorText}
        accessibilityRole="alert"
      >
        {errorMessage}
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        activeOpacity={0.8}
        onPress={onRetry}
      >
        <Text style={styles.primaryButtonText}>
          Tentar novamente
        </Text>
      </TouchableOpacity>
    </View>
  );
}
