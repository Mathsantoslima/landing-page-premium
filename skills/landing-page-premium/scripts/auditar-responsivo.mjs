#!/usr/bin/env node
// auditar-responsivo.mjs
// Auditoria por largura da landing page (seção 12.7 da skill).
// Dependência única: playwright.
//
// Instalação, uma vez por projeto:
//   npm i -D playwright && npx playwright install chromium
//
// Uso:
//   node auditar-responsivo.mjs <url-ou-arquivo.html> [opções]
//
// Opções:
//   --widths=320,360,...   larguras testadas (padrão: bateria completa da seção 12.8)
//   --height=900           altura da janela
//   --out=./rel-responsivo pasta do relatório e das capturas
//   --shots                salva captura de página inteira por largura
//   --zoom200              passada extra com zoom só de texto a 200% (WCAG 1.4.4)
//   --reduced-motion       passada extra com movimento reduzido
//
// Sai com código 1 se houver falha bloqueante, então serve em integração contínua.

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Playwright não encontrado. Instale na pasta do projeto com:\n' +
    '  npm i -D playwright && npx playwright install chromium');
  process.exit(2);
}

const argv = process.argv.slice(2);
let url = argv.find(a => !a.startsWith('--'));
if (!url) {
  console.error('uso: node auditar-responsivo.mjs <url-ou-arquivo.html> [--widths=320,360,...] [--out=pasta] [--shots] [--zoom200] [--reduced-motion]');
  process.exit(2);
}
// aceita arquivo local, para auditar antes de publicar
if (!/^(https?|file):/i.test(url)) {
  if (!existsSync(url)) { console.error(`Arquivo não encontrado: ${url}`); process.exit(2); }
  url = pathToFileURL(resolve(url)).href;
}
const flag = (n, d) => {
  const h = argv.find(a => a === `--${n}` || a.startsWith(`--${n}=`));
  if (!h) return d;
  const i = h.indexOf('=');
  return i === -1 ? true : h.slice(i + 1);
};

const WIDTHS  = String(flag('widths', '320,360,390,414,768,1024,1280,1366,1440,1920')).split(',').map(Number).filter(Boolean);
const HEIGHT  = Number(flag('height', 900));
const OUT     = resolve(String(flag('out', './rel-responsivo')));
const SHOTS   = !!flag('shots', false);
const ZOOM200 = !!flag('zoom200', false);
const RMOTION = !!flag('reduced-motion', false);

const LIMITES = {
  alvoMin: 24,          // WCAG 2.2, critério 2.5.8
  alvoCelular: 44,      // padrão prático no celular: abaixo disso gera aviso
  fonteCorpoMin: 16,
  fonteInputMin: 16,    // abaixo disso o iOS amplia ao focar
  contrasteNormal: 4.5,
  contrasteGrande: 3.0, // >= 24px, ou >= 18.66px em peso 700
  imagemFatorMax: 1.6,
  clsMax: 0.1,
  medidaLinhaMax: 80
};
mkdirSync(OUT, { recursive: true });

