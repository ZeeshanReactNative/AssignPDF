import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { generatePDF } from 'react-native-html-to-pdf';
import { saveDocuments } from '@react-native-documents/picker';
import Share from 'react-native-share';
import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_TEXT_COLOR,
} from '../constants/editor';
import type { CoverDetails } from './cover';
import { buildCoverHtml, COVER_CSS } from './coverHtml';
import { saveDocument } from './documents';

// A4 in points (1 point = 1/72 inch)
const A4_WIDTH = 595;
const A4_HEIGHT = 842;

// Cover ke liye: chhapne wala hissa 515 x 762 pt hai (40pt margin).
// --cu = chaurai ka 1%, --ph ko thora kam rakha taake extra khali page na bane.
const wrapHtml = (content: string, cover?: CoverDetails) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  :root { --cu: 5.15pt; --ph: 755pt; }
  * { box-sizing: border-box; }
  @page { size: A4; margin: 40pt; }
  html, body { margin: 0; padding: 0; background: #ffffff; }
  body {
    font-family: ${DEFAULT_FONT_FAMILY.stack};
    font-size: ${DEFAULT_FONT_SIZE}pt;
    line-height: 1.3;
    color: ${DEFAULT_TEXT_COLOR};
    word-wrap: break-word;
    overflow-wrap: anywhere;
  }
  div, p { page-break-inside: avoid; }

  ${COVER_CSS}
  .cover { page-break-after: always; break-after: page; }
</style>
</head>
<body>${cover ? buildCoverHtml(cover) : ''}${content}</body>
</html>
`;

// File ka naam: sirf safe characters
const safeName = (title: string) =>
  title.replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'document';

// PDF banata hai aur uska path wapas deta hai
export async function createPdf(
  title: string,
  html: string,
  cover?: CoverDetails,
): Promise<string> {
  const result = await generatePDF({
    html: wrapHtml(html, cover),
    fileName: safeName(title),
    width: A4_WIDTH,
    height: A4_HEIGHT,
    padding: 40, // sirf iOS par, Android @page margin use karta hai
    bgColor: '#FFFFFF',
  });

  if (!result.filePath) {
    throw new Error('PDF ka path nahi mila');
  }
  return result.filePath;
}

// Android: seedha Downloads folder mein (dialog nahi)
async function saveToDownloads(title: string, filePath: string): Promise<string> {
  const fileName = `${safeName(title)}.pdf`;

  await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
    {
      name: fileName,
      parentFolder: '',
      mimeType: 'application/pdf',
    },
    'Download',
    filePath,
  );

  return fileName;
}

// iOS: Downloads folder nahi hota, isliye user "Save As" se jagah chunta hai
async function saveViaShareSheet(title: string, filePath: string): Promise<string> {
  await Share.open({
    url: `file://${filePath}`,
    type: 'application/pdf',
    title,
    failOnCancel: false,
  });

  return `${safeName(title)}.pdf`;
}

export async function savePdfToDevice(
  title: string,
  filePath: string,
): Promise<string | null> {
  return Platform.OS === 'android'
    ? saveToDownloads(title, filePath)
   : saveViaShareSheet(title, filePath);
}

// Banayi hui PDF ko WhatsApp / Gmail / Drive etc. ko bhejta hai
export async function sharePdf(title: string, filePath: string): Promise<void> {
  await Share.open({
    url: `file://${filePath}`,
    type: 'application/pdf',
    title,
    failOnCancel: false,
  });
}