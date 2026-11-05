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
import { cn } from '../utils/cn';

type DocumentMenuProps = {
  visible: boolean;
  documentName: string;
  onClose: () => void;
  onEdit: () => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
};

type Mode = 'menu' | 'rename' | 'delete';

export function DocumentMenu({
  visible,
  documentName,
  onClose,
  onEdit,
  onRename,
  onDelete,
}: DocumentMenuProps) {
  const [mode, setMode] = useState<Mode>('menu');
  const [name, setName] = useState(documentName);

  // Har dafa menu khule to shuru se
  useEffect(() => {
    if (visible) {
      setMode('menu');
      setName(documentName);
    }
  }, [visible, documentName]);

  const submitRename = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onRename(trimmed);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        {/* Andhera background: dabane par band */}
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={onClose}
        >
          {/* Andar dabane par band na ho */}
          <Pressable
            className="rounded-t-3xl bg-surface px-5 pb-8 pt-5"
            onPress={() => {}}
          >
            <AppText
              variant="title"
              numberOfLines={1}
              className="mb-4 text-content-primary"
            >
              {documentName}
            </AppText>

            {mode === 'menu' ? (
              <View>
                <MenuRow label="Edit" onPress={onEdit} />
                <MenuRow label="Rename" onPress={() => setMode('rename')} />
                <MenuRow
                  label="Delete"
                  danger
                  onPress={() => setMode('delete')}
                />
              </View>
            ) : null}

            {mode === 'rename' ? (
              <View>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  autoFocus
                  selectTextOnFocus
                  placeholder="Document name"
                  placeholderTextColor={colors.text.muted}
                  onSubmitEditing={submitRename}
                  returnKeyType="done"
                  className="rounded-xl border border-line-strong px-4 py-3 text-content-primary"
                />
                <View className="mt-4 flex-row justify-end">
                  <ActionButton label="Cancel" onPress={() => setMode('menu')} />
                  <ActionButton label="Save" primary onPress={submitRename} />
                </View>
              </View>
            ) : null}

            {mode === 'delete' ? (
              <View>
                <AppText variant="body" className="text-content-secondary">
                  Kya aap is document ko delete karna chahte hain? Yeh wapas
                  nahi aayega.
                </AppText>
                <View className="mt-4 flex-row justify-end">
                  <ActionButton label="Cancel" onPress={() => setMode('menu')} />
                  <ActionButton label="Delete" danger onPress={onDelete} />
                </View>
              </View>
            ) : null}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

type MenuRowProps = {
  label: string;
  onPress: () => void;
  danger?: boolean;
};

function MenuRow({ label, onPress, danger = false }: MenuRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-xl px-3 py-4 active:bg-background"
    >
      <AppText
        variant="body"
        className={danger ? 'text-error' : 'text-content-primary'}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  primary?: boolean;
  danger?: boolean;
};

function ActionButton({
  label,
  onPress,
  primary = false,
  danger = false,
}: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'ml-2 rounded-lg px-4 py-2.5',
        primary && 'bg-primary',
        danger && 'bg-error',
        !primary && !danger && 'bg-background',
      )}
    >
      <AppText
        variant="label"
        className={primary || danger ? 'text-white' : 'text-content-primary'}
      >
        {label}
      </AppText>
    </Pressable>
  );
}