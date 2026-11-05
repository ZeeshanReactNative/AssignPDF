import { Image, type ImageStyle, type StyleProp } from 'react-native';
import { icons, type IconName } from '../assets/index';

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ImageStyle>;
};

export function Icon({ name, size = 24, color, style }: IconProps) {
  return (
    <Image
      source={icons[name]}
      resizeMode="contain"
      style={[{ width: size, height: size }, color ? { tintColor: color } : null, style]}
    />
  );
}