import { View } from 'react-native';

import { commonStyles as styles } from '../theme/commonStyles';

import AppButton from './AppButton';
import FeedbackMessage from './FeedbackMessage';
import LoadingIndicator from './LoadingIndicator';

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
        <LoadingIndicator showMessage={false} />
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      <FeedbackMessage
        kind="error"
        message={errorMessage}
        style={styles.errorText}
      />

      <AppButton label="Tentar novamente" onPress={onRetry} />
    </View>
  );
}
