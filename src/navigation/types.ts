import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CoverDetails } from '../utils/cover';

export type RootStackParamList = {
  Home: undefined;
    Templates: undefined;
    CoverForm: { templateId: string; title: string };
     Editor: { templateId: string; title: string; documentId?: string;  cover?: CoverDetails;};
   Preview: {
  title: string;
  html: string;
  templateId: string;
  cover?: CoverDetails;
};
PdfViewer: { title: string; path: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;