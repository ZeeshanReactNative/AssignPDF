import { Pressable, View } from 'react-native';
import { AppText } from './AppText';
// import { Icon } from './Icon';
import { colors } from '../theme';
import { shadows } from '../theme/shadows';

export type TemplateItem = {
  id: string;
  name: string;
  isCustom?: boolean;
};

type TemplateCardProps = {
  template: TemplateItem;
  onPress?: (template: TemplateItem) => void;
};

// Jab tak asli preview images nahi hain, ye chhota sa kaghaz ka placeholder hai
function PreviewPlaceholder({ isCustom }: { isCustom?: boolean }) {
  if (isCustom) {
    return (
      <View className="h-32 w-full items-center justify-center rounded-lg border border-dashed border-line-strong bg-primary-light">
        {/* <Icon name="plus" size={28} color={colors.primary.DEFAULT} /> */}
      </View>
    );
  }

  return (
    <View className="h-32 w-full items-center justify-center rounded-lg bg-primary-light">
      <View className="h-24 w-[70%] rounded-sm bg-surface p-2" style={shadows.sm}>
        <View className="mb-2 h-3 w-full rounded-sm bg-primary" />
        <View className="mb-1 h-1 w-full rounded-full bg-line-strong" />
        <View className="mb-1 h-1 w-4/5 rounded-full bg-line-strong" />
        <View className="mb-1 h-1 w-full rounded-full bg-line-strong" />
        <View className="h-1 w-3/5 rounded-full bg-line-strong" />
      </View>
    </View>
  );
}

export function TemplateCard({ template, onPress }: TemplateCardProps) {
  return (
    <Pressable
      onPress={() => onPress?.(template)}
      className="m-1.5 flex-1 rounded-2xl bg-surface p-3 active:opacity-80"
      style={shadows.sm}
    >
      <PreviewPlaceholder isCustom={template.isCustom} />
      <AppText
        variant="label"
        numberOfLines={2}
        className="mt-3 text-center text-content-primary"
      >
        {template.name}
      </AppText>
    </Pressable>
  );
}