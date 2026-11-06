import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'lastCover';

export type CoverDetails = {
  studentName: string;
  rollNumber: string;
  classSemester: string;
  assignmentTitle: string;
  subject: string;
  submittedTo: string;
  department: string;
  institute: string;
  submissionDate: string; // taiyar text, jaise '06 November 2026'
  templateId?: string; 
};

export const EMPTY_COVER: CoverDetails = {
  studentName: '',
  rollNumber: '',
  classSemester: '',
  assignmentTitle: '',
  subject: '',
  submittedTo: '',
  department: '',
  institute: '',
  submissionDate: '',
};

// Yeh fields har assignment mein same rehte hain, isliye yaad rakhte hain
const REMEMBERED = [
  'studentName',
  'rollNumber',
  'classSemester',
  'department',
  'institute',
] as const;

export async function getRememberedCover(): Promise<Partial<CoverDetails>> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Partial<CoverDetails>) : {};
  } catch {
    return {};
  }
}

export async function rememberCover(cover: CoverDetails) {
  const data: Partial<CoverDetails> = {};
  for (const key of REMEMBERED) data[key] = cover[key];
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// 2026-11-06 -> '06 November 2026'
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  return `${day} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
export type CoverField = Exclude<keyof CoverDetails, 'templateId'>;