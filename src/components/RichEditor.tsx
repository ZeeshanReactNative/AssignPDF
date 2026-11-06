import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_TEXT_COLOR,
} from '../constants/editor';
import type { CoverDetails } from '../utils/cover';
import { buildCoverHtml, COVER_CSS } from '../utils/coverHtml';
export type FormatState = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  fontSize: number;
  fontFamily: string; // sirf pehla naam, jaise 'Arial'
  color: string; // hex, jaise '#DC2626'
  align: 'left' | 'center' | 'right' | 'justify';
};

export type RichEditorHandle = {
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleUnderline: () => void;
  setAlign: (align: 'left' | 'center' | 'right' | 'justify') => void;
  setFontSize: (px: number) => void;
  setFontFamily: (stack: string) => void;
  setColor: (hex: string) => void;
};

type RichEditorProps = {
  onChange?: (html: string) => void;
  onFormatChange?: (state: FormatState) => void;
  initialHtml?: string; // purana document kholne ke liye
  cover?: CoverDetails;
};

const EDITOR_HTML = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; background: #E8EEF9; }
  body { padding: 16px 12px 40px; }

  #wrap {
    position: relative;
    width: var(--w);
    margin: 0 auto;
  }

  #page {
    position: relative;
    width: 100%;
    min-height: var(--ph);
    padding: var(--p);

    background-image: linear-gradient(
      to bottom,
      #ffffff 0,
      #ffffff var(--ph),
      #E8EEF9 var(--ph),
      #E8EEF9 100%
    );
    background-size: 100% calc(var(--ph) + var(--gap));
    background-repeat: repeat-y;

    font-family: ${DEFAULT_FONT_FAMILY.stack};
    font-size: ${DEFAULT_FONT_SIZE}px;
    line-height: 1.3;
    color: ${DEFAULT_TEXT_COLOR};
    outline: none;
    word-wrap: break-word;
    overflow-wrap: anywhere;
  }

  #nums {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    pointer-events: none;
    z-index: 2;
  }

  .pn {
    position: absolute;
    left: 0;
    width: 100%;
    height: var(--p);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: sans-serif;
    font-size: var(--nf);
    color: #667085;
    line-height: 1;
    -webkit-user-select: none;
    user-select: none;
  }

  .pg-sp {
    float: left;
    clear: left;
    pointer-events: none;
    -webkit-user-select: none;
    user-select: none;
  }

  .pg-f {
    width: 1px;
    margin-right: -1px;
    height: var(--c);
  }

  .pg-g {
    width: 100%;
    height: calc(var(--p) * 2 + var(--gap));
  }

  #page.empty::before {
    content: attr(data-placeholder);
    position: absolute;
    top: var(--p);
    left: var(--p);
    color: #98A2B3;
    pointer-events: none;
  }
  ${COVER_CSS}

  #sheet { position: relative; }

  #cover {
    display: none;
    margin-bottom: var(--gap);
    -webkit-user-select: none;
    user-select: none;
  }
  #cover.on { display: block; }
</style>
</head>

<body>

  <div id="wrap">
    <div id="cover"></div>
    <div id="sheet">
      <div id="page" contenteditable="true" data-placeholder="Yahan likhna shuru karo..."><div><br></div></div>
      <div id="nums"></div>
    </div>
  </div>

