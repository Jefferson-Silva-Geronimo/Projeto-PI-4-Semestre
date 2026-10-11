import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors, sizes } from '../theme/tokens';

interface ChipOption<T extends string> {
  value: T;
  label: string;
  accessibilityLabel?: string;
}

interface ChipGroupProps<T extends string> {
  options: ChipOption<T>[];
  selected: T | null;
  onSelect: (value: T | null) => void;
  groupLabel?: string;
  allowClear?: boolean;
  allLabel?: string;
  disabled?: boolean;
}

export default function ChipGroup<T extends string>({
  options,
  selected,
  onSelect,
  groupLabel,
  allowClear = false,
  allLabel = 'Todos',
  disabled = false,
}: ChipGroupProps<T>) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={groupLabel}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {allowClear ? (
          <TouchableOpacity
            style={[
              styles.chip,
              selected === null ? styles.chipSelected : undefined,
            ]}
            activeOpacity={0.8}
            disabled={disabled}
            onPress={() => onSelect(null)}
            accessibilityRole="radio"
            accessibilityState={{
              checked: selected === null,
              disabled,
            }}
          >
            <Text
              style={[
                styles.chipText,
                selected === null ? styles.chipTextSelected : undefined,
              ]}
            >
              {allLabel}
            </Text>
          </TouchableOpacity>
        ) : null}

        {options.map((option) => {
          const isSelected = selected === option.value;

          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : undefined,
              ]}
              activeOpacity={0.8}
              disabled={disabled}
              onPress={() => onSelect(option.value)}
              accessibilityRole="radio"
              accessibilityLabel={option.accessibilityLabel}
              accessibilityState={{ checked: isSelected, disabled }}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected ? styles.chipTextSelected : undefined,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    minHeight: sizes.minTouch,
    minWidth: sizes.minTouch,
    paddingHorizontal: 16,
    borderRadius: sizes.radius,
    borderWidth: 1,
    borderColor: colors.borderControl,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: colors.white,
  },
});
