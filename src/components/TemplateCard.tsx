import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { AppText } from './AppText';
import type { CoverTemplate } from '../constants/templates';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
import type { CoverDetails, CoverField } from '../utils/cover';
import { buildCoverHtml, COVER_CSS } from '../utils/coverHtml';

// Sample data used only for the preview
const SAMPLE: CoverDetails = {
  studentName: 'Your Name',
  rollNumber: 'Your RollNO',
  classSemester: 'BSCS - 1st Semester',
  assignmentTitle: 'Computer Type',
  subject: 'Computer Science',
  submittedTo: 'Sir Name',
  department: 'Department of Computer Science',
  institute: 'University of Name',
  submissionDate: 'DD Month YYYY',
};

// Fields that the template doesn't use are left empty, same as the real cover
function sampleCover(template: CoverTemplate): CoverDetails {
  const cover: CoverDetails = { ...SAMPLE, templateId: template.id };

  (Object.keys(SAMPLE) as CoverField[]).forEach((key) => {
    if (!template.fields.includes(key)) cover[key] = '';
  });

  return cover;
}

// The cover is drawn at 400px wide (so text never gets below Android's minimum
// font size) and then scaled down to the card width.
const PAGE_WIDTH = 400;
const PAGE_HEIGHT = Math.round(PAGE_WIDTH * 1.414);

