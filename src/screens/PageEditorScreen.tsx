import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditorToolbar } from '../components/EditorToolbar';
import { Header } from '../components/Header';
import { HeaderAction } from '../components/HeaderAction';
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
import { getDocument, saveDocument } from '../utils/documents';
import { CoverDetails } from '../utils/cover';

type Props = NativeStackScreenProps<RootStackParamList, 'Editor'>;

export default function EditorScreen({ navigation, route }: Props) {
  const { title, templateId, documentId } = route.params;
const [cover, setCover] = useState<CoverDetails | undefined>(route.params.cover);
  // Naya document ho to id ab bana lo, taake dobara Save par duplicate na bane
  const idRef = useRef(documentId ?? Date.now().toString());

  const editorRef = useRef<RichEditorHandle>(null);
  const [html, setHtml] = useState('');
const [initialHtml, setInitialHtml] = useState<string>();
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

  // Home se purana document kholne par uska text load karo
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
    setSaved(false); // kuch badla, dobara save karna hai
  };

  const handleSave = async () => {
    await saveDocument({
      id: idRef.current,
      name: title,
      templateId,
      html,
      cover,
      updatedAt: Date.now(),
    });
    setSaved(true);
  };

  return (
    <ScreenContainer edges={['left', 'right', 'bottom']} padded={false}>
      <Header
        title={title}
        onBackPress={navigation.goBack}
        right={
          <View className="flex-row items-center">
            <HeaderAction
              label={saved ? 'Saved ✓' : 'Save'}
              variant='success'
              onPress={handleSave}
            />
            <HeaderAction
              label="Export PDF"
              variant="accent"
             onPress={() => navigation.navigate('Preview', { title, html, templateId, cover })}
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
    </ScreenContainer>
  );
}