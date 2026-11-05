
import type { ReactNode } from 'react';
import { Pressable, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from './AppText';
import { Icon } from './Icons';
import { colors } from '../theme';

type HeaderProps = {
  title: string;
  onBackPress?: () => void;
  right?: ReactNode;
};

export const Header = ({ title, onBackPress, right }: HeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-primary px-4 pb-5"
      style={{
        paddingTop: insets.top + 8,
      }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary.DEFAULT}
      />

      {/* Top Row: Back Button */}
      {onBackPress ? (
        <Pressable
          onPress={onBackPress}
          hitSlop={12}
          className="mb-4 h-10 w-10 items-center justify-center rounded-xl bg-white/15"
        >
          <Icon
            name="back"
            size={21}
            color={colors.text.inverse}
          />
        </Pressable>
      ) : null}

      {/* Bottom Row: Title and Right Button */}
      <View className="flex-row items-center justify-between">
        <AppText
          variant="title"
          numberOfLines={1}
          className="flex-1 font-bold text-text-inverse"
        >
          {title}
        </AppText>

        {right ? (
          <View className="ml-3 flex-row items-center">
            {right}
          </View>
        ) : null}
      </View>
    </View>
  );
};
