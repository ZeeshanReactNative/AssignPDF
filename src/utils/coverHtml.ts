import { getTemplate, type CoverLayout } from '../constants/templates';
import { colors } from '../theme/colors';
import type { CoverDetails } from './cover';

// User ka likha text HTML ke andar safe tareeqe se jaye
const e = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// ---------- CSS: --cu = page ki chaurai ka 1%, --ac = template ka rang ----------
export const COVER_CSS = `
  .cover {
    width: 100%;
    height: var(--ph);
    background: #ffffff;
    font-family: Georgia, 'Times New Roman', serif;
    color: #111827;
    overflow: hidden;
    --ac: #12397A;
  }
  .cover .inst {
    font-size: calc(var(--cu) * 4.4);
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: calc(var(--cu) * 0.2);
    text-transform: uppercase;
    color: var(--ac);
    overflow-wrap: anywhere;
  }
  .cover .dept {
    margin-top: calc(var(--cu) * 1.5);
    font-size: calc(var(--cu) * 3.2);
    color: #475467;
  }
  .cover .rule {
    width: calc(var(--cu) * 14);
    height: calc(var(--cu) * 0.5);
    margin: calc(var(--cu) * 3) auto 0;
    background: var(--ac);
  }
  .cover .tag {
    font-size: calc(var(--cu) * 2.8);
    font-weight: 700;
    letter-spacing: calc(var(--cu) * 0.9);
    color: var(--ac);
  }
  .cover .title {
    margin-top: calc(var(--cu) * 3);
    font-size: calc(var(--cu) * 7.5);
    font-weight: 700;
    line-height: 1.2;
    color: var(--ac);
    overflow-wrap: anywhere;
  }
  .cover .subject {
    margin-top: calc(var(--cu) * 3);
    font-size: calc(var(--cu) * 3.8);
    color: #344054;
  }
  .cover .row {
    margin-top: calc(var(--cu) * 1);
    font-size: calc(var(--cu) * 3);
    line-height: 1.3;
    overflow-wrap: anywhere;
  }
  .cover .k { margin-right: calc(var(--cu) * 1.5); color: #667085; }
  .cover .v { font-weight: 700; }
  .cover .date {
    margin-top: calc(var(--cu) * 4);
    font-size: calc(var(--cu) * 3);
    color: #475467;
  }
  .cover .boxes { display: flex; text-align: left; }
  .cover .box { flex: 1; }
  .cover .box + .box { margin-left: calc(var(--cu) * 4); }
  .cover .h {
    padding-bottom: calc(var(--cu) * 1);
    margin-bottom: calc(var(--cu) * 1);
    border-bottom: calc(var(--cu) * 0.3) solid #D0D5DD;
    font-size: calc(var(--cu) * 2.6);
    font-weight: 700;
    letter-spacing: calc(var(--cu) * 0.4);
    text-transform: uppercase;
    color: var(--ac);
  }

  /* 1. Classic */
  .l-classic { padding: calc(var(--cu) * 4); }
  .l-classic .frame {
    height: 100%;
    padding: calc(var(--cu) * 5);
    border: calc(var(--cu) * 0.6) solid var(--ac);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
  }

  /* 2. Modern: upar rangeen patti */
  .l-modern { display: flex; flex-direction: column; }
  .l-modern .band {
    padding: calc(var(--cu) * 8) calc(var(--cu) * 7);
    background: var(--ac);
  }
  .l-modern .band .inst { color: #ffffff; }
  .l-modern .band .dept { color: rgba(255, 255, 255, 0.85); }
  .l-modern .mid {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 calc(var(--cu) * 7);
  }
  .l-modern .info {
    margin: 0 calc(var(--cu) * 7) calc(var(--cu) * 7);
    padding-left: calc(var(--cu) * 3);
    border-left: calc(var(--cu) * 0.8) solid var(--ac);
  }

  /* 3. Formal: double border, sab beech mein */
  .l-formal { padding: calc(var(--cu) * 3); }
  .l-formal .frame {
    height: 100%;
    padding: calc(var(--cu) * 6);
    border: calc(var(--cu) * 1.2) double var(--ac);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
  }
  .l-formal .title {
    font-size: calc(var(--cu) * 6.5);
    text-transform: uppercase;
  }
  .l-formal .row { margin-top: calc(var(--cu) * 1.4); }

 /* 4. Standard: Traditional University Cover */
.l-simple {
  padding: calc(var(--cu) * 8) calc(var(--cu) * 10);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: center;
}

.l-simple .inst {
  font-size: calc(var(--cu) * 4.5);
}

.l-simple .dept {
  font-size: calc(var(--cu) * 3.3);
}

.l-simple .title {
  font-size: calc(var(--cu) * 6.5);
}

.l-simple > div:nth-child(2) {
  margin-top: calc(var(--cu) * 7);
}

.l-simple .assignment-label {
  margin-top: calc(var(--cu) * 8);
}

.l-simple .lwrap {
  width: 100%;
  margin-top: calc(var(--cu) * 5);
  padding-top: calc(var(--cu) * 3);
  border-top: calc(var(--cu) * 0.3) solid #D0D5DD;
}

.l-simple .list {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.l-simple .list td {
  padding: calc(var(--cu) * 2) calc(var(--cu) * 1);
  font-size: calc(var(--cu) * 3.3);
  line-height: 1.4;
  vertical-align: top;
  overflow-wrap: anywhere;
  color: #111827;
}

.l-simple .list tr:not(:last-child) td {
  border-bottom: calc(var(--cu) * 0.15) solid #EAECF0;
}

.l-simple .list .lk {
  width: 38%;
  font-weight: 700;
  color: #344054;
}


  /* 5. University: details ki table */
  .l-university { padding: calc(var(--cu) * 4); }
  .l-university .frame {
    height: 100%;
    padding: calc(var(--cu) * 5);
    border: calc(var(--cu) * 0.5) solid var(--ac);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
  }
  .l-university .tbox {
    padding: calc(var(--cu) * 4);
    border: calc(var(--cu) * 0.5) solid var(--ac);
  }
  .l-university .tbl {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }
  .l-university .tbl th,
  .l-university .tbl td {
    padding: calc(var(--cu) * 1.8) calc(var(--cu) * 2.5);
    border: calc(var(--cu) * 0.3) solid var(--ac);
    font-size: calc(var(--cu) * 3);
    overflow-wrap: anywhere;
  }
  .l-university .tbl th {
    width: 38%;
    background: #F2F4F7;
    color: var(--ac);
  }

  /* 6. Bismillah: Arabic header + double frame */
  .l-bismillah { padding: calc(var(--cu) * 3); }
  .l-bismillah .frame {
    height: 100%;
    padding: calc(var(--cu) * 1.2);
    border: calc(var(--cu) * 0.6) solid var(--ac);
  }
  .l-bismillah .inner {
    height: 100%;
    padding: calc(var(--cu) * 5);
    border: calc(var(--cu) * 0.25) solid var(--ac);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
  }
  .l-bismillah .bism {
    margin-bottom: calc(var(--cu) * 3);
    font-family: 'Noto Naskh Arabic', 'Traditional Arabic', 'Scheherazade', serif;
    font-size: calc(var(--cu) * 6.5);
    line-height: 1.6;
    color: var(--ac);
  }
`;

