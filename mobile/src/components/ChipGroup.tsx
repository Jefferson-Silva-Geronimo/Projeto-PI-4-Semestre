import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

interface ChipOption<T extends string> {
  value: T;
  label: string;
}

interface ChipGroupProps<T extends string> {
  options: ChipOption<T>[];
  selected: T | null;
  onSelect: (value: T | null) => void;
  allowClear?: boolean;
  allLabel?: string;
  disabled?: boolean;
}

export default function ChipGroup<T extends string>({
  options,
  selected,
  onSelect,
  allowClear = false,
  allLabel = 'Todos',
  disabled = false,
}: ChipGroupProps<T>) {
  return (
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
            selected === null
              ? styles.chipSelected
              : undefined,
          ]}
          activeOpacity={0.8}
          disabled={disabled}
          onPress={() => onSelect(null)}
          accessibilityRole="button"
          accessibilityState={{
            selected: selected === null,
          }}
        >
          <Text
            style={[
              styles.chipText,
              selected === null
                ? styles.chipTextSelected
                : undefined,
            ]}
          >
            {allLabel}
          </Text>
        </TouchableOpacity>
      ) : null}

      {options.map((option) => {
        const isSelected =
          selected === option.value;

        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.chip,
              isSelected
                ? styles.chipSelected
                : undefined,
            ]}
            activeOpacity={0.8}
            disabled={disabled}
            onPress={() => onSelect(option.value)}
            accessibilityRole="button"
            accessibilityState={{
              selected: isSelected,
            }}
          >
            <Text
              style={[
                styles.chipText,
                isSelected
                  ? styles.chipTextSelected
                  : undefined,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: '#2D6CDF',
    backgroundColor: '#2D6CDF',
  },
  chipText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
});
