import { FlatList, Pressable, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText } from '../components/AppText';
import { DocumentCard, type DocumentItem } from '../components/DocumentCard';
import { FAB } from '../components/FAB';
// import { Icon } from '../components/Icon';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors } from '../theme';
import type { RootStackParamList } from '../navigation/types';
import { useCallback, useState } from 'react';
import { deleteDocument, getDocuments, renameDocument, SavedDocument, timeAgo } from '../utils/documents';
import { DocumentMenu } from '../components/DocumentMenu';

type HomeNavigation = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const RECENT_DOCUMENTS: DocumentItem[] = [
  { id: '1', name: 'Project Report.pdf', editedAt: '10m ago' },
  { id: '2', name: 'Invoice_123.pdf', editedAt: '1h ago' },
  { id: '3', name: 'Notes.pdf', editedAt: '1h ago' },
];

function Logo() {
  return (
    <View className="flex-row items-center">
      <View className="h-10 w-9 items-center justify-center rounded-lg bg-accent">
        <AppText variant="h3" className="text-content-inverse">
          A
        </AppText>
      </View>
      <AppText variant="h1" className="ml-2 text-primary">
        ASSIGN{' '}
        <AppText variant="h1" className="text-accent">
          PDF
        </AppText>
      </AppText>
    </View>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigation>();
const [docs, setDocs] = useState<SavedDocument[]>([]);
const [menuDoc, setMenuDoc] = useState<SavedDocument | null>(null);

// Editor se wapas aane par list refresh ho
useFocusEffect(
  useCallback(() => {
    getDocuments().then(setDocs);
  }, []),
);

const handleOpen = (item: DocumentItem) => {
  const doc = docs.find((d) => d.id === item.id);
  if (doc) openEditor(doc);
};


const refresh = useCallback(() => {
  getDocuments().then(setDocs);
}, []);

useFocusEffect(refresh);

const openEditor = (doc: SavedDocument) =>
  navigation.navigate('Editor', {
    documentId: doc.id,
    templateId: doc.templateId,
    title: doc.name,
  });

const handleMenuPress = (item: DocumentItem) => {
  const doc = docs.find((d) => d.id === item.id);
  if (doc) setMenuDoc(doc);
};

const handleRename = async (newName: string) => {
  if (!menuDoc) return;
  await renameDocument(menuDoc.id, newName);
  setMenuDoc(null);
  refresh();
};

const handleDelete = async () => {
  if (!menuDoc) return;
  await deleteDocument(menuDoc.id);
  setMenuDoc(null);
  refresh();
};
  return (
    <ScreenContainer padded={false}>
      {/* Top bar */}
      <View className="flex-row items-center justify-between px-5 py-3">
        {/* <Pressable hitSlop={10}>
          <Icon name="menu" size={24} color={colors.text.primary} />
        </Pressable>
        <Pressable hitSlop={10}>
          <Icon name="search" size={22} color={colors.text.primary} />
        </Pressable> */}
      </View>

      <FlatList
       data={docs.map((d) => ({ id: d.id, name: d.name, editedAt: timeAgo(d.updatedAt) }))}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-5 pb-28"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="mb-4">
            <Logo />
            <AppText
              variant="label"
              className="mt-6 tracking-wider text-content-secondary"
            >
              RECENT DOCUMENTS
            </AppText>
          </View>
        }
        renderItem={({ item }) => (
         <DocumentCard
  document={item}
  onPress={handleOpen}
  onMenuPress={handleMenuPress}
/>
        )}
      />

      <FAB
        label="New Document"
        onPress={() => navigation.navigate('Templates')}
      />
      <DocumentMenu
  visible={menuDoc !== null}
  documentName={menuDoc?.name ?? ''}
  onClose={() => setMenuDoc(null)}
  onEdit={() => {
    if (menuDoc) openEditor(menuDoc);
    setMenuDoc(null);
  }}
  onRename={handleRename}
  onDelete={handleDelete}
/>
    </ScreenContainer>
  );
}