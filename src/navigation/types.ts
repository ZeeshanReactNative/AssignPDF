import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
    Templates: undefined;
     Editor: { templateId: string; title: string; documentId?: string };
     Preview: { title: string; html: string; templateId: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;