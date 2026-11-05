import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Text,
  TextInput,
  View,
  useWindowDimensions,
  type TextStyle,
} from 'react-native';
import { AppText } from './AppText';
import { colors } from '../theme';
import { shadows } from '../theme/shadows';

const LINE_HEIGHT = 24;
const PAGE_PADDING = 24;
const A4_RATIO = 1.414; // A4 = 210mm x 297mm
const SCREEN_MARGIN = 16;

type PagedEditorProps = {
  value: string;
  onChange: (text: string) => void;
  textStyle?: TextStyle;
};

export function PagedEditor({ value, onChange, textStyle }: PagedEditorProps) {
  const { width } = useWindowDimensions();

  // A4 ka size screen ki width se nikalta hai
  const pageWidth = width - SCREEN_MARGIN * 2;
  const pageHeight = Math.round(pageWidth * A4_RATIO);
  const contentWidth = pageWidth - PAGE_PADDING * 2;
  const linesPerPage = Math.floor((pageHeight - PAGE_PADDING * 2) / LINE_HEIGHT);
  const inputHeight = linesPerPage * LINE_HEIGHT;

  // Measure aur TextInput dono ka style bilkul same hona chahiye
  const baseStyle: TextStyle = {
    fontSize: 16,
    lineHeight: LINE_HEIGHT,
    color: colors.text.primary,
    includeFontPadding: false,
    ...textStyle,
  };

  const [lines, setLines] = useState<string[]>([]);

  // Lines ko pages mein baanto
  const pages = useMemo(() => {
    const result: string[] = [];
    for (let i = 0; i < lines.length; i += linesPerPage) {
      result.push(lines.slice(i, i + linesPerPage).join(''));
    }
    return result.length > 0 ? result : [''];
  }, [lines, linesPerPage]);

  // Cursor ko track karte hain taake page badalne par focus sahi page par jaye
  const inputs = useRef<(TextInput | null)[]>([]);
  const focusedPage = useRef(0);
  const cursor = useRef(0); // poore text mein cursor ki position
  const [forcedSelection, setForcedSelection] = useState<{
    page: number;
    start: number;
  } | null>(null);

  useEffect(() => {
    if (value === '') setLines([]);
  }, [value]);

  // Text overflow ho kar agle page par chala gaya to cursor bhi wahin le jao
  useEffect(() => {
    let offset = 0;
    for (let i = 0; i < pages.length; i++) {
      const len = pages[i].length;
      const isLast = i === pages.length - 1;
      if (cursor.current < offset + len || isLast) {
        if (i !== focusedPage.current && cursor.current > offset) {
          focusedPage.current = i;
          setForcedSelection({ page: i, start: cursor.current - offset });
          inputs.current[i]?.focus();
        }
        break;
      }
      offset += len;
    }
  }, [pages]);

  const offsetOf = (pageIndex: number) =>
    pages.slice(0, pageIndex).reduce((sum, p) => sum + p.length, 0);

  const handleChange = (pageIndex: number, text: string) => {
    const before = pages.slice(0, pageIndex).join('');
    const after = pages.slice(pageIndex + 1).join('');
    onChange(before + text + after);
  };

  return (
    <View className="items-center py-4">
      {/* Chhupa hua Text: sirf lines naapne ke liye */}
      <Text
        pointerEvents="none"
        style={[
          baseStyle,
          { position: 'absolute', opacity: 0, width: contentWidth },
        ]}
        onTextLayout={(e) => setLines(e.nativeEvent.lines.map((l) => l.text))}
      >
        {value}
      </Text>

      {pages.map((pageText, index) => (
        <View key={index} className="mb-4 items-center">
          <View
            className="bg-surface"
            style={[
              {
                width: pageWidth,
                height: pageHeight,
                padding: PAGE_PADDING,
              },
              shadows.md,
            ]}
          >
            <TextInput
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              value={pageText}
              onChangeText={(text) => handleChange(index, text)}
              onFocus={() => {
                focusedPage.current = index;
              }}
              onSelectionChange={(e) => {
                cursor.current = offsetOf(index) + e.nativeEvent.selection.start;
                if (forcedSelection) setForcedSelection(null);
              }}
              selection={
                forcedSelection?.page === index
                  ? { start: forcedSelection.start, end: forcedSelection.start }
                  : undefined
              }
              multiline
              scrollEnabled={false}
              textAlignVertical="top"
              placeholder={index === 0 ? 'Yahan likhna shuru karo...' : undefined}
              placeholderTextColor={colors.text.muted}
              style={[
                baseStyle,
                { height: inputHeight, padding: 0 },
              ]}
            />
          </View>
          <AppText variant="caption" className="mt-2 text-content-secondary">
            Page {index + 1} / {pages.length}
          </AppText>
        </View>
      ))}
    </View>
  );
}