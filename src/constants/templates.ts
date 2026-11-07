import { colors } from '../theme/colors';
import type { CoverField } from '../utils/cover';

export type CoverLayout =
  | 'classic'
  | 'modern'
  | 'formal'
  | 'simple'
  | 'university'
  | 'bismillah';

export type CoverTemplate = {
  id: string;
  name: string;
  layout: CoverLayout | 'none'; // 'none' = no cover (Blank)
  accentColor: string;
  fields: CoverField[]; // fields shown in the form and on the cover
};

// Field order in the form is decided by CoverFormScreen, so order here doesn't matter
const ALL_FIELDS: CoverField[] = [
  'institute',
  'department',
  'assignmentTitle',
  'subject',
  'studentName',
  'rollNumber',
  'classSemester',
  'submittedTo',
  'submissionDate',
];

export const TEMPLATES: CoverTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    layout: 'classic',
    accentColor: colors.primary.DEFAULT,
    fields: ALL_FIELDS,
  },
  {
    id: 'modern',
    name: 'Modern',
    layout: 'modern',
    accentColor: '#1D4ED8',
    fields: [
      'institute',
      'department',
      'assignmentTitle',
      'subject',
      'studentName',
      'rollNumber',
      'submissionDate',
    ],
  },
  {
    id: 'formal',
    name: 'Formal',
    layout: 'formal',
    accentColor: colors.text.primary,
    fields: ALL_FIELDS,
  },
  {
    id: 'simple',
    name: 'Standard',
    layout: 'simple',
    accentColor: '#111827',
    fields: ALL_FIELDS,
  },
  {
    id: 'university',
    name: 'University Table',
    layout: 'university',
    accentColor: '#7F1D1D',
    fields: ALL_FIELDS,
  },
  {
    id: 'bismillah',
    name: 'Bismillah Style',
    layout: 'bismillah',
    accentColor: '#0F6B3F',
    fields: ALL_FIELDS,
  },
  {
    id: 'blank',
    name: 'Blank Assignment',
    layout: 'none',
    accentColor: colors.border.strong,
    fields: [],
  },
];

export const getTemplate = (id: string): CoverTemplate | undefined =>
  TEMPLATES.find((template) => template.id === id);
// import { colors } from '../theme/colors';
// import type { CoverField } from '../utils/cover';

// export type CoverLayout =
//   | 'classic'
//   | 'modern'
//   | 'formal'
//   | 'simple'
//   | 'university'
//   | 'bismillah';

// export type CoverTemplate = {
//   id: string;
//   name: string;
//   description: string;
//   layout: CoverLayout | 'none'; // 'none' = cover nahi (Blank)
//   accentColor: string;
//   fields: CoverField[]; // form mein kaun si fields aayengi
// };

// export const TEMPLATES: CoverTemplate[] = [
//   {
//     id: 'classic',
//     name: 'Classic',
//     description: 'Saada cover, beech mein aligned.',
//     layout: 'classic',
//     accentColor: colors.primary.DEFAULT,
//     fields: [
//       'institute',
//       'department',
//       'assignmentTitle',
//       'subject',
//       'studentName',
//       'rollNumber',
//       'classSemester',
//       'submittedTo',
//       'submissionDate',
//     ],
//   },
//   {
//     id: 'modern',
//     name: 'Modern',
//     description: 'Upar rangeen patti ke saath jadeed look.',
//     layout: 'modern',
//     accentColor: '#1D4ED8',
//     fields: [
//       'institute',
//       'department',
//       'assignmentTitle',
//       'subject',
//       'studentName',
//       'rollNumber',
//       'submissionDate',
//     ],
//   },
//   {
//     id: 'formal',
//     name: 'Formal',
//     description: 'Double border wala official style.',
//     layout: 'formal',
//     accentColor: colors.text.primary,
//     fields: [
//       'institute',
//       'department',
//       'assignmentTitle',
//       'subject',
//       'submittedTo',
//       'studentName',
//       'rollNumber',
//       'classSemester',
//       'submissionDate',
//     ],
//   },
//     {
//     id: 'simple',
//     name: 'Standard',
//     description: 'Sabse aam style: upar university, neeche Name / Roll No ki list.',
//     layout: 'simple',
//     accentColor: '#111827',
//     fields: [
//       'institute',
//       'department',
//       'assignmentTitle',
//       'subject',
//       'studentName',
//       'rollNumber',
//       'classSemester',
//       'submittedTo',
//       'submissionDate',
//     ],
//   },
//   {
//     id: 'university',
//     name: 'University Table',
//     description: 'Pakistani university style, details ki table ke saath.',
//     layout: 'university',
//     accentColor: '#7F1D1D',
//     fields: [
//       'institute',
//       'department',
//       'assignmentTitle',
//       'subject',
//       'studentName',
//       'rollNumber',
//       'classSemester',
//       'submittedTo',
//       'submissionDate',
//     ],
//   },
//   {
//     id: 'bismillah',
//     name: 'Bismillah Style',
//     description: 'Upar Bismillah aur double frame, sabz rang.',
//     layout: 'bismillah',
//     accentColor: '#0F6B3F',
//     fields: [
//       'institute',
//       'department',
//       'assignmentTitle',
//       'subject',
//       'studentName',
//       'rollNumber',
//       'classSemester',
//       'submittedTo',
//       'submissionDate',
//     ],
//   },
//   {
//     id: 'blank',
//     name: 'Blank Assignment',
//     description: 'Cover ke bagair, seedha likhna shuru.',
//     layout: 'none',
//     accentColor: colors.border.strong,
//     fields: [],
//   },
// ];

// export const getTemplate = (id: string): CoverTemplate | undefined =>
//   TEMPLATES.find((template) => template.id === id);