
import ReactNativeBlobUtil from 'react-native-blob-util';
import JSZip from 'jszip';
import { keepLocalCopy, pick, types } from '@react-native-documents/picker';

export type ImportResult =
  | { kind: 'document'; name: string; html: string }
  | { kind: 'pdf'; name: string; path: string };

// ---------- chhote helpers ----------

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const unescapeXml = (text: string) =>
  text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');

// User ne picker band kiya: error nahi hai
const isCancel = (e: unknown) => {
  const err = e as { code?: unknown; message?: unknown };
  return /cancel/i.test(
    `${String(err?.code ?? '')} ${String(err?.message ?? '')}`,
  );
};

// ---------- Word (.docx) -> HTML ----------

// <w:b/> ya <w:b w:val="1"/> ON hai, w:val="0"/"false"/"none" band
const flagOn = (props: string, tag: string): boolean => {
  const match = props.match(new RegExp(`<w:${tag}(\\s[^>]*)?/>`));
  if (!match) return false;
  return !/w:val="(0|false|none)"/.test(match[1] ?? '');
};

// Ek run = ek tukra text jis ka ek hi style ho
const runToHtml = (run: string): string => {
  let text = '';

  for (const m of run.matchAll(
    /<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>|<w:tab\s*\/>|<w:br\s*\/>/g,
  )) {
    if (m[1] !== undefined) {
      text += escapeHtml(unescapeXml(m[1]));
    } else if (m[0].startsWith('<w:tab')) {
      text += '&nbsp;&nbsp;&nbsp;&nbsp;';
    } else {
      text += '<br>';
    }
  }

  if (!text) return '';

  const props = run.match(/<w:rPr>([\s\S]*?)<\/w:rPr>/)?.[1] ?? '';

  if (flagOn(props, 'u')) text = `<u>${text}</u>`;
  if (flagOn(props, 'i')) text = `<i>${text}</i>`;
  if (flagOn(props, 'b')) text = `<b>${text}</b>`;

  return text;
};

const paragraphToHtml = (paragraph: string): string => {
  const pPr = paragraph.match(/<w:pPr>([\s\S]*?)<\/w:pPr>/)?.[1] ?? '';
  const runs =
    paragraph.match(/<w:r(?:\s[^>]*)?>[\s\S]*?<\/w:r>/g) ?? [];

  let inner = runs.map(runToHtml).join('');

  if (!inner) return '<div><br></div>';

  // Heading / Title: bold
  if (/<w:pStyle w:val="(?:Heading\d|Title)"/i.test(pPr)) {
    inner = `<b>${inner}</b>`;
  }

  // List item: bullet
  if (/<w:numPr>/.test(pPr)) {
    inner = `• ${inner}`;
  }

  const jc = pPr.match(/<w:jc w:val="(\w+)"/)?.[1];

  const align =
    jc === 'center'
      ? 'center'
      : jc === 'right' || jc === 'end'
        ? 'right'
        : jc === 'both'
          ? 'justify'
          : '';

  return align
    ? `<div style="text-align:${align}">${inner}</div>`
    : `<div>${inner}</div>`;
};

async function docxToHtml(base64: string): Promise<string> {
  const zip = await JSZip.loadAsync(base64, { base64: true });

  const xml = await zip.file('word/document.xml')?.async('string');

  if (!xml) {
    throw new Error('Yeh sahi Word (.docx) file nahi lagti.');
  }

  const paragraphs =
    xml.match(/<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>|<w:p\s*\/>/g) ?? [];

  const html = paragraphs.map(paragraphToHtml).join('');

  return html || '<div><br></div>';
}

// ---------- Text (.txt) -> HTML ----------

const textToHtml = (text: string) =>
  text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) =>
      line ? `<div>${escapeHtml(line)}</div>` : '<div><br></div>',
    )
    .join('');

// ---------- Picker ----------

async function chooseFile() {
  try {
    const [file] = await pick({
      type: [types.docx, types.plainText, types.pdf],
    });

    return file;
  } catch (e) {
    if (isCancel(e)) return null;
    throw e;
  }
}

