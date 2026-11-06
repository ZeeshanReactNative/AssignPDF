import { FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../components/Header';
import { ScreenContainer } from '../components/ScreenContainer';
import { TemplateCard } from '../components/TemplateCard';
import { TEMPLATES, type CoverTemplate } from '../constants/templates';
import type { RootStackParamList } from '../navigation/types';

type TemplatesNavigation = NativeStackNavigationProp<RootStackParamList, 'Templates'>;

// Templates ki ginti toq (odd) ho to aakhri card poori chaurai le leta hai.
// Isliye ek khali jagah (null) jor dete hain.
const DATA: (CoverTemplate | null)[] =
  TEMPLATES.length % 2 === 0 ? TEMPLATES : [...TEMPLATES, null];

export default function TemplatesScreen() {
  const navigation = useNavigation<TemplatesNavigation>();

  const handleSelect = (template: CoverTemplate) => {
    const params = { templateId: template.id, title: template.name };

    // Blank par cover ka sawal nahi, baqi sab par us template ka form
    if (template.layout === 'none') {
      navigation.navigate('Editor', params);
    } else {
      navigation.navigate('CoverForm', params);
    }
  };

  return (
    <ScreenContainer edges={['left', 'right', 'bottom']} padded={false}>
      <Header title="Select a Template" onBackPress={navigation.goBack} />

      <FlatList
        data={DATA}
        keyExtractor={(item, index) => item?.id ?? `spacer-${index}`}
        numColumns={2}
        contentContainerClassName="p-3.5"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) =>
          item ? (
            <TemplateCard template={item} onPress={handleSelect} />
          ) : (
            <View className="m-1.5 flex-1" />
          )
        }
      />
    </ScreenContainer>
  );
}