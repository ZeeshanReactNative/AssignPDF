import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from '../components/AppText';
import { Header } from '../components/Header';
import { HeaderAction } from '../components/HeaderAction';
import { ScreenContainer } from '../components/ScreenContainer';
import { getTemplate, TEMPLATES } from '../constants/templates';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import {
  EMPTY_COVER,
  formatDate,
  getRememberedCover,
  rememberCover,
  type CoverDetails,
  type CoverField,
} from '../utils/cover';

type Props = NativeStackScreenProps<RootStackParamList, 'CoverForm'>;

type TextField = Exclude<CoverField, 'submissionDate'>;

// Form mein fields isi tarteeb se aati hain (template ki list se chhaanti jati hain)
const FIELD_ORDER: CoverField[] = [
  'studentName',
  'rollNumber',
  'classSemester',
  'assignmentTitle',
  'subject',
  'submittedTo',
  'department',
  'institute',
  'submissionDate',
];

const FIELD_META: Record<TextField, { label: string; placeholder: string }> = {
  studentName: { label: 'Student Name', placeholder: 'e.g. Ali Khan' },
  rollNumber: { label: 'Roll Number', placeholder: 'e.g. 21-CS-045' },
  classSemester: { label: 'Class / Semester', placeholder: 'e.g. BSCS - 5th Semester' },
  assignmentTitle: { label: 'Assignment Title *', placeholder: 'e.g. Database Design' },
  subject: { label: 'Subject', placeholder: 'e.g. Database Systems' },
  submittedTo: { label: 'Submitted To', placeholder: 'e.g. Sir Ahmed' },
  department: { label: 'Department', placeholder: 'e.g. Computer Science' },
  institute: { label: 'Institute / University Name', placeholder: 'e.g. University of Karachi' },
};

export default function CoverFormScreen({ navigation, route }: Props) {
  const { templateId, title } = route.params;

  // Template na mile to pehla (Classic)
  const template = getTemplate(templateId) ?? TEMPLATES[0];
  const visible = FIELD_ORDER.filter((field) => template.fields.includes(field));
  const textFields = visible.filter((f): f is TextField => f !== 'submissionDate');
  const showDate = visible.includes('submissionDate');

  const [values, setValues] = useState<CoverDetails>(EMPTY_COVER);
  const [date, setDate] = useState(new Date());
  const [showIosPicker, setShowIosPicker] = useState(false);
  const [titleError, setTitleError] = useState(false);

  useEffect(() => {
    getRememberedCover().then((remembered) =>
      setValues((current) => ({ ...current, ...remembered })),
    );
  }, []);

  const setField = (key: TextField, text: string) => {
    setValues((current) => ({ ...current, [key]: text }));
    if (key === 'assignmentTitle') setTitleError(false);
  };

  const onDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (selected) setDate(selected);
  };

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({ value: date, mode: 'date', onChange: onDateChange });
    } else {
      setShowIosPicker((open) => !open);
    }
  };

  const handleSkip = () => {
    navigation.replace('Editor', { templateId, title });
  };

  const handleContinue = async () => {
    if (!values.assignmentTitle.trim()) {
      setTitleError(true);
      return;
    }

    const cover: CoverDetails = {
      ...values,
      submissionDate: formatDate(date),
      templateId,
    };

    (Object.keys(cover) as (keyof CoverDetails)[]).forEach((key) => {
      const value = cover[key];
      if (typeof value === 'string') cover[key] = value.trim();
    });

    // Pehle yaad rakho (sab fields ke saath), phir is template mein jo fields nahi, unhein khali karo
    await rememberCover(cover);

    const final: CoverDetails = { ...cover };
    FIELD_ORDER.forEach((field) => {
      if (!template.fields.includes(field)) final[field] = '';
    });

    navigation.replace('Editor', {
      templateId,
      title: final.assignmentTitle || title, // document ka naam = assignment title
      cover: final,
    });
  };

  return (
    <ScreenContainer edges={['left', 'right', 'bottom']} padded={false}>
      <Header
        title={`${template.name} Cover`}
        onBackPress={navigation.goBack}
        right={<HeaderAction label="Skip" onPress={handleSkip} />}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 py-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {textFields.map((key) => {
            const hasError = key === 'assignmentTitle' && titleError;
            return (
              <View key={key} className="mb-4">
                <AppText variant="label" className="mb-1.5 text-content-secondary">
                  {FIELD_META[key].label}
                </AppText>
                <TextInput
                  value={values[key]}
                  onChangeText={(text) => setField(key, text)}
                  placeholder={FIELD_META[key].placeholder}
                  placeholderTextColor={colors.text.muted}
                  className={`rounded-xl border bg-surface px-4 py-3 text-content-primary ${
                    hasError ? 'border-error' : 'border-line-strong'
                  }`}
                />
                {hasError ? (
                  <AppText variant="caption" className="mt-1 text-error">
                    Assignment title zaroori hai
                  </AppText>
                ) : null}
              </View>
            );
          })}

          {showDate ? (
            <View className="mb-4">
              <AppText variant="label" className="mb-1.5 text-content-secondary">
                Submission Date
              </AppText>
              <Pressable
                onPress={openDatePicker}
                className="rounded-xl border border-line-strong bg-surface px-4 py-3"
              >
                <AppText variant="body" className="text-content-primary">
                  {formatDate(date)}
                </AppText>
              </Pressable>

              {Platform.OS === 'ios' && showIosPicker ? (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                />
              ) : null}
            </View>
          ) : null}
        </ScrollView>

        <View className="border-t border-line bg-surface px-5 py-3">
          <Pressable
            onPress={handleContinue}
            className="items-center rounded-xl bg-accent py-3.5 active:bg-accent-dark"
          >
            <AppText variant="button" className="text-white">
              Save & Continue
            </AppText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}