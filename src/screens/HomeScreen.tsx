
import { FlatList, Image, Pressable, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';

import { AppText } from '../components/AppText';
import { DocumentCard, type DocumentItem } from '../components/DocumentCard';
import { FAB } from '../components/FAB';
import { ScreenContainer } from '../components/ScreenContainer';
import { DocumentMenu } from '../components/DocumentMenu';
import { Icon } from '../components/Icons';

import type { RootStackParamList } from '../navigation/types';
import {
  deleteDocument,
  getDocuments,
  renameDocument,
  type SavedDocument,
  timeAgo,
} from '../utils/documents';

import { colors } from '../theme';

type HomeNavigation = NativeStackNavigationProp<RootStackParamList, 'Home'>;

function Logo() {
  return (
    <View className="items-center">
      {/* Logo Icon */}
      <View className="h-12 w-12 items-center justify-center rounded-xl bg-accent">
        <AppText variant="h1" className="font-bold text-content-inverse">
          A
        </AppText>
      </View>

      {/* App Name */}
      <AppText variant="h1" className="mt-2 font-bold text-primary">
        ASSIGN{' '}
        <AppText variant="h1" className="font-bold text-accent">
          PDF
        </AppText>
      </AppText>

      {/* Tagline */}
      <AppText
        variant="caption"
        className="mt-0.5 tracking-wide text-content-secondary"
      >
        Assignment Maker
      </AppText>
    </View>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigation>();

  const [docs, setDocs] = useState<SavedDocument[]>([]);
  const [menuDoc, setMenuDoc] = useState<SavedDocument | null>(null);

  const refresh = useCallback(() => {
    getDocuments().then(setDocs);
  }, []);

  // Refresh documents whenever HomeScreen gets focus
  useFocusEffect(refresh);

  const openEditor = (doc: SavedDocument) => {
    navigation.navigate('Editor', {
      documentId: doc.id,
      templateId: doc.templateId,
      title: doc.name,
    });
  };

const handleOpen = (item: DocumentItem) => {
  const doc = docs.find((d) => d.id === item.id);
  if (!doc) return;

  if (doc.type === 'pdf') {
    navigation.navigate('Preview', {
      title: doc.name.replace(/\.pdf$/i, ''),
      html: doc.html,
      templateId: doc.templateId,
      cover: doc.cover,
    });
  } else {
    openEditor(doc);
  }
};

  const handleMenuPress = (item: DocumentItem) => {
    const doc = docs.find((d) => d.id === item.id);

    if (doc) {
      setMenuDoc(doc);
    }
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
const documentItems: DocumentItem[] = docs.map((d) => ({
  id: d.id,
  name: d.name,
  editedAt: timeAgo(d.updatedAt),
  type: d.type ?? 'saved',
}));

  return (
    <ScreenContainer padded={false}>
      {/* Top Header */}
   
<View className="px-3 pt-3 pb-5">

  {/* Menu Button - Top Left */}
  <Pressable
    hitSlop={10}
    className="h-10 w-10 items-center justify-center rounded-xl bg-background"
    onPress={() => {
      // Add menu navigation/action here
    }}
  >
    <Icon
      name="menu"
      size={24}
      color={colors.text.primary}
    />
  </Pressable>

  {/* Center Logo and App Name */}
  <View className="items-center justify-center mt-3">

     <View style={{ marginBottom: -14 }}>
      <Icon
      name="logo"
      size={70}
    />
     </View>

    {/* App Name */}
    <AppText variant="h1" className=" font-bold text-primary">
      ASSIGN{' '}
      <AppText variant="h1" className="font-bold text-accent">
        PDF
      </AppText>
    </AppText>

    {/* Tagline */}
    <AppText
      variant='label'
      className="mt-0.5 tracking-wide text-content-secondary"
    >
      Create & Manage Assignments
    </AppText>

  </View>
</View>
<View className="h-px bg-black mx-5 mb-5" />
      {/* Recent Documents */}
      <FlatList
        data={documentItems}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-5 pb-28"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="mb-4">
            <AppText
              variant="label"
              className="tracking-wider text-content-secondary"
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

      {/* Existing New Document Button - Unchanged */}
      <FAB
        label="New Document"
        onPress={() => navigation.navigate('Templates')}
      />

      {/* Document Menu */}
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
