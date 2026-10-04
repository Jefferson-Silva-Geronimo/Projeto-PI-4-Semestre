import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { commonStyles as styles } from '../theme/commonStyles';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  actionLabel,
  onAction,
}: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
      >
        <Text style={styles.backText}>‹ Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      {subtitle ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
      ) : null}

      {actionLabel && onAction ? (
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { alignSelf: 'flex-start', marginTop: 14 },
          ]}
          activeOpacity={0.8}
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={styles.primaryButtonText}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
