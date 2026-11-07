
import { Pressable, View } from 'react-native';
import { AppText } from './AppText';

import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
import { Icon } from './Icons';

export type DocumentItem = {
  id: string;
  name: string;
  editedAt: string;
  type?: 'saved' | 'pdf';
};

type DocumentCardProps = {
  document: DocumentItem;
  onPress?: (document: DocumentItem) => void;
  onMenuPress?: (document: DocumentItem) => void;
};

export function DocumentCard({
  document,
  onPress,
  onMenuPress,
}: DocumentCardProps) {
  const isPdf = document.type === 'pdf';

  return (
    <Pressable
      onPress={() => onPress?.(document)}
      className="mb-3 flex-row items-center rounded-xl bg-surface p-3 active:opacity-80"
      style={shadows.sm}
    >
      {/* Document Type Icon */}

<View className="h-12 w-10 items-center justify-center rounded-md bg-primary-light">
  <Icon
    name={isPdf ? 'filepdf' : 'file'}
    size={24}
    
  />
</View>

      {/* Name + edited time */}
      <View className="ml-3 flex-1">
        <AppText variant="label" numberOfLines={1}>
          {document.name}
        </AppText>

        <AppText variant="caption" className="mt-0.5 text-content-secondary">
          Edited {document.editedAt}
        </AppText>
      </View>

      {/* Three dots menu */}
      <Pressable
        onPress={() => onMenuPress?.(document)}
        hitSlop={10}
        className="p-1"
      >
        <Icon name="more" size={36} color={colors.text.secondary} />
      </Pressable>
    </Pressable>
  );
}

// import { Pressable, View } from 'react-native';
// import { AppText } from './AppText';

// import { colors } from '../theme/colors';
// import { shadows } from '../theme/shadows';
// import { Icon } from './Icons';

// export type DocumentItem = {
//   id: string;
//   name: string;
//   editedAt: string;
// };

// type DocumentCardProps = {
//   document: DocumentItem;
//   onPress?: (document: DocumentItem) => void;
//   onMenuPress?: (document: DocumentItem) => void;
// };

// export function DocumentCard({
//   document,
//   onPress,
//   onMenuPress,
// }: DocumentCardProps) {
//   return (
//     <Pressable
//       onPress={() => onPress?.(document)}
//       className="mb-3 flex-row items-center rounded-xl bg-surface p-3 active:opacity-80"
//       style={shadows.sm}
//     >
//       {/* File icon */}
//       <View className="h-12 w-10 items-center justify-center rounded-md bg-primary-light">
//         <Icon name="file" size={22} color={colors.primary.DEFAULT} />
//       </View>

//       {/* Name + edited time */}
//       <View className="ml-3 flex-1">
//         <AppText variant="label" numberOfLines={1}>
//           {document.name}
//         </AppText>
//         <AppText variant="caption" className="mt-0.5 text-content-secondary">
//           Edited {document.editedAt}
//         </AppText>
//       </View>

//       {/* Three dots menu */}
//       <Pressable
//         onPress={() => onMenuPress?.(document)}
//         hitSlop={10}
//         className="p-1"
//       >
//         <Icon name="more" size={36} color={colors.text.secondary} />
//       </Pressable>
//     </Pressable>
//   );
// }