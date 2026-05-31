import { StyleSheet, Text, View } from 'react-native';
import { AppPressable } from './AppPressable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_ITEMS, tabIdForScreen } from '../../navigation/tabs';
import { useAppStore } from '../../store/appStore';
import { useTheme } from '../../theme/ThemeContext';
import { AppIcon } from './AppIcon';

export function BottomNav() {
  const { brand, tokens, navBg, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const screen = useAppStore((s) => s.screen);
  const setScreen = useAppStore((s) => s.setScreen);
  const activeTab = tabIdForScreen(screen);

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: navBg,
          paddingBottom: Math.max(insets.bottom, 8),
          borderTopColor: colors.border.tertiary,
        },
      ]}
    >
      {TAB_ITEMS.map((tab) => {
        const active = activeTab === tab.id;
        const iconColor = active ? brand.primary : colors.text.inactive;
        return (
          <AppPressable
            key={tab.id}
            feedback="tab"
            rippleColor="rgba(39,174,96,0.2)"
            onPress={() => setScreen(tab.screen)}
            style={styles.tab}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            {active && tab.id === 'account' ? (
              <View style={[styles.dot, { backgroundColor: brand.primary }]} />
            ) : null}
            <AppIcon name={tab.icon} size={22} color={iconColor} />
            <Text
              style={[
                active ? tokens.typography.captionBold : tokens.typography.caption,
                { color: active ? brand.primary : colors.text.inactive, marginTop: 4 },
              ]}
            >
              {tab.label}
            </Text>
          </AppPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
