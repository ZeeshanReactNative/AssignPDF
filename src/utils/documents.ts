import AsyncStorage from '@react-native-async-storage/async-storage';
import { CoverDetails } from './cover';

const KEY = 'documents';

export type SavedDocument = {
  id: string;
  name: string;
  templateId: string;
  html: string;
  updatedAt: number; // Date.now()
   type?: 'saved' | 'pdf',
   cover?: CoverDetails;
filePath?: string;
};

export async function getDocuments(): Promise<SavedDocument[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedDocument[]) : [];
  } catch {
    return [];
  }
}

export async function getDocument(id: string) {
  const all = await getDocuments();
  return all.find((d) => d.id === id);
}

// Same id ho to purana replace hota hai, aur naya sabse upar aata hai
export async function saveDocument(doc: SavedDocument) {
  const all = await getDocuments();
  const rest = all.filter((d) => d.id !== doc.id);
  await AsyncStorage.setItem(KEY, JSON.stringify([doc, ...rest]));
}

// PDF export hone par recent list mein record daalo
export async function savePdfRecord(doc: {
  name: string;
  templateId: string;
  html: string;
  cover?: CoverDetails;
}) {
  await saveDocument({
    id: `pdf-${Date.now()}`,
    name: doc.name,
    templateId: doc.templateId,
    html: doc.html,
    cover: doc.cover,
    updatedAt: Date.now(),
    type: 'pdf',
  });
}
// 10m ago, 1h ago, 2d ago
export function timeAgo(timestamp: number): string {
  const minutes = Math.floor((Date.now() - timestamp) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export async function renameDocument(id: string, name: string) {
  const all = await getDocuments();
  const next = all.map((d) => (d.id === id ? { ...d, name } : d));
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function deleteDocument(id: string) {
  const all = await getDocuments();
  await AsyncStorage.setItem(
    KEY,
    JSON.stringify(all.filter((d) => d.id !== id)),
  );
}