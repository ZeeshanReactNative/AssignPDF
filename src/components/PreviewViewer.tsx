import { useMemo } from 'react';
import { WebView } from 'react-native-webview';
import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_TEXT_COLOR,
} from '../constants/editor';
import type { CoverDetails } from '../utils/cover';
import { buildCoverHtml, COVER_CSS } from '../utils/coverHtml';

type PreviewViewerProps = {
  html: string; // document ka text
  cover?: CoverDetails; // nahi ho to cover nahi dikhta
};

// Document ka HTML script ke andar safe tareeqe se jane ke liye
const toSafeJson = (value: string) =>
  JSON.stringify(value).replace(/</g, '\\u003c');

const buildHtml = (content: string, coverHtml: string) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; background: #E8EEF9; }
  body { padding: 16px 12px 40px; }

  #wrap { position: relative; width: var(--w); margin: 0 auto; }
  #sheet { position: relative; }

  ${COVER_CSS}
  #cover { margin-bottom: var(--gap); }

  #page {
    position: relative;
    width: 100%;
    min-height: var(--ph);
    padding: var(--p);
    background-image: linear-gradient(
      to bottom,
      #ffffff 0, #ffffff var(--ph),
      #E8EEF9 var(--ph), #E8EEF9 100%
    );
    background-size: 100% calc(var(--ph) + var(--gap));
    background-repeat: repeat-y;
    font-family: ${DEFAULT_FONT_FAMILY.stack};
    font-size: ${DEFAULT_FONT_SIZE}px;
    line-height: 1.3;
    color: ${DEFAULT_TEXT_COLOR};
    word-wrap: break-word;
    overflow-wrap: anywhere;
    -webkit-user-select: none;
    user-select: none;
  }

  #nums { position: absolute; left: 0; top: 0; width: 100%; pointer-events: none; z-index: 2; }

  .pn {
    position: absolute; left: 0; width: 100%;
    height: var(--p);
    display: flex; align-items: center; justify-content: center;
    font-family: sans-serif; font-size: var(--nf);
    color: #667085; line-height: 1;
  }

  .pg-sp { float: left; clear: left; pointer-events: none; }
  .pg-f { width: 1px; margin-right: -1px; height: var(--c); }
  .pg-g { width: 100%; height: calc(var(--p) * 2 + var(--gap)); }
</style>
</head>

<body>
  <div id="wrap">
    ${coverHtml ? `<div id="cover">${coverHtml}</div>` : ''}
    <div id="sheet">
      <div id="page"></div>
      <div id="nums"></div>
    </div>
  </div>

<script>
  var page = document.getElementById('page');
  var GAP = 20;
  var MAX_PAGES = 40;
  var PH = 0, P = 0;

  function setSizes() {
    var w = Math.min(window.innerWidth - 24, 900);
    PH = Math.round(w * 1.414);
    P = Math.round(w * 0.09);

    var s = document.documentElement.style;
    s.setProperty('--w', w + 'px');
    s.setProperty('--ph', PH + 'px');
    s.setProperty('--p', P + 'px');
    s.setProperty('--c', (PH - 2 * P) + 'px');
    s.setProperty('--gap', GAP + 'px');
    s.setProperty('--nf', Math.max(10, Math.round(w * 0.03)) + 'px');
    s.setProperty('--cu', (w / 100) + 'px');
  }

  function build() {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < MAX_PAGES; i++) {
      var f = document.createElement('div');
      f.className = 'pg-sp pg-f';
      var g = document.createElement('div');
      g.className = 'pg-sp pg-g';
      frag.appendChild(f);
      frag.appendChild(g);
    }
    page.appendChild(frag);

    var holder = document.createElement('div');
    holder.innerHTML = ${toSafeJson(content)};
    while (holder.firstChild) page.appendChild(holder.firstChild);
  }

  function contentBottom() {
    var last = null;
    for (var i = page.childNodes.length - 1; i >= 0; i--) {
      var n = page.childNodes[i];
      if (!(n.nodeType === 1 && n.classList.contains('pg-sp'))) { last = n; break; }
    }
    if (!last) return 0;

    var r = document.createRange();
    r.selectNode(last);
    var rects = r.getClientRects();
    if (!rects.length) return 0;
    return rects[rects.length - 1].bottom - page.getBoundingClientRect().top;
  }

  function fitPages() {
    var period = PH + GAP;
    var pages = Math.min(
      MAX_PAGES,
      Math.max(1, Math.floor((contentBottom() - 1) / period) + 1)
    );

    page.style.minHeight = (pages * PH + (pages - 1) * GAP) + 'px';

    var nums = document.getElementById('nums');
    nums.innerHTML = '';
    for (var i = 0; i < pages; i++) {
      var el = document.createElement('div');
      el.className = 'pn';
      el.textContent = String(i + 1);
      el.style.top = (i * period + PH - P) + 'px';
      nums.appendChild(el);
    }
  }

  setSizes();
  build();
  fitPages();
  window.addEventListener('resize', function () { setSizes(); fitPages(); });
</script>
</body>
</html>
`;

export function PreviewViewer({ html, cover }: PreviewViewerProps) {
  const source = useMemo(
    () => ({ html: buildHtml(html, cover ? buildCoverHtml(cover) : '') }),
    [html, cover],
  );

  return (
    <WebView
      originWhitelist={['*']}
      source={source}
      bounces={false}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: '#E8EEF9' }}
    />
  );
}