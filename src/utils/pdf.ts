// import { generatePDF } from 'react-native-html-to-pdf';
// import {
//   DEFAULT_FONT_FAMILY,
//   DEFAULT_FONT_SIZE,
//   DEFAULT_TEXT_COLOR,
// } from '../constants/editor';

// // A4 in points (1 point = 1/72 inch)
// const A4_WIDTH = 595;
// const A4_HEIGHT = 842;

// // Editor ka HTML ek A4 document mein lapet do
// const wrapHtml = (content: string) => `
// <!DOCTYPE html>
// <html>
// <head>
// <meta charset="utf-8" />
// <style>
//   @page { size: A4; margin: 40pt; }
//   html, body { margin: 0; padding: 0; background: #ffffff; }
//   body {
//     font-family: ${DEFAULT_FONT_FAMILY.stack};
//     font-size: ${DEFAULT_FONT_SIZE}pt;
//     line-height: 1.3;
//     color: ${DEFAULT_TEXT_COLOR};
//     word-wrap: break-word;
//     overflow-wrap: anywhere;
//   }
//   /* Line page ke beech se na kate */
//   div, p { page-break-inside: avoid; }
// </style>
// </head>
// <body>${content}</body>
// </html>
// `;

// // File ka naam: sirf safe characters
// const safeName = (title: string) =>
//   title.replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'document';

// // PDF banata hai aur uska path wapas deta hai
// export async function createPdf(title: string, html: string): Promise<string> {
  
//     const result = await generatePDF({
//     html: wrapHtml(html),
//     fileName: safeName(title),
//     width: A4_WIDTH,
//     height: A4_HEIGHT,
//     // Yeh padding sirf iOS par lagti hai, Android @page margin use karta hai
//     padding: 40,
//     bgColor: '#FFFFFF',
//   });

//   if (!result.filePath) {
//     throw new Error('PDF ka path nahi mila');
//   }
//   return result.filePath;
// }


import { generatePDF } from 'react-native-html-to-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_TEXT_COLOR,
} from '../constants/editor';
import Share from 'react-native-share';
// A4 in points (1 point = 1/72 inch)
const A4_WIDTH = 595;
const A4_HEIGHT = 842;

// Editor ka HTML ek A4 document mein lapet do
const wrapHtml = (content: string) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
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
  /* Line page ke beech se na kate */
  div, p { page-break-inside: avoid; }
</style>
</head>
<body>${content}</body>
</html>
`;

// File ka naam: sirf safe characters
const safeName = (title: string) =>
  title.replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'document';

// PDF banata hai aur uska path wapas deta hai
export async function createPdf(title: string, html: string): Promise<string> {
  const result = await generatePDF({
    html: wrapHtml(html),
    fileName: safeName(title),
    width: A4_WIDTH,
    height: A4_HEIGHT,
    // Yeh padding sirf iOS par lagti hai, Android @page margin use karta hai
    padding: 40,
    bgColor: '#FFFFFF',
  });

  if (!result.filePath) {
    throw new Error('PDF ka path nahi mila');
  }

  return result.filePath;
}

// Generated PDF ko Android Downloads/AssignPDF folder mein save karta hai
export async function savePdfToDevice(
  title: string,
  filePath: string,
): Promise<string> {
  const fileName = `${safeName(title)}.pdf`;

  const uri = await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
    {
      name: fileName,
      parentFolder: 'AssignPDF',
      mimeType: 'application/pdf',
    },
    'Download',
    filePath,
  );

  if (!uri) {
    throw new Error('PDF could not be saved to Downloads.');
  }

  return fileName;
}
// Banayi hui PDF ko WhatsApp / Gmail / Drive etc. ko bhejta hai
export async function sharePdf(title: string, filePath: string): Promise<void> {
  await Share.open({
    url: `file://${filePath}`, // file:// lagana zaroori hai
    type: 'application/pdf',
    title,
    failOnCancel: false, // user share sheet band kare to error nahi
  });
}