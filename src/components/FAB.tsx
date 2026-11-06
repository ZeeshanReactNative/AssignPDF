import { Pressable } from 'react-native';
import { AppText } from './AppText';
import { Icon } from './Icons';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';

type FABProps = {
  label: string;
  onPress: () => void;
};

export function FAB({ label, onPress }: FABProps) {
  return (
    <Pressable
      onPress={onPress}
      className="absolute bottom-6 right-5 flex-row items-center rounded-full bg-accent px-5 py-3 active:bg-accent-dark"
      style={shadows.lg}
    >
      <AppText variant="button" className="mr-2 text-content-inverse">
        {label}
      </AppText>
      <Icon name="plus" size={18} color={colors.text.inverse} />
    </Pressable>
  );
}