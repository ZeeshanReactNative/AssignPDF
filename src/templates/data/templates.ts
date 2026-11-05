import { colors } from '../../theme';
import type { AssignmentTemplate } from '../types';

export const TEMPLATES: AssignmentTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Seedha saada cover page, beech mein aligned.',
    layout: 'centered',
    accentColor: colors.primary.DEFAULT,
    fields: [
      'universityName',
      'assignmentTitle',
      'subjectName',
      'teacherName',
      'studentName',
      'rollNumber',
      'className',
      'submissionDate',
    ],
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Upar rangeen patti ke saath jadeed look.',
    layout: 'banner',
    accentColor: colors.success.DEFAULT,
    fields: [
      'universityName',
      'assignmentTitle',
      'subjectName',
      'studentName',
      'rollNumber',
      'submissionDate',
    ],
  },
  {
    id: 'formal',
    name: 'Formal',
    description: 'Border wala official style, university ke liye munasib.',
    layout: 'bordered',
    accentColor: colors.text.primary,
    fields: [
      'universityName',
      'assignmentTitle',
      'subjectName',
      'teacherName',
      'studentName',
      'rollNumber',
      'className',
      'submissionDate',
    ],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Sirf zaroori maloomat, left se shuru.',
    layout: 'leftAligned',
    accentColor: colors.warning.DEFAULT,
    fields: ['assignmentTitle', 'subjectName', 'studentName', 'rollNumber'],
  },
];

export const getTemplateById = (id: string): AssignmentTemplate | undefined =>
  TEMPLATES.find(template => template.id === id);