import { Text, View } from 'react-native';

import { commonStyles as styles } from '../theme/commonStyles';

import AppButton from './AppButton';
import BackButton from './BackButton';
import ScreenTitle from './ScreenTitle';

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
      <BackButton onPress={onBack} />

      <ScreenTitle style={styles.title}>{title}</ScreenTitle>

      {subtitle ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
      ) : null}

      {actionLabel && onAction ? (
        <AppButton
          label={actionLabel}
          onPress={onAction}
          style={{ alignSelf: 'flex-start', marginTop: 14 }}
        />
      ) : null}
    </View>
  );
}
