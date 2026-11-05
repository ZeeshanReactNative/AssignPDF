import { useState, type ReactNode, type RefObject } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { AppText } from './AppText';
import { Icon } from './Icons';
import { ToolbarButton } from './ToolbarButton';
import type { FormatState, RichEditorHandle } from './RichEditor';
import {
  ALIGNMENTS,
  FONT_FAMILIES,
  FONT_SIZES,
  TEXT_COLORS,
} from '../constants/editor';
import { colors } from '../theme';
import { cn } from '../utils/cn';

type MenuName = 'font' | 'size' | 'color' | null;

type EditorToolbarProps = {
  format: FormatState;
  editorRef: RefObject<RichEditorHandle | null>;
};

// Chhota helper: sirf is file mein use hota hai
function Divider() {
  return <View className="mx-1 mr-3 h-6 w-px bg-line-strong" />;
}

type DropdownButtonProps = {
  open: boolean;
  onPress: () => void;
  children: ReactNode;
};

function DropdownButton({ open, onPress, children }: DropdownButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'mr-2 h-10 flex-row items-center rounded-lg px-3',
        open ? 'bg-primary-light' : 'bg-background',
      )}
    >
      {children}
      <AppText variant="caption" className="ml-1 text-content-secondary">
        {open ? '▲' : '▼'}
      </AppText>
    </Pressable>
  );
}

export function EditorToolbar({ format, editorRef }: EditorToolbarProps) {
  const [openMenu, setOpenMenu] = useState<MenuName>(null);

  const toggleMenu = (name: Exclude<MenuName, null>) =>
    setOpenMenu((current) => (current === name ? null : name));

  // Koi bhi format lagne par dropdown band
  const run = (action: (editor: RichEditorHandle) => void) => {
    setOpenMenu(null);
    if (editorRef.current) action(editorRef.current);
  };

  return (
    <View>
 {/* Row 2: Bold / Italic / Underline / Alignment */}
      <View className="border-b border-line bg-surface px-3 py-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ alignItems: 'center' }}
        >
          <ToolbarButton active={format.bold} onPress={() => run((e) => e.toggleBold())}>
            <AppText variant="title" className="font-bold text-content-primary">
              B
            </AppText>
          </ToolbarButton>

          <ToolbarButton active={format.italic} onPress={() => run((e) => e.toggleItalic())}>
            <AppText variant="title" className="italic text-content-primary">
              I
            </AppText>
          </ToolbarButton>

          <ToolbarButton
            active={format.underline}
            onPress={() => run((e) => e.toggleUnderline())}
          >
            <AppText variant="title" className="underline text-content-primary">
              U
            </AppText>
          </ToolbarButton>

          <Divider />

          {ALIGNMENTS.map((a) => (
            <ToolbarButton
              key={a.value}
              active={format.align === a.value}
              onPress={() => run((e) => e.setAlign(a.value))}
            >
              <Icon name={a.icon} size={20} color={colors.text.primary} />
            </ToolbarButton>
          ))}
        </ScrollView>
      </View>

      {/* Row 1: Font family / Size / Color */}
      <View className="border-b border-line bg-surface px-3 py-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ alignItems: 'center' , gap: 12,}}
        >
          <DropdownButton open={openMenu === 'font'} onPress={() => toggleMenu('font')}>
            <AppText variant="label" numberOfLines={1} className="text-content-primary">
              {format.fontFamily}
            </AppText>
          </DropdownButton>

          <DropdownButton open={openMenu === 'size'} onPress={() => toggleMenu('size')}>
            <AppText variant="label" className="text-content-primary">
              {format.fontSize}
            </AppText>
          </DropdownButton>

          <DropdownButton open={openMenu === 'color'} onPress={() => toggleMenu('color')}>
            <View className="items-center">
              <View
                className="h-3 w-5 rounded-full"
                style={{ backgroundColor: format.color }}
              />
            </View>
          </DropdownButton>
        </ScrollView>
      </View>

      {/* Dropdown panel: Row 1 ke neeche, normal flow mein (touch sahi chalta hai) */}
      {openMenu ? (
        <View className="border-b border-line bg-surface px-4 py-3">
          {openMenu === 'font' ? (
            <View>
              {FONT_FAMILIES.map((f) => (
                <Pressable
                  key={f.name}
                  onPress={() => run((e) => e.setFontFamily(f.stack))}
                  className={cn(
                    'mb-1 rounded-lg px-3 py-3',
                    format.fontFamily === f.name ? 'bg-primary-light' : 'bg-transparent',
                  )}
                >
                  <AppText variant="body" className="text-content-primary">
                    {f.name}
                  </AppText>
                </Pressable>
              ))}
            </View>
          ) : null}

          {openMenu === 'size' ? (
            <View className="flex-row flex-wrap">
              {FONT_SIZES.map((size) => (
                <ToolbarButton
                  key={size}
                  active={format.fontSize === size}
                  onPress={() => run((e) => e.setFontSize(size))}
                >
                  <AppText variant="label" className="text-content-primary">
                    {size}
                  </AppText>
                </ToolbarButton>
              ))}
            </View>
          ) : null}

          {openMenu === 'color' ? (
            <View className="flex-row flex-wrap">
              {TEXT_COLORS.map((c) => {
                const active = format.color.toUpperCase() === c.value;
                return (
                  <Pressable
                    key={c.value}
                    onPress={() => run((e) => e.setColor(c.value))}
                    accessibilityLabel={c.name}
                    className={cn(
                      'mr-2 h-10 w-10 items-center justify-center rounded-lg',
                      active ? 'bg-primary-light' : 'bg-transparent',
                    )}
                  >
                    <View
                      className="h-6 w-6 rounded-full"
                      style={{
                        backgroundColor: c.value,
                        borderWidth: active ? 2 : 0,
                        borderColor: '#12397A',
                      }}
                    />
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </View>
      ) : null}

     
    </View>
  );
}