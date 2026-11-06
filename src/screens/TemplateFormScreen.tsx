// import React, { useRef } from 'react';
// import { TextInput } from 'react-native';
// import {
//   AppButton,
//   AppCard,
//   AppHeader,
//   AppInput,
//   AppText,
//   EmptyState,
//   ScreenContainer,
// } from '../components';
// import { TemplatePreview } from '../components/TemplatePreview';
// import { useAssignmentForm } from '../hooks/useAssignmentForm';
// import type { RootStackScreenProps } from '../navigation/types';
// import { FIELD_CONFIGS } from '../templates/data/fields';
// import { getTemplateById } from '../templates/data/templates';
// import type { FieldKey } from '../templates/types';
// import { useAssignment } from '../assignment';

// // Defined outside the component so it keeps the same reference on every render
// const NO_FIELDS: FieldKey[] = [];

// export const TemplateFormScreen = ({
//   navigation,
//   route,
// }: RootStackScreenProps<'TemplateForm'>) => {
//     const { draft, dispatch } = useAssignment();

//   const template = getTemplateById(route.params.templateId);
//   const fields = template?.fields ?? NO_FIELDS;

//   const { values, errors, setValue, validateField, validateAll } =
//     useAssignmentForm(fields, );

//   const inputRefs = useRef<Partial<Record<FieldKey, TextInput | null>>>({});

//   const focusField = (key?: FieldKey) => {
//     if (key) {
//       inputRefs.current[key]?.focus();
//     }
//   };

//   const handleSubmit = () => {
//     if (!template) {
//       return;
//     }

//     const firstInvalid = validateAll();
//     if (firstInvalid) {
//       focusField(firstInvalid);
//       return;
//     }

//    dispatch({ type: 'SET_COVER_VALUES', values });
// navigation.navigate('PagesEditor');
//   };

//   return (
//     <ScreenContainer scrollable>
//       <AppHeader
//         title={template ? `${template.name} template` : 'Details'}
//         subtitle="Fill in your assignment details"
//         onBackPress={() => navigation.goBack()}
//       />

//       {template ? (
//         <>
//           <AppCard className="mt-2">
//             <AppText variant="h3">Your details</AppText>
//             <AppText variant="caption" color="secondary" className="mt-1">
//               Fields marked with * are required.
//             </AppText>

//             {fields.map((key, index) => {
//               const config = FIELD_CONFIGS[key];
//               const isLast = index === fields.length - 1;

//               return (
//                 <AppInput
//                   key={key}
//                   ref={node => {
//                     inputRefs.current[key] = node;
//                   }}
//                   label={config.required ? `${config.label} *` : config.label}
//                   placeholder={config.placeholder}
//                   value={values[key] ?? ''}
//                   onChangeText={text => setValue(key, text)}
//                   onBlur={() => validateField(key)}
//                   error={errors[key]}
//                   returnKeyType={isLast ? 'done' : 'next'}
//                   onSubmitEditing={() => focusField(fields[index + 1])}
//                   containerClassName="mt-4"
//                 />
//               );
//             })}
//           </AppCard>

//           <AppButton
//             title="Continue"
//             onPress={handleSubmit}
//             fullWidth
//             className="mt-4"
//           />

//           <AppText variant="title" className="mb-2 mt-6">
//             Live preview
//           </AppText>
//           <TemplatePreview template={template} values={values} />
//         </>
//       ) : (
//         <EmptyState
//           title="Template not found"
//           description="This template may have been removed."
//           actionLabel="Go back"
//           onActionPress={() => navigation.goBack()}
//         />
//       )}
//     </ScreenContainer>
//   );
// };