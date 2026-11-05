
import { Pressable } from 'react-native';
import { AppText } from './AppText';
import { cn } from '../utils/cn';

type HeaderActionVariant = 'text' | 'accent' | 'success' | 'outline';

type HeaderActionProps = {
  label: string;
  variant?: HeaderActionVariant;
  onPress: () => void;
  className?: string;
};

// Classes for each variant
const containerClasses: Record<HeaderActionVariant, string> = {
  text: 'px-2',

  accent:
    'rounded-lg bg-accent px-3 py-1.5 active:bg-accent-dark',

  success:
    'rounded-lg bg-success px-3 py-1.5 active:opacity-80',

  outline:
    'rounded-lg border border-content-inverse px-3 py-1.5 active:opacity-70',
};

export function HeaderAction({
  label,
  variant = 'text',
  onPress,
  className,
}: HeaderActionProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      className={cn(
        'ml-2',
        containerClasses[variant],
        className,
      )}
    >
      <AppText variant="label" className="text-text-inverse">
        {label}
      </AppText>
    </Pressable>
  );
}
