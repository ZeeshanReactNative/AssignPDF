import { ActivityIndicator, Pressable, View } from 'react-native';
import { AppText } from './AppText';
import { cn } from '../utils/cn';

type HeaderActionVariant = 'text' | 'accent' | 'success' | 'outline';

type HeaderActionProps = {
  label: string;
  variant?: HeaderActionVariant;
  onPress: () => void;
  loading?: boolean; // shows a spinner and ignores taps
};

const containerClasses: Record<HeaderActionVariant, string> = {
  text: 'px-2',
  accent: 'rounded-lg bg-accent px-3 py-1.5 active:bg-accent-dark',
  success: 'rounded-lg bg-success px-3 py-1.5 active:opacity-80',
  outline: 'rounded-lg border border-content-inverse px-3 py-1.5 active:opacity-70',
};

const textClasses: Record<HeaderActionVariant, string> = {
  text: 'text-content-inverse',
  accent: 'text-white',
  success: 'text-white',
  outline: 'text-content-inverse',
};

export function HeaderAction({
  label,
  variant = 'text',
  onPress,
  loading = false,
}: HeaderActionProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      hitSlop={6}
      className={cn('ml-2', containerClasses[variant])}
    >
      {/* Label stays (invisible) so the button keeps its size */}
      <AppText
        variant="label"
        className={cn(textClasses[variant], loading && 'opacity-0')}
      >
        {label}
      </AppText>

      {loading ? (
        <View className="absolute inset-0 items-center justify-center">
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      ) : null}
    </Pressable>
  );
}