// Phone se file chuno aur uska content wapas lo. Cancel par null.
export async function importDocument(): Promise<ImportResult | null> {
  const file = await chooseFile();

  if (!file) return null;

  const fileName = file.name ?? 'document';

  const extension =
    fileName.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase() ?? '';

  const name = fileName.replace(/\.[^.]+$/, '') || 'Imported Document';

  if (extension === 'doc') {
    throw new Error(
      'Purani .doc file support nahi. Word mein "Save As" se .docx bana kar dobara try karo.',
    );
  }

  if (!['docx', 'txt', 'pdf'].includes(extension)) {
    throw new Error(
      'Sirf Word (.docx), Text (.txt) aur PDF files khul sakti hain.',
    );
  }

  // Unique safe filename: same naam ki file overwrite nahi hogi
  const safeFileName = `${Date.now()}_${fileName.replace(
    /[^a-zA-Z0-9._-]+/g,
    '_',
  )}`;

  // PDF permanently documentDirectory mein save hogi.
  // DOCX aur TXT temporary cache mein rahengi.
  const [copy] = await keepLocalCopy({
    files: [{ uri: file.uri, fileName: safeFileName }],
    destination:
      extension === 'pdf' ? 'documentDirectory' : 'cachesDirectory',
  });

  if (copy.status !== 'success') {
    throw new Error('File copy nahi ho saki.');
  }

  const path = decodeURIComponent(
    copy.localUri.replace(/^file:\/\//, ''),
  );

  // PDF: sirf viewing ke liye path return karo
  if (extension === 'pdf') {
    return {
      kind: 'pdf',
      name,
      path,
    };
  }

  // DOCX -> HTML
  if (extension === 'docx') {
    const base64 = await ReactNativeBlobUtil.fs.readFile(path, 'base64');

    return {
      kind: 'document',
      name,
      html: await docxToHtml(base64),
    };
  }

  // TXT -> HTML
  const text = await ReactNativeBlobUtil.fs.readFile(path, 'utf8');

  return {
    kind: 'document',
    name,
    html: textToHtml(text),
  };
}
const { fs } = ReactNativeBlobUtil;

const toPath = (localUri: string) =>
  decodeURIComponent(localUri.replace(/^file:\/\//, ''));

// "Open with" se aayi file (content:// ya file:// link)
export async function importFromUri(uri: string): Promise<ImportResult> {
  // Link ke aakhir mein naam ho to wohi, warna generic naam
  const lastPart = decodeURIComponent(uri).split('/').pop() ?? '';
  const named = /\.(pdf|docx|txt)$/i.test(lastPart) ? lastPart : '';
  const name = named.replace(/\.[^.]+$/, '') || 'Opened Document';

  const [copy] = await keepLocalCopy({
    files: [{ uri, fileName: `${Date.now()}_opened` }],
    destination: 'cachesDirectory',
  });
  if (copy.status !== 'success') {
    throw new Error('File khul nahi saki. Import button se try karo.');
  }
  const path = toPath(copy.localUri);

  // Pehle 4 bytes parh kar qism pehchano
  const headPath = `${path}.head`;
  await fs.slice(path, headPath, 0, 4);
  const head = await fs.readFile(headPath, 'base64');
  await fs.unlink(headPath);

  // PDF ("%PDF"): hamesha ke liye app ki jagah copy karo
  if (head.startsWith('JVBER')) {
    const saved = `${fs.dirs.DocumentDir}/${Date.now()}_${name.replace(/[^a-zA-Z0-9_-]+/g, '_')}.pdf`;
    await fs.cp(path, saved);
    await fs.unlink(path);
    return { kind: 'pdf', name, path: saved };
  }

  // Word (zip: "PK")
  if (head.startsWith('UEsD')) {
    const base64 = await fs.readFile(path, 'base64');
    return { kind: 'document', name, html: await docxToHtml(base64) };
  }

  // Warna text file maan lo, lekin binary ho to mana kar do
  const text = await fs.readFile(path, 'utf8');
  if (text.includes('\u0000')) {
    throw new Error('Sirf PDF, Word (.docx) aur Text files khul sakti hain.');
  }
  return { kind: 'document', name, html: textToHtml(text) };
}