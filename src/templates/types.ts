// Form ke woh fields jo cover page par aa sakte hain
export type FieldKey =
  | 'universityName'
  | 'assignmentTitle'
  | 'subjectName'
  | 'teacherName'
  | 'studentName'
  | 'rollNumber'
  | 'className'
  | 'submissionDate';

// Cover page ka layout kaisa hoga
export type TemplateLayout = 'centered' | 'leftAligned' | 'bordered' | 'banner';

// Ek field ki tafseel (form mein kaise dikhega)
export interface FieldConfig {
  label: string;
  placeholder: string;
  required: boolean;
}

// Ek template
export interface AssignmentTemplate {
  id: string;
  name: string;
  description: string;
  layout: TemplateLayout;
  accentColor: string;
  fields: FieldKey[];
}

// User ne form mein jo bhara
export type AssignmentFormValues = Partial<Record<FieldKey, string>>;