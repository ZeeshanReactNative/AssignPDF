import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import { AppText } from './AppText';
import { colors } from '../theme/colors';

type NameModalProps = {
  visible: boolean;
  defaultName: string; // shown in the input (the template name at first)
  confirmLabel: string; // "Save" or "Continue"
  onCancel: () => void;
  onConfirm: (name: string) => void;
};

export function NameModal({
  visible,
  defaultName,
  confirmLabel,
  onCancel,
  onConfirm,
}: NameModalProps) {
  const [name, setName] = useState(defaultName);
  const [error, setError] = useState(false);

  // Every time the modal opens, start fresh
  useEffect(() => {
    if (visible) {
      setName(defaultName);
      setError(false);
    }
  }, [visible, defaultName]);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError(true);
      return;
    }
    onConfirm(trimmed);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        {/* Dark background: tapping it closes the modal */}
        <Pressable
          className="flex-1 items-center justify-center bg-black/40 px-6"
          onPress={onCancel}
        >
          {/* Tapping inside the box must not close it */}
          <Pressable className="w-full rounded-2xl bg-surface p-5" onPress={() => {}}>
            <AppText variant="title" className="text-content-primary">
              Name your document
            </AppText>
            <AppText variant="bodySmall" className="mt-1 text-content-secondary">
              This name is used for the file and in your recent documents.
            </AppText>

            <TextInput
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError(false);
              }}
              autoFocus
              selectTextOnFocus
              maxLength={60}
              placeholder="Document name"
              placeholderTextColor={colors.text.muted}
              returnKeyType="done"
              onSubmitEditing={submit}
              className={`mt-4 rounded-xl border px-4 py-3 text-content-primary ${
                error ? 'border-error' : 'border-line-strong'
              }`}
            />
            {error ? (
              <AppText variant="caption" className="mt-1 text-error">
                Please enter a name
              </AppText>
            ) : null}

            <View className="mt-5 flex-row justify-end">
              <Pressable onPress={onCancel} className="rounded-lg bg-background px-4 py-2.5">
                <AppText variant="label" className="text-content-primary">
                  Cancel
                </AppText>
              </Pressable>

              <Pressable
                onPress={submit}
                className="ml-2 rounded-lg bg-primary px-4 py-2.5 active:opacity-80"
              >
                <AppText variant="label" className="text-white">
                  {confirmLabel}
                </AppText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}