import { useState } from 'react';
import { Alert, View } from 'react-native';
import Pdf from 'react-native-pdf';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from '../components/AppText';
import { Header } from '../components/Header';
import { HeaderAction } from '../components/HeaderAction';
import { ScreenContainer } from '../components/ScreenContainer';
import type { RootStackParamList } from '../navigation/types';
import { sharePdf } from '../utils/pdf';

type Props = NativeStackScreenProps<RootStackParamList, 'PdfViewer'>;

const MIN_SHARE_LOADER_MS = 2200;

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function PdfViewerScreen({ navigation, route }: Props) {
  const { title, path } = route.params;

  const [page, setPage] = useState({ current: 1, total: 0 });
  const [failed, setFailed] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (sharing) return;

    setSharing(true);

    try {
      await Promise.all([
        sharePdf(title, path),
        wait(MIN_SHARE_LOADER_MS),
      ]);
    } catch (e) {
      Alert.alert('Share Failed', e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setSharing(false);
    }
  };

  return (
    <ScreenContainer edges={['left', 'right', 'bottom']} padded={false}>
      <Header
        title={title}
        onBackPress={navigation.goBack}
        right={
          <HeaderAction
            label="Share"
            variant="outline"
            loading={sharing}
            onPress={handleShare}
          />
        }
      />

      {failed ? (
        <View className="flex-1 items-center justify-center px-8">
          <AppText variant="body" className="text-center text-content-secondary">
            Unable to open this PDF. The file may be corrupted or password-protected.
          </AppText>
        </View>
      ) : (
        <View className="flex-1">
          <Pdf
            source={{ uri: `file://${path}` }}
            style={{ flex: 1, backgroundColor: '#E8EEF9' }}
            onLoadComplete={(total) => setPage((p) => ({ ...p, total }))}
            onPageChanged={(current, total) => setPage({ current, total })}
            onError={() => setFailed(true)}
          />

          {/* Page number: 1 / 5 */}
          {page.total > 0 ? (
            <View className="absolute bottom-4 self-center rounded-full bg-black/60 px-3 py-1">
              <AppText variant="caption" className="text-white">
                {page.current} / {page.total}
              </AppText>
            </View>
          ) : null}
        </View>
      )}
    </ScreenContainer>
  );
}