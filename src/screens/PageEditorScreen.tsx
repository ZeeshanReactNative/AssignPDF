import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditorToolbar } from '../components/EditorToolbar';
import { Header } from '../components/Header';
import { HeaderAction } from '../components/HeaderAction';
import { NameModal } from '../components/NameModal';
import {
  RichEditor,
  type FormatState,
  type RichEditorHandle,
} from '../components/RichEditor';
import { ScreenContainer } from '../components/ScreenContainer';
import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_TEXT_COLOR,
} from '../constants/editor';
import type { RootStackParamList } from '../navigation/types';
import type { CoverDetails } from '../utils/cover';
import { getDocument, saveDocument } from '../utils/documents';

type Props = NativeStackScreenProps<RootStackParamList, 'Editor'>;

// What the user was doing when we asked for a name
type PendingAction = 'save' | 'export' | null;

export default function EditorScreen({ navigation, route }: Props) {
  const { title, templateId, documentId } = route.params;

  // New document: create the id now so pressing Save twice doesn't create duplicates
  const idRef = useRef(documentId ?? Date.now().toString());
  const editorRef = useRef<RichEditorHandle>(null);
const [saving, setSaving] = useState(false);
  const [html, setHtml] = useState('');
  const [initialHtml, setInitialHtml] = useState<string>();
  const [cover, setCover] = useState<CoverDetails | undefined>(route.params.cover);
  const [saved, setSaved] = useState(false);
  const [format, setFormat] = useState<FormatState>({
    bold: false,
    italic: false,
    underline: false,
    fontSize: DEFAULT_FONT_SIZE,
    fontFamily: DEFAULT_FONT_FAMILY.name,
    color: DEFAULT_TEXT_COLOR,
    align: 'left',
  });

  // null = the user hasn't named it yet (we will ask once)
  // Existing documents and cover documents (assignment title) already have a name
  const alreadyNamed = Boolean(documentId || route.params.cover?.assignmentTitle);
  const [docName, setDocName] = useState<string | null>(alreadyNamed ? title : null);
  const [pending, setPending] = useState<PendingAction>(null);

  // Opening an old document from Home: load its text and cover
  useEffect(() => {
    if (!documentId) return;
    getDocument(documentId).then((doc) => {
      if (doc) {
        setHtml(doc.html);
        setInitialHtml(doc.html);
        setCover(doc.cover);
      }
    });
  }, [documentId]);

  const handleChange = (value: string) => {
    setHtml(value);
    setSaved(false);
  };

  // The name is passed in directly because state updates are not instant
  const runAction = async (action: Exclude<PendingAction, null>, name: string) => {
       if (action === 'save') {
      setSaving(true);
      try {
        await saveDocument({
          id: idRef.current,
          name,
          templateId,
          html,
          cover,
          updatedAt: Date.now(),
        });
        // Saving is very fast, so keep the spinner visible for a moment
        await new Promise((resolve) => setTimeout(resolve, 400));
        setSaved(true);
      } finally {
        setSaving(false);
      }
    } else {
      navigation.navigate('Preview', { title: name, html, templateId, cover });
    }
  };

  // Named already: go ahead. Not named: ask first.
  const request = (action: Exclude<PendingAction, null>) => {
    if (docName) {
      runAction(action, docName);
    } else {
      setPending(action);
    }
  };

  const handleNameConfirm = (name: string) => {
    const action = pending;
    setPending(null);
    setDocName(name); // remembered: we won't ask again
    if (action) runAction(action, name);
  };

  return (
    <ScreenContainer edges={['left', 'right', 'bottom']} padded={false}>
      <Header
        title={docName ?? title}
        onBackPress={navigation.goBack}
        right={
          <View className="flex-row items-center">
            <HeaderAction
              label={saved ? 'Saved ✓' : 'Save'}
              loading={saving}
              variant='success'
              onPress={() => request('save')}
            />
            <HeaderAction
              label="Export PDF"
              variant="accent"
              
              onPress={() => request('export')}
            />
          </View>
        }
      />

      <EditorToolbar format={format} editorRef={editorRef} />

      <RichEditor
        ref={editorRef}
        initialHtml={initialHtml}
        cover={cover}
        onChange={handleChange}
        onFormatChange={setFormat}
      />

      <NameModal
        visible={pending !== null}
        defaultName={title}
        confirmLabel={pending === 'export' ? 'Continue' : 'Save'}
        onCancel={() => setPending(null)}
        onConfirm={handleNameConfirm}
      />
    </ScreenContainer>
  );
}