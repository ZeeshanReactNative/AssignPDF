import type { ReactNode } from 'react';
import { Pressable } from 'react-native';
import { cn } from '../utils/cn';

type ToolbarButtonProps = {
  active?: boolean;
  onPress: () => void;
  children: ReactNode;
};

export function ToolbarButton({
  active = false,
  onPress,
  children,
}: ToolbarButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'mr-2 h-10 w-10 items-center justify-center rounded-lg',
        active ? 'bg-primary-light' : 'bg-transparent',
      )}
    >
      {children}
    </Pressable>
  );
}