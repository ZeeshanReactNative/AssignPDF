import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from '../components/AppText';
import { Header } from '../components/Header';
import { HeaderAction } from '../components/HeaderAction';
import { PreviewViewer } from '../components/PreviewViewer';
import { ScreenContainer } from '../components/ScreenContainer';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import { savePdfRecord } from '../utils/documents';
import { createPdf, PDF_FOLDER, savePdfToDevice, sharePdf } from '../utils/pdf';

type Props = NativeStackScreenProps<RootStackParamList, 'Preview'>;

// Which job is running (only one at a time)
type Busy = 'download' | 'share' | null;

// The loader stays at least this long, even if the work finishes sooner
const MIN_DOWNLOAD_LOADER_MS = 1500;
const MIN_PREVIEW_LOADER_MS = 1000;
const MIN_SHARE_LOADER_MS = 1500;
const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function PreviewScreen({ navigation, route }: Props) {
  const { title, html, templateId, cover } = route.params;

  const [busy, setBusy] = useState<Busy>(null);
  const [pageLoaded, setPageLoaded] = useState(false); // WebView finished loading
  const [minTimePassed, setMinTimePassed] = useState(false); // loader was shown long enough

  // Start the minimum-time clock when the screen opens
  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), MIN_PREVIEW_LOADER_MS);
    return () => clearTimeout(timer);
  }, []);

  const previewReady = pageLoaded && minTimePassed;

  const handleDownload = async () => {
    if (busy) return;
    setBusy('download');
    try {
      // Work and the minimum wait run together: total time = whichever is longer
      const [savedName] = await Promise.all([
        (async () => {
          const path = await createPdf(title, html, cover);
          return savePdfToDevice(title, path);
        })(),
        wait(MIN_DOWNLOAD_LOADER_MS),
      ]);

      if (savedName) {
        await savePdfRecord({ name: savedName, templateId, html, cover });

        Alert.alert(
          'PDF Downloaded Successfully',
          Platform.OS === 'android'
            ? `File Location:\nDownloads/${PDF_FOLDER}/${savedName}`
            : `${savedName} is saved.`,
          [{ text: 'OK' }],
        );
      }
    } catch (e) {
      Alert.alert('Could not save PDF', e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setBusy(null);
    }
  };

const handleShare = async () => {
  if (busy) return;
  setBusy('share');

  try {
    const [path] = await Promise.all([
      createPdf(title, html, cover),
      wait(MIN_SHARE_LOADER_MS),
    ]);

    setBusy(null);
    await sharePdf(title, path);
  } catch (e) {
    Alert.alert(
      'Could not share PDF',
      e instanceof Error ? e.message : 'Unknown error',
    );
  } finally {
    setBusy(null);
  }
};

  // Text shown in the overlay (null = no overlay)
  const overlayText =
    busy === 'download'
      ? 'Creating PDF...'
      : busy === 'share'
        ? 'Preparing to share...'
        : !previewReady
          ? 'Loading preview...'
          : null;

  return (
    <ScreenContainer edges={['left', 'right', 'bottom']} padded={false}>
      <Header
        title={`${title} Preview`}
        onBackPress={navigation.goBack}
        right={
          <View className="flex-row items-center">
            <HeaderAction
              label="Download"
              variant="accent"
              loading={busy === 'download'}
              onPress={handleDownload}
            />
            <HeaderAction
              label="Share"
              variant="success"
              loading={busy === 'share'}
              onPress={handleShare}
            />
          </View>
        }
      />

      <PreviewViewer
        html={html}
        cover={cover}
        onLoadEnd={() => setPageLoaded(true)}
      />

      {/* Overlay: also blocks taps while something is running */}
      {overlayText ? (
        <View className="absolute inset-0 items-center justify-center bg-black/40">
          <View className="items-center rounded-2xl bg-surface px-8 py-6">
            <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
            <AppText variant="label" className="mt-3 text-content-primary">
              {overlayText}
            </AppText>
          </View>
        </View>
      ) : null}
    </ScreenContainer>
  );
}