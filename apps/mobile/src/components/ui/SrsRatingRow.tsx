import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppPressable } from './AppPressable';
import type { ReviewRating } from '@hoc-cung-bee/features';
import { useTheme } from '../../theme/ThemeContext';

const RATINGS: {
  label: string;
  rating: ReviewRating;
  lightBg: string;
  lightText: string;
}[] = [
  { label: 'Again', rating: 'again', lightBg: '#FCEBEB', lightText: '#A32D2D' },
  { label: 'Hard', rating: 'hard', lightBg: '#FAEEDA', lightText: '#854F0B' },
  { label: 'Good', rating: 'good', lightBg: '#EAF3DE', lightText: '#3B6D11' },
  { label: 'Easy', rating: 'easy', lightBg: '#E6F1FB', lightText: '#185FA5' },
];

type Props = {
  onRate: (rating: ReviewRating) => void;
  disabled?: boolean;
  /** Đổi khi sang từ/câu mới — bỏ chọn & mở lại 4 nút */
  resetKey?: string | number;
};

export function SrsRatingRow({ onRate, disabled, resetKey }: Props) {
  const { colors, tokens, isDark } = useTheme();
  const [selected, setSelected] = useState<ReviewRating | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [resetKey]);

  function handlePress(rating: ReviewRating) {
    if (disabled || selected !== null) return;
    setSelected(rating);
    onRate(rating);
  }

  return (
    <View style={styles.row}>
      {RATINGS.map((r) => {
        let bg = r.lightBg;
        let text = r.lightText;
        if (isDark) {
          if (r.rating === 'again') {
            bg = colors.surface.accent;
            text = colors.surface.accentText;
          } else if (r.rating === 'hard') {
            bg = colors.surface.accent;
            text = colors.surface.accentText;
          } else if (r.rating === 'good') {
            bg = colors.surface.success;
            text = colors.surface.successText;
          } else {
            bg = colors.surface.info;
            text = colors.surface.infoText;
          }
        }

        const isSelected = selected === r.rating;
        const isLockedOut = selected !== null && !isSelected;

        return (
          <AppPressable
            key={r.rating}
            feedback={isSelected || isLockedOut ? 'none' : 'chip'}
            disabled={disabled || isLockedOut || isSelected}
            onPress={() => handlePress(r.rating)}
            style={[
              styles.btn,
              { backgroundColor: bg, borderColor: isSelected ? text : 'transparent' },
              isLockedOut && styles.btnMuted,
            ]}
            accessibilityState={{ selected: isSelected, disabled: disabled || isLockedOut || isSelected }}
          >
            <Text style={[tokens.typography.captionBold, { color: text }]}>{r.label}</Text>
          </AppPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  btn: {
    flex: 1,
    minWidth: '22%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 2,
  },
  btnMuted: { opacity: 0.38 },
});
