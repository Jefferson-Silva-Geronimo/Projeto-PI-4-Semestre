import { StyleSheet, View } from 'react-native';

import { colors } from '../theme/tokens';

import FeedbackMessage from './FeedbackMessage';

export default function OfflineNotice() {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <FeedbackMessage
        kind="info"
        message="Você está offline. Exibindo dados salvos no aparelho."
        style={styles.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.textPrimary,
  },
  text: {
    color: colors.white,
    fontSize: 13,
    textAlign: 'center',
  },
});
