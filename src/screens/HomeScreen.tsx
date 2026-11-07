
import { Alert, FlatList, Pressable, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';

import { AppText } from '../components/AppText';
import { DocumentCard, type DocumentItem } from '../components/DocumentCard';
import { DocumentMenu } from '../components/DocumentMenu';
import { FAB } from '../components/FAB';
import { Icon } from '../components/Icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { HeaderAction } from '../components/HeaderAction';

import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

import {
  deleteDocument,
  getDocuments,
  renameDocument,
  saveDocument,
  timeAgo,
  type SavedDocument,
} from '../utils/documents';

import { useIncomingFile } from '../hooks/useIncomingFile';

import {
  importDocument,
  importFromUri,
  type ImportResult,
} from '../utils/importFile';

type HomeNavigation = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigation>();

  const [docs, setDocs] = useState<SavedDocument[]>([]);
  const [menuDoc, setMenuDoc] = useState<SavedDocument | null>(null);

  const refresh = useCallback(() => {
    getDocuments().then(setDocs);
  }, []);

  // Refresh the document list whenever the HomeScreen comes into focus.
  useFocusEffect(refresh);

  // Open documents according to their type and storage location.
  const openDocument = (doc: SavedDocument) => {
    if (doc.filePath) {
      // Open imported PDF files in the in-app PDF viewer.
      navigation.navigate('PdfViewer', {
        title: doc.name,
        path: doc.filePath,
      });
    } else if (doc.type === 'pdf') {
      // Open PDFs exported from the app in the Preview screen.
      navigation.navigate('Preview', {
        title: doc.name.replace(/\.pdf$/i, ''),
        html: doc.html,
        templateId: doc.templateId,
        cover: doc.cover,
      });
    } else {
      // Open regular documents in the Editor.
      navigation.navigate('Editor', {
        documentId: doc.id,
        templateId: doc.templateId,
        title: doc.name,
      });
    }
  };

  const handleOpen = (item: DocumentItem) => {
    const doc = docs.find((d) => d.id === item.id);
    if (doc) openDocument(doc);
  };

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

  const showImportError = (e: unknown) =>
    Alert.alert(
      'Import Failed',
      e instanceof Error ? e.message : 'An unknown error occurred.',
    );

  // Handle document imports from both the Import button and the Open With feature.
  const openImported = async (result: ImportResult) => {
    if (result.kind === 'pdf') {
      // Save imported PDFs and open them in the in-app PDF viewer.
      await saveDocument({
        id: `pdf-${Date.now()}`,
        name: result.name,
        templateId: 'blank',
        html: '',
        filePath: result.path,
        updatedAt: Date.now(),
        type: 'pdf',
      });

      navigation.navigate('PdfViewer', {
        title: result.name,
        path: result.path,
      });

      return;
    }

    // Save imported Word or text documents and open them in the Editor.
    const id = Date.now().toString();

    await saveDocument({
      id,
      name: result.name,
      templateId: 'blank',
      html: result.html,
      updatedAt: Date.now(),
      type: 'saved',
    });

    navigation.navigate('Editor', {
      documentId: id,
      templateId: 'blank',
      title: result.name,
    });
  };

  const handleImport = async () => {
    try {
      const result = await importDocument();

      if (result) {
        await openImported(result);
      }
    } catch (e) {
      showImportError(e);
    }
  };

  // Handle files received from other apps through the Open With feature.
  useIncomingFile(async (uri) => {
    try {
      await openImported(await importFromUri(uri));
    } catch (e) {
      showImportError(e);
    }
  });

  const documentItems: DocumentItem[] = docs.map((d) => ({
    id: d.id,
    name: d.name,
    editedAt: timeAgo(d.updatedAt),
    type: d.type ?? 'saved',
  }));

  return (
    <ScreenContainer padded={false}>
      {/* Top header */}
      <View className="px-3 pb-3 pt-3">
        {/* Menu button in the top-left corner */}
        <Pressable
          hitSlop={10}
          className="h-10 w-10 items-center justify-center rounded-xl bg-background"
          onPress={() => {
            // Add menu functionality here.
          }}
        >
          <Icon name="menu" size={24} color={colors.text.primary} />
        </Pressable>

        {/* Centered app logo and name */}
        <View className="mt-3 items-center justify-center">
          <View style={{ marginBottom: -14 }}>
            <Icon name="logo" size={70} />
          </View>

          <AppText variant="h1" className="font-bold text-primary">
            ASSIGN{' '}
            <AppText variant="h1" className="font-bold text-accent">
              PDF
            </AppText>
          </AppText>

          <AppText
            variant="label"
            className="mt-0.5 tracking-wide text-content-secondary"
          >
            Create & Manage Assignments
          </AppText>
        </View>
      </View>

      <View className="mx-5 mb-5 h-px bg-black" />

      {/* Recent documents */}
      <FlatList
        data={documentItems}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-5 pb-28"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="mb-4 flex-row items-center justify-between">
            <AppText
              variant="label"
              className="tracking-wider text-content-secondary"
            >
              RECENT DOCUMENTS
            </AppText>

            <HeaderAction
              label="Import"
              variant="accent"
              onPress={handleImport}
            />
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

      {/* New document button */}
      <FAB
        label="New Document"
        onPress={() => navigation.navigate('Templates')}
      />

      {/* Document options menu */}
      <DocumentMenu
        visible={menuDoc !== null}
        documentName={menuDoc?.name ?? ''}
        onClose={() => setMenuDoc(null)}
        onEdit={() => {
          if (menuDoc) openDocument(menuDoc);
          setMenuDoc(null);
        }}
        onRename={handleRename}
        onDelete={handleDelete}
      />
    </ScreenContainer>
  );
}