const buildThumbHtml = (coverHtml: string) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<style>
  :root { --cu: ${PAGE_WIDTH / 100}px; --ph: ${PAGE_HEIGHT}px; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #ffffff; overflow: hidden; }
  #s { width: ${PAGE_WIDTH}px; height: ${PAGE_HEIGHT}px; transform-origin: 0 0; }
  ${COVER_CSS}
</style>
</head>
<body>
  <div id="s">${coverHtml}</div>
  <script>
    document.getElementById('s').style.transform =
      'scale(' + (window.innerWidth / ${PAGE_WIDTH}) + ')';
  </script>
</body>
</html>
`;

// Blank template: an empty page with a few faint lines
function BlankPreview() {
  return (
    <View className="flex-1 bg-surface p-4">
      {[80, 70, 75, 60].map((width, index) => (
        <View
          key={index}
          style={{
            width: `${width}%`,
            height: 4,
            marginTop: 8,
            borderRadius: 2,
            backgroundColor: colors.border.DEFAULT,
          }}
        />
      ))}
    </View>
  );
}

type TemplateCardProps = {
  template: CoverTemplate;
  onPress?: (template: CoverTemplate) => void;
};

export function TemplateCard({ template, onPress }: TemplateCardProps) {
  const html = useMemo(
    () =>
      template.layout === 'none'
        ? ''
        : buildThumbHtml(buildCoverHtml(sampleCover(template))),
    [template],
  );

  return (
    <Pressable
      onPress={() => onPress?.(template)}
      className="m-1.5 flex-1 rounded-2xl bg-surface p-3 active:opacity-80"
      style={shadows.sm}
    >
      {/* pointerEvents none: the tap goes to the card, not to the WebView */}
      <View
        pointerEvents="none"
        className="overflow-hidden rounded-md border border-line bg-surface"
        style={{ aspectRatio: 1 / 1.414 }}
      >
        {template.layout === 'none' ? (
          <BlankPreview />
        ) : (
          <WebView
            originWhitelist={['*']}
            source={{ html }}
            scrollEnabled={false}
            bounces={false}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1, backgroundColor: '#ffffff' }}
          />
        )}
      </View>

      <AppText
        variant="label"
        numberOfLines={1}
        className="mt-3 text-center text-content-primary"
      >
        {template.name}
      </AppText>
    </Pressable>
  );
}
// import type { ReactNode } from 'react';
// import { Pressable, View, type DimensionValue } from 'react-native';
// import { AppText } from './AppText';
// import type { CoverTemplate } from '../constants/templates';
// import { colors } from '../theme/colors';
// import { shadows } from '../theme/shadows';

// // Thumbnail ki ek lakeer
// type LineProps = {
//   w?: DimensionValue;
//   h?: number;
//   color?: string;
//   left?: boolean;
//   mt?: number;
// };

// function Line({ w = '60%', h = 3, color = colors.border.strong, left = false, mt = 4 }: LineProps) {
//   return (
//     <View
//       style={{
//         width: w,
//         height: h,
//         marginTop: mt,
//         borderRadius: 2,
//         backgroundColor: color,
//         alignSelf: left ? 'flex-start' : 'center',
//       }}
//     />
//   );
// }

// type ThumbProps = { layout: CoverTemplate['layout']; accent: string };

// function CoverThumb({ layout, accent }: ThumbProps) {
//   let body: ReactNode;

//   switch (layout) {
//     case 'classic':
//       body = (
//         <View style={{ flex: 1, margin: 5, borderWidth: 1.5, borderColor: accent, padding: 5 }}>
//           <Line color={accent} w="70%" h={4} />
//           <Line w="40%" />
//           <Line color={accent} w="75%" h={6} mt={14} />
//           <Line w="50%" mt={8} />
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto' }}>
//             <View style={{ width: '45%', height: 12, backgroundColor: colors.border.strong, borderRadius: 2 }} />
//             <View style={{ width: '45%', height: 12, backgroundColor: colors.border.strong, borderRadius: 2 }} />
//           </View>
//         </View>
//       );
//       break;

//     case 'modern':
//       body = (
//         <View style={{ flex: 1 }}>
//           <View style={{ height: 24, backgroundColor: accent }} />
//           <View style={{ padding: 6 }}>
//             <Line left color={accent} w="70%" h={6} mt={10} />
//             <Line left w="45%" />
//             <Line left w="60%" mt={14} />
//             <Line left w="50%" />
//           </View>
//         </View>
//       );
//       break;

//     case 'formal':
//       body = (
//         <View style={{ flex: 1, margin: 4, borderWidth: 1.5, borderColor: accent, padding: 2 }}>
//           <View style={{ flex: 1, borderWidth: 1, borderColor: accent, padding: 5 }}>
//             <Line color={accent} w="65%" h={4} />
//             <Line color={accent} w="70%" h={6} mt={14} />
//             <Line w="50%" mt={14} />
//             <Line w="45%" />
//             <Line w="50%" />
//           </View>
//         </View>
//       );
//       break;

//         case 'simple':
//       body = (
//         <View style={{ flex: 1, padding: 7 }}>
//           <Line color={accent} w="65%" h={4} />
//           <Line w="40%" />
//           <Line color={accent} w="70%" h={6} mt={14} />
//           <View style={{ marginTop: 'auto' }}>
//             {[0, 1, 2, 3].map((i) => (
//               <View key={i} style={{ flexDirection: 'row', marginTop: 4 }}>
//                 <View style={{ width: '35%', height: 3, borderRadius: 2, backgroundColor: accent }} />
//                 <View style={{ width: '45%', height: 3, marginLeft: 6, borderRadius: 2, backgroundColor: colors.border.strong }} />
//               </View>
//             ))}
//           </View>
//         </View>
//       );
//       break;

//     case 'university':
//       body = (
//         <View style={{ flex: 1, margin: 5, borderWidth: 1.5, borderColor: accent, padding: 4 }}>
//           <Line color={accent} w="60%" h={4} />
//           <Line color={accent} w="70%" h={6} mt={8} />
//           <View style={{ marginTop: 'auto', borderWidth: 1, borderColor: accent }}>
//             {[0, 1, 2].map((i) => (
//               <View
//                 key={i}
//                 style={{ height: 8, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: accent }}
//               />
//             ))}
//           </View>
//         </View>
//       );
//       break;

//     case 'bismillah':
//       body = (
//         <View style={{ flex: 1, margin: 4, borderWidth: 1.5, borderColor: accent, padding: 2 }}>
//           <View style={{ flex: 1, borderWidth: 1, borderColor: accent, padding: 5 }}>
//             <Line color={accent} w="50%" h={5} />
//             <Line color={accent} w="70%" h={6} mt={14} />
//             <Line w="50%" mt={10} />
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto' }}>
//               <View style={{ width: '45%', height: 10, backgroundColor: colors.border.strong, borderRadius: 2 }} />
//               <View style={{ width: '45%', height: 10, backgroundColor: colors.border.strong, borderRadius: 2 }} />
//             </View>
//           </View>
//         </View>
//       );
//       break;

//     default:
//       // 'none' (Blank): khali kaghaz
//       body = (
//         <View style={{ padding: 8 }}>
//           <Line left w="80%" />
//           <Line left w="70%" />
//           <Line left w="75%" />
//         </View>
//       );
//   }

//   return (
//     <View className="h-32 w-full items-center justify-center rounded-lg bg-primary-light">
//       <View className="h-28 w-[62%] overflow-hidden rounded-sm bg-surface" style={shadows.sm}>
//         {body}
//       </View>
//     </View>
//   );
// }

// type TemplateCardProps = {
//   template: CoverTemplate;
//   onPress?: (template: CoverTemplate) => void;
// };

// export function TemplateCard({ template, onPress }: TemplateCardProps) {
//   return (
//     <Pressable
//       onPress={() => onPress?.(template)}
//       className="m-1.5 flex-1 rounded-2xl bg-surface p-3 active:opacity-80"
//       style={shadows.sm}
//     >
//       <CoverThumb layout={template.layout} accent={template.accentColor} />
//       <AppText variant="label" numberOfLines={2} className="mt-3 text-center text-content-primary">
//         {template.name}
//       </AppText>
//       <AppText
//         variant="caption"
//         numberOfLines={2}
//         className="mt-1 text-center text-content-secondary"
//       >
//         {template.description}
//       </AppText>
//     </Pressable>
//   );
// }