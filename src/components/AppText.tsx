import { Text, type TextProps } from 'react-native';
import { textStyles, type TextVariant } from '../theme/typography';

type AppTextProps = TextProps & {
  variant?: TextVariant;
  className?: string;
};

export function AppText({
  variant = 'body',
  className = 'text-content-primary',
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      className={className}
      style={[textStyles[variant], style]}
      {...rest}
    />
  );
}