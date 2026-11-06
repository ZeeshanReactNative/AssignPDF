import { useState } from 'react';
import { Alert, Platform, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Header } from '../components/Header';
import { HeaderAction } from '../components/HeaderAction';
import { PreviewViewer } from '../components/PreviewViewer';
import { ScreenContainer } from '../components/ScreenContainer';
import type { RootStackParamList } from '../navigation/types';
import { savePdfRecord } from '../utils/documents';
import { createPdf, savePdfToDevice, sharePdf } from '../utils/pdf';

type Props = NativeStackScreenProps<RootStackParamList, 'Preview'>;

type Busy = 'download' | 'share' | null;

export default function PreviewScreen({ navigation, route }: Props) {
  const { title, html, templateId, cover } = route.params;
  const [busy, setBusy] = useState<Busy>(null);

  const handleDownload = async () => {
    if (busy) return;
    setBusy('download');
    try {
      const path = await createPdf(title, html, cover);
      const savedName = await savePdfToDevice(title, path);

      if (savedName) {
        await savePdfRecord({ name: savedName, templateId, html, cover });
       Alert.alert(
  'PDF Downloaded Successfully',
  `File Location:Downloads/AssignPDF/${savedName}`,
  [{ text: 'OK' }],
        );
      }
    } catch (e) {
      Alert.alert('PDF save nahi hui', e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setBusy(null);
    }
  };

  const handleShare = async () => {
    if (busy) return;
    setBusy('share');
    try {
      const path = await createPdf(title, html, cover);
      await sharePdf(title, path);
    } catch (e) {
      Alert.alert('Share nahi hui', e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setBusy(null);
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
              label={busy === 'download' ? 'Saving...' : 'Download'}
              variant="accent"
              onPress={handleDownload}
            />
            <HeaderAction
              label={busy === 'share' ? 'Preparing...' : 'Share'}
              variant="outline"
              onPress={handleShare}
            />
          </View>
        }
      />

      <PreviewViewer html={html} cover={cover} />
    </ScreenContainer>
  );
}