const INIT_CLS = () => {
  window.__CLS__ = { valor: 0, fontes: [] };
  try {
    new PerformanceObserver(l => {
      for (const e of l.getEntries()) {
        if (e.hadRecentInput) continue;
        window.__CLS__.valor += e.value;
        for (const s of e.sources || []) {
          const el = s.node;
          window.__CLS__.fontes.push({ valor: +e.value.toFixed(4), no: el && el.tagName ? el.tagName.toLowerCase() : '?' });
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  } catch {}
};

const SONDA = () => {
  const T = window.__LIMITES__, doc = document.documentElement;
  const vw = doc.clientWidth, vh = window.innerHeight, zoom = window.__ZOOM__ || 0;

  const caminho = el => {
    const p = []; let n = el;
    while (n && n.nodeType === 1 && p.length < 4) {
      const s = n.tagName.toLowerCase();
      if (n.id) { p.unshift(s + '#' + n.id); break; }
      const c = (n.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(x => '.' + x).join('');
      p.unshift(s + c); n = n.parentElement;
    }
    return p.join(' > ');
  };
  const visivel = (el, r) => {
    if (r.width <= 0 || r.height <= 0) return false;
    const s = getComputedStyle(el);
    return s.visibility !== 'hidden' && s.display !== 'none' && Number(s.opacity) > .01;
  };
  // ancestral (abaixo de body) que corta ou rola no eixo horizontal:
  // o que vaza dentro dele é recorte intencional, não estouro da página
  const recortadoNoEixoX = el => {
    let n = el.parentElement;
    while (n && n !== document.body && n !== doc) {
      if (getComputedStyle(n).overflowX !== 'visible') return true;
      n = n.parentElement;
    }
    return false;
  };
  const txt = el => (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50);
  const todos = [...document.querySelectorAll('body *')]
    .filter(e => !/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(e.tagName));

  // 1. estouro horizontal, com as raízes da cadeia
  const culpados = [], cortadosEsquerda = [];
  for (const el of todos) {
    const r = el.getBoundingClientRect();
    if (!visivel(el, r)) continue;
    const exc = Math.max(r.right - vw, -r.left);
    if (exc <= 1 || recortadoNoEixoX(el)) continue;
    const item = { el, sel: caminho(el), largura: Math.round(r.width), excesso: Math.round(exc), texto: txt(el) };
    culpados.push(item);
    if (r.left < -1) cortadosEsquerda.push(item);
  }
  const raizesDe = lista => {
    const set = new Set(lista.map(c => c.el));
    return lista.filter(c => {
      let p = c.el.parentElement;
      while (p && p !== document.body) { if (set.has(p)) return false; p = p.parentElement; }
      return true;
    }).sort((a, b) => b.excesso - a.excesso).slice(0, 10).map(({ el, ...r }) => r);
  };

  const sh = getComputedStyle(doc), sb = getComputedStyle(document.body);
  const largura = Math.max(doc.scrollWidth, document.body.scrollWidth);
  const overflow = {
    scrollWidth: largura,
    clientWidth: vw,
    excesso: Math.max(0, largura - vw),
    raizes: raizesDe(culpados),
    esquerda: raizesDe(cortadosEsquerda),
    mascarado: /hidden|clip/.test(sh.overflowX) || /hidden|clip/.test(sb.overflowX)
  };

  // 2. alvos de toque
  const SEL = 'a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[role=link],[role=tab],[tabindex]:not([tabindex="-1"])';
  const alvos = [], alvosCelular = [];
  for (const el of document.querySelectorAll(SEL)) {
    const r = el.getBoundingClientRect();
    if (!visivel(el, r)) continue;
    if (el.closest('[aria-hidden="true"]')) continue;   // campo armadilha e decoração
    const pai = el.parentElement;
    // exceção da WCAG: link dentro de texto corrido
    if (el.tagName === 'A' && pai && /^(P|LI|SPAN|TD|DD|FIGCAPTION|BLOCKQUOTE)$/.test(pai.tagName)
        && getComputedStyle(el).display.includes('inline')) continue;
    const w = Math.round(r.width), h = Math.round(r.height);
    if (w < T.alvoMin || h < T.alvoMin) alvos.push({ sel: caminho(el), texto: txt(el), w, h });
    else if (vw <= 480 && (w < T.alvoCelular || h < T.alvoCelular)) alvosCelular.push({ sel: caminho(el), texto: txt(el), w, h });
  }

  // 3. tipografia e contraste
  const BLOCOS = 'p,li,td,dd,figcaption,blockquote,label,input,textarea,select,button,a,span,h1,h2,h3,h4,h5,h6';
  const fontesPequenas = [], inputsZoomIOS = [], travadoEmPx = [], medidaLinha = [], contraste = [];

  const cor = c => { const m = c.match(/-?[\d.]+/g); if (!m) return null; const [r, g, b, a = 1] = m.map(Number); return { r, g, b, a }; };
  const lum = ({ r, g, b }) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
  const mix = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  const fundoDe = el => {
    let n = el, acc = null;
    while (n && n.nodeType === 1) {
      const s = getComputedStyle(n);
      if (s.backgroundImage && s.backgroundImage !== 'none') return { indeterminado: true };
      const c = cor(s.backgroundColor);
      if (c && c.a > 0) { acc = acc ? mix(acc, c) : c; if (c.a >= .999) return acc; }
      n = n.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };

  for (const el of document.querySelectorAll(BLOCOS)) {
    const r = el.getBoundingClientRect();
    if (!visivel(el, r)) continue;
    if (el.closest('[aria-hidden="true"]')) continue;
    const s = getComputedStyle(el), fs = parseFloat(s.fontSize), t = (el.textContent || '').trim();

    if (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) && fs < T.fonteInputMin - .01)
      inputsZoomIOS.push({ sel: caminho(el), fontSize: +fs.toFixed(1) });

    // com a raiz em 32px, texto ainda abaixo de 18px foi escrito em px cru
    if (zoom >= 200 && t.length > 12 && fs < 18)
      travadoEmPx.push({ sel: caminho(el), fontSize: +fs.toFixed(1), texto: t.slice(0, 50) });

    if (/^(P|LI|TD|DD|BLOCKQUOTE)$/.test(el.tagName) && t.length > 40) {
      if (fs < T.fonteCorpoMin - .01) fontesPequenas.push({ sel: caminho(el), fontSize: +fs.toFixed(1) });
      const cpl = Math.round(r.width / (fs * .5));   // ver 12.5
      if (cpl > T.medidaLinhaMax) medidaLinha.push({ sel: caminho(el), cpl, larguraPx: Math.round(r.width) });
    }

    const proprio = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 2);
    if (!proprio) continue;
    const fg = cor(s.color), bg = fundoDe(el);
    if (!fg || bg.indeterminado) continue;
    const fgs = fg.a < 1 ? mix(fg, bg) : fg;
    const ratio = (Math.max(lum(fgs), lum(bg)) + .05) / (Math.min(lum(fgs), lum(bg)) + .05);
    const peso = parseInt(s.fontWeight, 10) || 400;
    const exigido = (fs >= 24 || (fs >= 18.66 && peso >= 700)) ? T.contrasteGrande : T.contrasteNormal;
    if (ratio < exigido - .01) contraste.push({ sel: caminho(el), texto: txt(el), ratio: +ratio.toFixed(2), exigido });
  }

  // 4. imagens maiores que o espaço de layout
  const imagens = [];
  for (const img of document.querySelectorAll('img')) {
    const r = img.getBoundingClientRect();
    if (!visivel(img, r)) continue;
    if (img.hasAttribute('srcset') && !img.hasAttribute('sizes'))
      imagens.push({ sel: caminho(img), aviso: 'srcset sem sizes: o navegador assume a janela inteira' });
    if (!img.naturalWidth) continue;
    const fator = img.naturalWidth / Math.max(1, r.width * devicePixelRatio);
    if (fator > T.imagemFatorMax) imagens.push({
      sel: caminho(img), natural: `${img.naturalWidth}x${img.naturalHeight}`,
      layout: `${Math.round(r.width)}x${Math.round(r.height)}`, dpr: devicePixelRatio,
      fator: +fator.toFixed(2), desperdicioPct: Math.round((1 - 1 / (fator * fator)) * 100)
    });
  }

  // 5. sticky quebrado.
  //    O sticky gruda no contêiner de rolagem mais próximo. overflow: clip não cria contêiner.
  //    Quebra de verdade: sticky vertical dentro de um contêiner que não rola na vertical
  //    (o caso clássico é overflow: hidden, ou overflow-x: auto posto para conter um estouro).
  //    Tabela rolável com coluna fixa (sticky horizontal em overflow-x: auto) é intencional.
  const sticky = [];
  for (const el of todos) {
    const se = getComputedStyle(el);
    if (se.position !== 'sticky') continue;
    const vertical = se.top !== 'auto' || se.bottom !== 'auto';
    const horizontal = se.left !== 'auto' || se.right !== 'auto';
    let n = el.parentElement;
    while (n && n !== document.body && n !== doc) {
      const s = getComputedStyle(n);
      const contX = /hidden|auto|scroll/.test(s.overflowX), contY = /hidden|auto|scroll/.test(s.overflowY);
      if (contX || contY) {
        const rolaY = /auto|scroll/.test(s.overflowY) && n.scrollHeight > n.clientHeight + 1;
        const quebraV = vertical && !rolaY;
        const quebraH = horizontal && /hidden/.test(s.overflowX);
        if (quebraV || quebraH)
          sticky.push({ sel: caminho(el), ancestral: caminho(n), overflow: `${s.overflowX} ${s.overflowY}` });
        break;
      }
      n = n.parentElement;
    }
  }

  // 6. 100vh em altura de layout, lido nas próprias regras de CSS.
  //    No navegador de teste 100vh e 100svh medem igual, então só a regra escrita diz qual foi usado.
  //    Folhas de outro domínio não podem ser lidas e ficam de fora.
  const vhCru = [];
  const varrer = regras => {
    for (const r of regras) {
      if (r.cssRules) varrer(r.cssRules);
      if (!r.style || !r.selectorText) continue;
      for (const prop of ['height', 'min-height', 'max-height']) {
        if (/(^|[^\w.])100vh\b/.test(r.style.getPropertyValue(prop)))
          vhCru.push({ sel: r.selectorText.slice(0, 80), prop });
      }
    }
  };
  for (const folha of document.styleSheets) {
    try { varrer(folha.cssRules); } catch {}
  }
  for (const el of document.querySelectorAll('[style*="100vh"]')) vhCru.push({ sel: caminho(el), prop: 'style' });

  // 7. animação ativa apesar da preferência de movimento reduzido
  let animacoesAtivas = 0;
  if (window.__RMOTION__) {
    animacoesAtivas = todos.filter(el => {
      const s = getComputedStyle(el);
      const anima = s.animationName !== 'none' && (parseFloat(s.animationDuration) || 0) > .2;
      const transita = (parseFloat(s.transitionDuration) || 0) > .2;
      return (anima || transita) && el.getBoundingClientRect().width > 0;
    }).length;
  }

  return {
    overflow, alvos: alvos.slice(0, 25), totalAlvos: alvos.length,
    alvosCelular: alvosCelular.slice(0, 25), totalAlvosCelular: alvosCelular.length,
    fontesPequenas: fontesPequenas.slice(0, 10), inputsZoomIOS,
    travadoEmPx: travadoEmPx.slice(0, 10), medidaLinha: medidaLinha.slice(0, 8),
    contraste: contraste.slice(0, 12), totalContraste: contraste.length,
    imagens: imagens.slice(0, 12), sticky, vhCru: vhCru.slice(0, 5), animacoesAtivas,
    cls: window.__CLS__ ? +window.__CLS__.valor.toFixed(4) : null,
    fontesCLS: window.__CLS__ ? window.__CLS__.fontes.slice(0, 5) : []
  };
};

async function medir(browser, { width, rotulo, reducedMotion, zoomTexto }) {
  const celular = width <= 480;
  const ctx = await browser.newContext({
    viewport: { width, height: HEIGHT },
    deviceScaleFactor: celular ? 3 : 1,
    isMobile: celular, hasTouch: celular,
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference'
  });
  const page = await ctx.newPage();
  await page.addInitScript(INIT_CLS);
  const erros = [], requisicoes = [];
  page.on('pageerror', e => erros.push(String(e).slice(0, 160)));
  page.on('console', m => { if (m.type() === 'error') erros.push(m.text().slice(0, 160)); });
  page.on('response', r => { if (r.status() >= 400) requisicoes.push(`${r.status()} ${r.url().slice(0, 120)}`); });

  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  // zoom só de texto: dobra a raiz e revela tudo que foi escrito em px
  if (zoomTexto) {
    await page.addStyleTag({ content: `html{font-size:${16 * zoomTexto / 100}px !important}` });
    await page.waitForTimeout(400);
    // o salto causado pelo próprio zoom não é defeito da página
    await page.evaluate(() => { window.__CLS__ = { valor: 0, fontes: [] }; });
  }

  // rola a página inteira para disparar carregamento tardio e animações, e volta
  await page.evaluate(async () => {
    const passo = innerHeight * .8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += passo) {
      scrollTo(0, y); await new Promise(r => setTimeout(r, 120));
    }
    scrollTo(0, 0); await new Promise(r => setTimeout(r, 300));
  });
  await page.waitForTimeout(1200);

  await page.evaluate(([lim, z, rm]) => { window.__LIMITES__ = lim; window.__ZOOM__ = z; window.__RMOTION__ = rm; },
    [LIMITES, zoomTexto || 0, !!reducedMotion]);
  const d = await page.evaluate(SONDA);
  d.rotulo = rotulo; d.largura = width; d.errosJS = erros; d.requisicoesComErro = requisicoes;
  if (SHOTS) {
    d.captura = `${String(width).padStart(4, '0')}-${rotulo}.png`;
    await page.screenshot({ path: resolve(OUT, d.captura), fullPage: true });
  }
  await ctx.close();
  return d;
}

function avaliar(d) {
  const f = [], a = [], px = `${d.largura}px`;
  if (d.overflow.excesso > 1)
    f.push(`ESTOURO ${px}: ${d.overflow.scrollWidth} > ${d.overflow.clientWidth} (+${d.overflow.excesso}px)\n` +
      d.overflow.raizes.map(r => `      ${r.sel}  (+${r.excesso}px, largura ${r.largura}px)`).join('\n'));
  if (d.overflow.esquerda.length)
    f.push(`CORTADO À ESQUERDA em ${px}:\n` +
      d.overflow.esquerda.map(r => `      ${r.sel}  (${r.excesso}px fora, largura ${r.largura}px)`).join('\n'));
  if (d.overflow.mascarado) a.push(`${px}: overflow-x oculto em html ou body esconde o sintoma e quebra sticky.`);
  if (d.alvos.length)
    f.push(`ALVOS < ${LIMITES.alvoMin}px em ${px} (${d.totalAlvos}):\n` +
      d.alvos.slice(0, 8).map(x => `      ${x.w}x${x.h}  ${x.sel}  ${x.texto}`).join('\n'));
  if (d.alvosCelular.length)
    a.push(`${px}: ${d.totalAlvosCelular} alvo(s) entre 24 e 44 px no celular. Use 44 como padrão:\n` +
      d.alvosCelular.slice(0, 6).map(x => `      ${x.w}x${x.h}  ${x.sel}  ${x.texto}`).join('\n'));
  if (d.fontesPequenas.length)
    f.push(`CORPO < 16px em ${px}:\n` + d.fontesPequenas.map(x => `      ${x.fontSize}px  ${x.sel}`).join('\n'));
  if (d.inputsZoomIOS.length)
    f.push(`CAMPO < 16px em ${px} (o iOS amplia ao focar):\n` + d.inputsZoomIOS.map(x => `      ${x.fontSize}px  ${x.sel}`).join('\n'));
  if (d.travadoEmPx.length)
    f.push(`TEXTO TRAVADO EM PX em ${px} (raiz a 32px, WCAG 1.4.4):\n` +
      d.travadoEmPx.slice(0, 6).map(x => `      ${x.fontSize}px  ${x.sel}`).join('\n'));
  if (d.contraste.length)
    f.push(`CONTRASTE em ${px} (${d.totalContraste}):\n` +
      d.contraste.slice(0, 8).map(c => `      ${c.ratio}:1 (exige ${c.exigido}) ${c.sel}`).join('\n'));
  if (d.sticky.length)
    f.push(`STICKY QUEBRADO em ${px}:\n` + d.sticky.map(s => `      ${s.sel} dentro de ${s.ancestral} [${s.overflow}]`).join('\n'));
  if (d.cls !== null && d.cls > LIMITES.clsMax)
    f.push(`CLS ${d.cls} em ${px}. Maiores fontes: ${d.fontesCLS.map(x => `${x.no}(${x.valor})`).join(', ')}`);
  if (d.rotulo === 'reduced-motion' && d.animacoesAtivas > 0)
    f.push(`MOVIMENTO em ${px}: ${d.animacoesAtivas} elemento(s) seguem animando apesar da preferência.`);
  const grandes = d.imagens.filter(i => i.fator);
  if (grandes.length)
    a.push(`${px}: ${grandes.length} imagem(ns) maior(es) que o espaço de layout:\n` +
      grandes.slice(0, 6).map(i => `      ${i.natural} para ${i.layout}@${i.dpr}x = ${i.fator}x (~${i.desperdicioPct}% de bytes à toa)`).join('\n'));
  if (d.imagens.some(i => i.aviso)) a.push(`${px}: img com srcset e sem sizes.`);
  if (d.medidaLinha.length)
    a.push(`${px}: medida de linha acima de ${LIMITES.medidaLinhaMax} caracteres em ${d.medidaLinha.length} bloco(s).`);
  if (d.vhCru.length)
    a.push(`${px}: 100vh em altura de layout. Use 100svh (seção 12.6):\n` +
      d.vhCru.map(v => `      ${v.sel} { ${v.prop} }`).join('\n'));
  if (d.errosJS.length) a.push(`${px}: ${d.errosJS.length} erro(s) de JS ou de console: ${d.errosJS[0]}`);
  if (d.requisicoesComErro.length) a.push(`${px}: ${d.requisicoesComErro.length} requisição(ões) com erro: ${d.requisicoesComErro[0]}`);
  return { falhas: f, avisos: a };
}

const browser = await chromium.launch();
const rel = { url, data: new Date().toISOString(), limites: LIMITES, passadas: [] };
let total = 0;

const passadas = [{ rotulo: 'base', reducedMotion: false, zoomTexto: 0 }];
if (ZOOM200) passadas.push({ rotulo: 'zoom200', reducedMotion: false, zoomTexto: 200 });
if (RMOTION) passadas.push({ rotulo: 'reduced-motion', reducedMotion: true, zoomTexto: 0 });

for (const p of passadas) {
  // o zoom só de texto interessa a 1.4.4, que é critério de tela larga;
  // no celular o teste equivalente é o reflow a 320px, já na bateria base
  const larguras = p.zoomTexto ? WIDTHS.filter(w => w >= 768) : WIDTHS;
  for (const width of larguras) {
    process.stdout.write(`\n[${p.rotulo}] ${width}px ... `);
    let d;
    try { d = await medir(browser, { width, ...p }); }
    catch (e) { console.log('ERRO: ' + String(e).slice(0, 160)); total++; continue; }
    const { falhas, avisos } = avaliar(d);
    d.falhas = falhas; d.avisos = avisos;
    rel.passadas.push(d); total += falhas.length;
    console.log(falhas.length ? `${falhas.length} FALHA(S), ${avisos.length} aviso(s)` : `ok (${avisos.length} aviso(s))`);
    falhas.forEach(x => console.log('  [x] ' + x));
    avisos.forEach(x => console.log('  [!] ' + x));
  }
}

writeFileSync(resolve(OUT, 'relatorio.json'), JSON.stringify(rel, null, 2));
await browser.close();
console.log(`\nRelatório: ${resolve(OUT, 'relatorio.json')}`);
console.log(total ? `REPROVADO: ${total} falha(s).` : 'APROVADO: nenhuma falha bloqueante.');
process.exit(total ? 1 : 0);
