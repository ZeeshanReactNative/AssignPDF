import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../components/Header';
import { ScreenContainer } from '../components/ScreenContainer';
import { TemplateCard, type TemplateItem } from '../components/TemplateCard';
import type { RootStackParamList } from '../navigation/types';

type TemplatesNavigation = NativeStackNavigationProp<
  RootStackParamList,
  'Templates'
>;

// Sirf assignment se related templates
const TEMPLATES: TemplateItem[] = [
  { id: 'cover-page', name: 'Assignment Cover Page' },
  { id: 'research-report', name: 'Research Report' },
  { id: 'lab-report', name: 'Lab Report' },
  { id: 'essay', name: 'Essay' },
  { id: 'case-study', name: 'Case Study' },
  { id: 'book-report', name: 'Book Report' },
  { id: 'blank', name: 'Blank Assignment' },
  { id: 'custom', name: 'Custom Layout', isCustom: true },
];

export default function TemplatesScreen() {
  const navigation = useNavigation<TemplatesNavigation>();

  const handleSelect = (template: TemplateItem) => {
  navigation.navigate('Editor', {
    templateId: template.id,
    title: template.name,
  });
};

  return (
    <ScreenContainer edges={['left', 'right', 'bottom']} padded={false}>
      <Header title="Select a Template" onBackPress={navigation.goBack} />

      <FlatList
        data={TEMPLATES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerClassName="p-3.5"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TemplateCard template={item} onPress={handleSelect} />
        )}
      />
    </ScreenContainer>
  );
}