// ---------- HTML ke chhote tukde ----------
type Data = {
  inst: string;
  dept: string;
  title: string;
  subject: string;
  name: string;
  roll: string;
  cls: string;
  to: string;
  date: string;
};

// Khali value ho to poori line gayab
const row = (label: string, value: string) =>
  value
    ? `<div class="row"><span class="k">${label}</span><span class="v">${e(value)}</span></div>`
    : '';

const box = (heading: string, rows: string) =>
  rows ? `<div class="box"><div class="h">${heading}</div>${rows}</div>` : '';

const names = (d: Data) =>
  (d.inst ? `<div class="inst">${e(d.inst)}</div>` : '') +
  (d.dept ? `<div class="dept">${e(d.dept)}</div>` : '');

const header = (d: Data) =>
  names(d) + (d.inst || d.dept ? '<div class="rule"></div>' : '');

const heading = (d: Data) =>
  `<div class="tag">ASSIGNMENT</div>` +
  `<div class="title">${e(d.title)}</div>` +
  (d.subject ? `<div class="subject">${e(d.subject)}</div>` : '');

const dateLine = (d: Data) => (d.date ? `<div class="date">Date: ${e(d.date)}</div>` : '');

const boxes = (d: Data) =>
  `<div class="boxes">` +
  box('Submitted By', row('Name', d.name) + row('Roll No', d.roll) + row('Class', d.cls)) +
  box('Submitted To', row('Name', d.to)) +
  `</div>` +
  dateLine(d);

