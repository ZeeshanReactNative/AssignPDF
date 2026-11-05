import type { FieldConfig, FieldKey } from '../types';

export const FIELD_CONFIGS: Record<FieldKey, FieldConfig> = {
  universityName: {
    label: 'University / College',
    placeholder: 'e.g. University of Karachi',
    required: true,
  },
  assignmentTitle: {
    label: 'Assignment title',
    placeholder: 'e.g. Data Structures Lab 3',
    required: true,
  },
  subjectName: {
    label: 'Subject',
    placeholder: 'e.g. Computer Science',
    required: true,
  },
  teacherName: {
    label: 'Teacher name',
    placeholder: 'e.g. Sir Ahmed',
    required: false,
  },
  studentName: {
    label: 'Student name',
    placeholder: 'e.g. Ali Khan',
    required: true,
  },
  rollNumber: {
    label: 'Roll number',
    placeholder: 'e.g. 21-CS-045',
    required: true,
  },
  className: {
    label: 'Class / Section',
    placeholder: 'e.g. BSCS - 4B',
    required: false,
  },
  submissionDate: {
    label: 'Submission date',
    placeholder: 'e.g. 15 March 2026',
    required: false,
  },
};