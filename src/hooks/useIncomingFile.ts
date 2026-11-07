import { useEffect, useRef } from 'react';
import { Linking } from 'react-native';

// Doosri app (File Manager, WhatsApp, Gmail) se kholi gayi file ka link pakadta hai
export function useIncomingFile(onFile: (uri: string) => void) {
  // Hamesha naya function use ho, lekin listener dobara na bane
  const latest = useRef(onFile);
  useEffect(() => {
    latest.current = onFile;
  });

  useEffect(() => {
    const isFile = (url: string | null): url is string =>
      !!url && /^(content|file):/.test(url);

    // App band thi aur file se khuli
    Linking.getInitialURL().then((url) => {
      if (isFile(url)) latest.current(url);
    });

    // App pehle se khuli thi
    const subscription = Linking.addEventListener('url', ({ url }) => {
      if (isFile(url)) latest.current(url);
    });

    return () => subscription.remove();
  }, []);
}