const allRows = (d: Data) =>
  row('Name', d.name) +
  row('Roll No', d.roll) +
  row('Class', d.cls) +
  row('Submitted To', d.to) +
  row('Date', d.date);

const tableRow = (label: string, value: string) =>
  value ? `<tr><th>${label}</th><td>${e(value)}</td></tr>` : '';

// Standard layout ki list: bold label, colon, phir value
const listRow = (label: string, value: string) =>
  value
    ? `<tr><td class="lk">${label}:</td><td>${e(value)}</td></tr>`
    : '';

const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

// ---------- 6 layouts ----------
const LAYOUTS: Record<CoverLayout, (d: Data) => string> = {
  classic: (d) =>
    `<div class="frame"><div>${header(d)}</div><div>${heading(d)}</div><div>${boxes(d)}</div></div>`,

  modern: (d) =>
    `<div class="band">${names(d)}</div>` +
    `<div class="mid">${heading(d)}</div>` +
    `<div class="info">${allRows(d)}</div>`,

  formal: (d) =>
    `<div class="frame"><div>${header(d)}</div><div>${heading(d)}</div><div>${allRows(d)}</div></div>`,

  simple: (d) => {
  const rows =
    listRow('Name', d.name) +
    listRow('Roll No', d.roll) +
    listRow('Class / Semester', d.cls) +
    listRow('Assignment', d.title) +
    listRow('Submitted To', d.to) +
    listRow('Date', d.date);

  return (
    `<div>${header(d)}</div>` +
    `<div class="tag assignment-label">ASSIGNMENT</div>` +
    `<div class="lwrap">` +
    `${rows ? `<table class="list">${rows}</table>` : ''}` +
    `</div>`
  );
},

  university: (d) => {
    const rows =
      tableRow('Student Name', d.name) +
      tableRow('Roll Number', d.roll) +
      tableRow('Class / Semester', d.cls) +
      tableRow('Submitted To', d.to) +
      tableRow('Date', d.date);

    return (
      `<div class="frame">` +
      `<div>${header(d)}</div>` +
      `<div class="tbox">${heading(d)}</div>` +
      `<div>${rows ? `<table class="tbl">${rows}</table>` : ''}</div>` +
      `</div>`
    );
  },

  bismillah: (d) =>
    `<div class="frame"><div class="inner">` +
    `<div><div class="bism">${BISMILLAH}</div>${header(d)}</div>` +
    `<div>${heading(d)}</div>` +
    `<div>${boxes(d)}</div>` +
    `</div></div>`,
};

export function buildCoverHtml(cover: CoverDetails): string {
  // Template na mile (purane documents) to Classic
  const template = cover.templateId ? getTemplate(cover.templateId) : undefined;
  const layout: CoverLayout =
    template && template.layout !== 'none' ? template.layout : 'classic';
  const accent = template?.accentColor ?? colors.primary.DEFAULT;

  const d: Data = {
    inst: cover.institute.trim(),
    dept: cover.department.trim(),
    title: cover.assignmentTitle.trim(),
    subject: cover.subject.trim(),
    name: cover.studentName.trim(),
    roll: cover.rollNumber.trim(),
    cls: cover.classSemester.trim(),
    to: cover.submittedTo.trim(),
    date: cover.submissionDate.trim(),
  };

  return `<div class="cover l-${layout}" style="--ac:${accent}">${LAYOUTS[layout](d)}</div>`;
}