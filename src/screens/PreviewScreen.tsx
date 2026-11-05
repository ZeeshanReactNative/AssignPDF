import { useState } from 'react';
import { Alert, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Header } from '../components/Header';
import { HeaderAction } from '../components/HeaderAction';
import { PreviewViewer } from '../components/PreviewViewer';
import { ScreenContainer } from '../components/ScreenContainer';
import type { RootStackParamList } from '../navigation/types';
import { createPdf, savePdfToDevice } from '../utils/pdf';

type Props = NativeStackScreenProps<RootStackParamList, 'Preview'>;

export default function PreviewScreen({ navigation, route }: Props) {
  const { title, html } = route.params;
  const [busy, setBusy] = useState(false);

 const handleDownload = async () => {
  if (busy) return;

  setBusy(true);

  try {
    const filePath = await createPdf(title, html);

    console.log('[PDF] Generated:', filePath);

    const savedName = await savePdfToDevice(title, filePath);

    const downloadPath = 'Downloads/AssignPDF';

    Alert.alert(
  'PDF Downloaded Successfully',
  `File Location\n\nDownloads/AssignPDF/${savedName}`,
  [{ text: 'OK' }],
);
  } catch (error) {
    console.error('[PDF] Download error:', error);

    Alert.alert(
      'PDF Save Failed',
      error instanceof Error ? error.message : 'Unable to save PDF.',
    );
  } finally {
    setBusy(false);
  }
};

  return (
    <ScreenContainer edges={['left', 'right', 'bottom']} padded={false}>
      <Header
        title={`${title} Preview`}
        onBackPress={navigation.goBack}
        right={
          <View className="flex-row items-center">
            <HeaderAction
              label={busy ? 'Creating...' : 'Download'}
              variant="accent"
              onPress={handleDownload}
            />
            <HeaderAction
              label="Share"
              variant='success'
              onPress={() => console.log('Share PDF')}
            />
          </View>
        }
      />

      <PreviewViewer html={html} />
    </ScreenContainer>
  );
}