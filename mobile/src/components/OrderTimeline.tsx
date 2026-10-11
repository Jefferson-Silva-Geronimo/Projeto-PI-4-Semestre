import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/tokens';
import {
  orderStatusLabels,
  type OrderStatus,
} from '../types/order';

const steps: OrderStatus[] = [
  'PENDING_PAYMENT',
  'CONFIRMED',
  'PROCESSING',
  'COMPLETED',
];

export default function OrderTimeline({
  status,
}: {
  status: OrderStatus;
}) {
  if (status === 'CANCELLED') {
    return (
      <View style={styles.container}>
        <View
          style={styles.step}
          accessible
          accessibilityLabel={orderStatusLabels.CANCELLED}
        >
          <View
            style={[styles.dot, styles.dotCancelled]}
            importantForAccessibility="no"
          >
            <Text style={styles.glyph} importantForAccessibility="no">
              ✕
            </Text>
          </View>

          <Text style={[styles.label, styles.labelCancelled]}>
            {orderStatusLabels.CANCELLED}
          </Text>
        </View>
      </View>
    );
  }

  const currentIndex = steps.indexOf(status);

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const reached = index <= currentIndex;
        const current = index === currentIndex;
        const stateLabel = current
          ? 'etapa atual'
          : reached
            ? 'concluída'
            : 'pendente';

        return (
          <View
            key={step}
            style={styles.step}
            accessible
            accessibilityLabel={`${orderStatusLabels[step]}, ${stateLabel}`}
          >
            <View
              style={[
                styles.dot,
                reached ? styles.dotReached : styles.dotPending,
              ]}
              importantForAccessibility="no"
            >
              {reached ? (
                <Text style={styles.glyph} importantForAccessibility="no">
                  ✓
                </Text>
              ) : null}
            </View>

            <Text
              style={[
                styles.label,
                reached ? styles.labelReached : undefined,
                current ? styles.labelCurrent : undefined,
              ]}
            >
              {orderStatusLabels[step]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderCard,
    gap: 12,
    marginTop: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotReached: {
    backgroundColor: colors.primary,
  },
  dotPending: {
    borderWidth: 2,
    borderColor: colors.borderControl,
    backgroundColor: colors.white,
  },
  dotCancelled: {
    backgroundColor: colors.error,
  },
  glyph: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
  },
  labelReached: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  labelCurrent: {
    fontWeight: '700',
  },
  labelCancelled: {
    color: colors.error,
    fontWeight: '600',
  },
});