<script>
  var page = document.getElementById('page');
  var DEFAULT_SIZE = ${DEFAULT_FONT_SIZE};
  var DEFAULT_COLOR = '${DEFAULT_TEXT_COLOR}';
  var DEFAULT_FONT = '${DEFAULT_FONT_FAMILY.name}';
  var GAP = 20;
  var MAX_PAGES = 40;
  var PH = 0, P = 0;

  // Khali cursor par chuni hui size yaad rakhne ke liye
  var pending = null; // { size, node, offset }

  function send(obj) {
    window.ReactNativeWebView.postMessage(JSON.stringify(obj));
  }

  window.onerror = function (msg, src, line) {
    send({ type: 'error', data: msg + ' (line ' + line + ')' });
  };

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

  // Sabse pehle: page ka size set ho jaye, chahe aage kuch bhi ho
  setSizes();

  function buildSpacers() {
    var frag = document.createDocumentFragment();

    for (var i = 0; i < MAX_PAGES; i++) {
      var f = document.createElement('div');
      f.className = 'pg-sp pg-f';
      f.contentEditable = 'false';

      var g = document.createElement('div');
      g.className = 'pg-sp pg-g';
      g.contentEditable = 'false';

      frag.appendChild(f);
      frag.appendChild(g);
    }

    page.insertBefore(frag, page.firstChild);
  }

  function isSpacer(n) {
    return n.nodeType === 1 && n.classList.contains('pg-sp');
  }

  // Spacers ya paragraph mit jayen (select all + delete) to dobara banao
  function ensureStructure() {
    var count = page.querySelectorAll('.pg-sp').length;

    if (count !== MAX_PAGES * 2) {
      var old = page.querySelectorAll('.pg-sp');
      for (var i = 0; i < old.length; i++) old[i].remove();
      buildSpacers();
    }

    var hasContent = false;
    for (var j = 0; j < page.childNodes.length; j++) {
      if (!isSpacer(page.childNodes[j])) { hasContent = true; break; }
    }

    if (!hasContent) {
      var d = document.createElement('div');
      d.innerHTML = '<br>';
      page.appendChild(d);

      var r = document.createRange();
      r.setStart(d, 0);
      r.collapse(true);
      var s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
    }
  }

  function contentBottom() {
    var last = null;

    for (var i = page.childNodes.length - 1; i >= 0; i--) {
      if (!isSpacer(page.childNodes[i])) {
        last = page.childNodes[i];
        break;
      }
    }

    if (!last) return 0;

    var r = document.createRange();
    r.selectNode(last);

    var rects = r.getClientRects();
    if (!rects.length) return 0;

    return rects[rects.length - 1].bottom - page.getBoundingClientRect().top;
  }

  function isEmpty() {
    var clone = page.cloneNode(true);
    var sp = clone.querySelectorAll('.pg-sp');

    for (var i = 0; i < sp.length; i++) {
      sp[i].remove();
    }

    return clone.textContent.replace(/\\s/g, '') === '' &&
      !clone.querySelector('img');
  }

  function fitPages() {
    ensureStructure();

    var period = PH + GAP;
    var bottom = contentBottom();

    var pages = Math.min(
      MAX_PAGES,
      Math.max(1, Math.floor((bottom - 1) / period) + 1)
    );

    page.style.minHeight = (pages * PH + (pages - 1) * GAP) + 'px';
    page.classList.toggle('empty', isEmpty());

    var nums = document.getElementById('nums');

    while (nums.children.length < pages) {
      var d = document.createElement('div');
      d.className = 'pn';
      nums.appendChild(d);
    }

    while (nums.children.length > pages) {
      nums.removeChild(nums.lastChild);
    }

    for (var i = 0; i < pages; i++) {
      var el = nums.children[i];
      el.textContent = String(i + 1);
      el.style.top = (i * period + PH - P) + 'px';
    }
  }

  function cleanHtml() {
    var clone = page.cloneNode(true);
    var sp = clone.querySelectorAll('.pg-sp');

    for (var i = 0; i < sp.length; i++) {
      sp[i].remove();
    }

    return clone.innerHTML;
  }

  // 'rgb(220, 38, 38)' -> '#DC2626'
  function rgbToHex(rgb) {
    var m = rgb.match(/\\d+/g);
    if (!m || m.length < 3) return DEFAULT_COLOR.toUpperCase();

    var hex = '#';
    for (var i = 0; i < 3; i++) {
      var h = parseInt(m[i], 10).toString(16);
      hex += h.length === 1 ? '0' + h : h;
    }
    return hex.toUpperCase();
  }

  // "'Times New Roman', Times, serif" -> 'Times New Roman'
  function firstFont(family) {
    var first = (family || '').split(',')[0];
    var name = first.replace(/["']/g, '').trim();
    return name || DEFAULT_FONT;
  }

  function currentFormat() {
    var size = DEFAULT_SIZE;
    var align = 'left';
    var color = DEFAULT_COLOR.toUpperCase();
    var font = DEFAULT_FONT;

    var sel = window.getSelection();

    if (sel.rangeCount) {
      var node = sel.anchorNode;
      var el = node && node.nodeType === 3 ? node.parentElement : node;

      if (el && page.contains(el)) {
        var cs = window.getComputedStyle(el);

        size = Math.round(parseFloat(cs.fontSize)) || DEFAULT_SIZE;
        color = rgbToHex(cs.color);
        font = firstFont(cs.fontFamily);

        align = cs.textAlign === 'center'
          ? 'center'
          : (cs.textAlign === 'right' || cs.textAlign === 'end')
          ? 'right'
          : cs.textAlign === 'justify'
          ? 'justify'
          : 'left';
      }

      // Khali cursor par chuni hui size dikhao, jab tak cursor wahin hai
      if (pending) {
        if (sel.isCollapsed &&
            sel.anchorNode === pending.node &&
            sel.anchorOffset === pending.offset) {
          size = pending.size;
        } else {
          pending = null;
        }
      }
    }

    return {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      fontSize: size,
      fontFamily: font,
      color: color,
      align: align
    };
  }

  function report() {
    try {
      fitPages();
      send({ type: 'format', data: currentFormat() });
    } catch (e) {
      send({ type: 'error', data: 'report: ' + e.message });
    }
  }

  function emitChange() {
    try {
      fitPages();
      send({ type: 'change', data: cleanHtml() });
    } catch (e) {
      send({ type: 'error', data: 'emitChange: ' + e.message });
    }
  }

  window.cmd = function (name) {
    page.focus();
    document.execCommand(name, false, null);
    report();
    emitChange();
  };

  // Saved document wapas load karne ke liye
  window.setContent = function (html) {
    try {
      var kids = Array.prototype.slice.call(page.childNodes);
      for (var i = 0; i < kids.length; i++) {
        if (!isSpacer(kids[i])) page.removeChild(kids[i]);
      }

      var holder = document.createElement('div');
      holder.innerHTML = html;
      while (holder.firstChild) page.appendChild(holder.firstChild);

      report();
      emitChange();
    } catch (e) {
      send({ type: 'error', data: 'setContent: ' + e.message });
    }
  };

  // Cover page dikhao ya chhupao
  window.setCover = function (html) {
    try {
      var el = document.getElementById('cover');
      el.innerHTML = html || '';
      el.className = html ? 'on' : '';
      fitPages();
    } catch (e) {
      send({ type: 'error', data: 'setCover: ' + e.message });
    }
  };

  // Text ka color: selection par, ya khali cursor ho to agle text par
  window.setColor = function (hex) {
    try {
      page.focus();

      document.execCommand('styleWithCSS', false, true);
      document.execCommand('foreColor', false, hex);
      document.execCommand('styleWithCSS', false, false);

      report();
      emitChange();
    } catch (e) {
      send({ type: 'error', data: 'setColor: ' + e.message });
    }
  };

  // Font family: selection par, ya khali cursor ho to agle text par
  window.setFont = function (stack) {
    try {
      page.focus();

      document.execCommand('styleWithCSS', false, true);
      document.execCommand('fontName', false, stack);
      document.execCommand('styleWithCSS', false, false);

      report();
      emitChange();
    } catch (e) {
      send({ type: 'error', data: 'setFont: ' + e.message });
    }
  };

  // <font size="7"> ko asli px wale <span> se badlo, naye spans wapas do
  function convertFonts(px) {
    var fonts = page.querySelectorAll('font[size="7"]');
    var spans = [];

    for (var i = 0; i < fonts.length; i++) {
      var span = document.createElement('span');
      span.style.fontSize = px + 'px';
      span.innerHTML = fonts[i].innerHTML;
      fonts[i].parentNode.replaceChild(span, fonts[i]);
      spans.push(span);
    }

    return spans;
  }

  window.setSize = function (px) {
    try {
      page.focus();

      var sel = window.getSelection();
      if (!sel.rangeCount) return;

      // Kuch select nahi: agla likha hua text is size mein hoga
      if (sel.isCollapsed) {
        document.execCommand('fontSize', false, '7');
        pending = { size: px, node: sel.anchorNode, offset: sel.anchorOffset };
        report();
        return;
      }

      document.execCommand('fontSize', false, '7');
      var spans = convertFonts(px);

      // Selection wapas lagao, warna highlight purani size par rehta hai
      if (spans.length) {
        var range = document.createRange();
        var lastSpan = spans[spans.length - 1];
        range.setStart(spans[0], 0);
        range.setEnd(lastSpan, lastSpan.childNodes.length);
        sel.removeAllRanges();
        sel.addRange(range);
      }

      pending = null;
      report();
      emitChange();
    } catch (e) {
      send({ type: 'error', data: 'setSize: ' + e.message });
    }
  };

  // Paste: bold / italic / underline rakho.
  // Font size, color aur font family IGNORE: pasted text default mein aaye.
  function clean(node) {
    if (node.nodeType === 3) {
      return document.createTextNode(node.textContent);
    }

    if (node.nodeType !== 1) {
      return document.createDocumentFragment();
    }

    var tag = node.tagName.toLowerCase();

    if (['script', 'style', 'meta', 'link', 'head', 'title'].indexOf(tag) > -1) {
      return document.createDocumentFragment();
    }

    if (tag === 'br') {
      return document.createElement('br');
    }

    var st = node.style || {};

    var isBold = tag === 'b' || tag === 'strong' ||
      st.fontWeight === 'bold' || parseInt(st.fontWeight, 10) >= 600;

    var isItalic = tag === 'i' || tag === 'em' || st.fontStyle === 'italic';

    var isUnder = tag === 'u' ||
      (st.textDecoration || '').indexOf('underline') > -1 ||
      (st.textDecorationLine || '').indexOf('underline') > -1;

    var isBlock = [
      'p', 'div', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'tr'
    ].indexOf(tag) > -1;

    var out = document.createDocumentFragment();

    for (var i = 0; i < node.childNodes.length; i++) {
      out.appendChild(clean(node.childNodes[i]));
    }

    var wrapped = out;

    if (isBold) {
      var b = document.createElement('b');
      b.appendChild(wrapped);
      wrapped = b;
    }

    if (isItalic) {
      var it = document.createElement('i');
      it.appendChild(wrapped);
      wrapped = it;
    }

    if (isUnder) {
      var u = document.createElement('u');
      u.appendChild(wrapped);
      wrapped = u;
    }

    if (isBlock) {
      var d = document.createElement('div');
      d.appendChild(wrapped);
      return d;
    }

    return wrapped;
  }

  page.addEventListener('paste', function (e) {
    var cd = e.clipboardData || window.clipboardData;
    var html = cd.getData('text/html');

    e.preventDefault();

    if (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var holder = document.createElement('div');
      holder.appendChild(clean(doc.body));
      document.execCommand('insertHTML', false, holder.innerHTML);
    } else {
      document.execCommand('insertText', false, cd.getData('text/plain'));
    }

    emitChange();
    report();
  });

  page.addEventListener('input', function () {
    // Khali cursor par size chuni thi: ab typed text par lagao
    if (pending && page.querySelector('font[size="7"]')) {
      var spans = convertFonts(pending.size);

      if (spans.length) {
        var last = spans[spans.length - 1];
        var r = document.createRange();
        r.selectNodeContents(last);
        r.collapse(false);
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
      }

      pending = null;
    }

    emitChange();
    report();
  });

  document.addEventListener('selectionchange', report);

  window.addEventListener('resize', function () {
    setSizes();
    fitPages();
  });

  buildSpacers();
  fitPages();
</script>

</body>
</html>
`;

export const RichEditor = forwardRef<RichEditorHandle, RichEditorProps>(
  ({ onChange, onFormatChange, initialHtml, cover }, ref) => {
    const webRef = useRef<WebView>(null);
    const [ready, setReady] = useState(false);

    const run = (js: string) =>
      webRef.current?.injectJavaScript(`${js}; true;`);

    // Cover: WebView load hone ke baad, ya cover badalne par
    useEffect(() => {
      if (!ready) return;
      const html = cover ? buildCoverHtml(cover) : '';
      run(`window.setCover(${JSON.stringify(html)})`);
    }, [ready, cover]);

    // WebView load ho jaye aur html mil jaye, tab saved content daalo
    useEffect(() => {
      if (ready && initialHtml) {
        run(`window.setContent(${JSON.stringify(initialHtml)})`);
      }
    }, [ready, initialHtml]);

    useImperativeHandle(ref, () => ({
      toggleBold: () => run("window.cmd('bold')"),
      toggleItalic: () => run("window.cmd('italic')"),
      toggleUnderline: () => run("window.cmd('underline')"),
      setAlign: (align) => {
        const commands = {
          left: 'justifyLeft',
          center: 'justifyCenter',
          right: 'justifyRight',
          justify: 'justifyFull',
        } as const;

        run(`window.cmd('${commands[align]}')`);
      },
      setFontSize: (px) => run(`window.setSize(${px})`),
      // JSON.stringify: stack ke andar ke quotes safe rehte hain
      setFontFamily: (stack) => run(`window.setFont(${JSON.stringify(stack)})`),
      setColor: (hex) => run(`window.setColor('${hex}')`),
    }));

    const handleMessage = (event: WebViewMessageEvent) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data);

        if (msg.type === 'change') onChange?.(msg.data);
        if (msg.type === 'format') onFormatChange?.(msg.data);
        if (msg.type === 'error') console.warn('[Editor error]', msg.data);
      } catch {
        // Ignore invalid messages
      }
    };

    return (
      <WebView
        ref={webRef}
        originWhitelist={['*']}
        source={{ html: EDITOR_HTML }}
        onMessage={handleMessage}
        onLoadEnd={() => setReady(true)}
        hideKeyboardAccessoryView
        keyboardDisplayRequiresUserAction={false}
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: '#E8EEF9' }}
      />
    );
  },
);

RichEditor.displayName = 'RichEditor';