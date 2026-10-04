import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

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
        <View style={styles.step}>
          <View style={[styles.dot, styles.dotCancelled]} />

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

        return (
          <View key={step} style={styles.step}>
            <View
              style={[
                styles.dot,
                reached ? styles.dotReached : undefined,
              ]}
            />

            <Text
              style={[
                styles.label,
                reached ? styles.labelReached : undefined,
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    marginTop: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#CBD5E1',
  },
  dotReached: {
    backgroundColor: '#2D6CDF',
  },
  dotCancelled: {
    backgroundColor: '#DC2626',
  },
  label: {
    color: '#64748B',
    fontSize: 14,
  },
  labelReached: {
    color: '#1E293B',
    fontWeight: '600',
  },
  labelCancelled: {
    color: '#DC2626',
    fontWeight: '600',
  },
});
