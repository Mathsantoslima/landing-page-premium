> Referência da skill `landing-page-premium`. O processo, os portões e as regras anti-slop estão no `SKILL.md`. A numeração das seções é a mesma em todos os arquivos.

## 17. Código de referência

### 17.1 Ciclo automático com barra de progresso

Avança sozinho, pausa no hover, no foco e fora da tela, e para de vez ao primeiro clique. Os três trechos desta seção usam a constante `reduced` de 6.6.

```js
function cycle({ items, select, bar, ms, root, th = .25 }) {
  let i = 0, t0 = 0, raf = 0, paused = false, stopped = reduced, visible = false;
  const tick = now => {
    if (!t0) t0 = now;
    if (paused || stopped || !visible) {
      t0 = now - (bar(i) ? parseFloat(bar(i).style.width || 0) / 100 * ms : 0);
      raf = requestAnimationFrame(tick); return;
    }
    const p = Math.min(1, (now - t0) / ms);
    const b = bar(i); if (b) b.style.width = (p * 100) + '%';
    if (p >= 1) { i = (i + 1) % items; select(i, true); t0 = now; }
    raf = requestAnimationFrame(tick);
  };
  root.addEventListener('mouseenter', () => paused = true);
  root.addEventListener('mouseleave', () => paused = false);
  root.addEventListener('focusin',  () => paused = true);
  root.addEventListener('focusout', () => paused = false);
  new IntersectionObserver(([e]) => visible = e.isIntersecting, { threshold: th }).observe(root);
  if (!stopped) raf = requestAnimationFrame(tick);
  return { go(n, user) { i = n; t0 = 0; if (user) { stopped = true; const b = bar(n); if (b) b.style.width = '100%'; } } };
}

function tabs(tabEls, onSelect, vertical) {
  tabEls.forEach((t, k) => {
    t.addEventListener('click', () => onSelect(k, false, true));
    t.addEventListener('keydown', e => {
      const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      let n = null;
      if (d !== undefined && (vertical ? /Up|Down/.test(e.key) : /Left|Right/.test(e.key)))
        n = (k + d + tabEls.length) % tabEls.length;
      if (e.key === 'Home') n = 0;
      if (e.key === 'End') n = tabEls.length - 1;
      if (n !== null) { e.preventDefault(); onSelect(n, false, true); tabEls[n].focus(); }
    });
  });
}
```

### 17.2 Revelação de título por palavra

Quebra em palavras, anima e **devolve o texto original**, para que seleção e cópia funcionem.

```js
function splitWords(el) {
  const base = +el.dataset.split || 0, step = 42; let i = 0;
  el._orig = el.innerHTML;
  el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  const walk = node => [...node.childNodes].forEach(c => {
    if (c.nodeType === 3) {
      const frag = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(t => {
        if (!t) return;
        if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
        const w = document.createElement('span');
        w.className = 'w'; w.setAttribute('aria-hidden', 'true');
        const inner = document.createElement('span');
        inner.textContent = t;
        inner.style.transitionDelay = (base + i++ * step) + 'ms';
        w.appendChild(inner); frag.appendChild(w);
      });
      c.replaceWith(frag);
    } else if (c.nodeType === 1) walk(c);
  });
  walk(el);
}

if (!reduced) {
  document.querySelectorAll('[data-split]').forEach(splitWords);
  const restore = el => {
    if (el._orig == null) return;
    el.innerHTML = el._orig; el._orig = null; el.removeAttribute('aria-label');
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const el = e.target, n = el.querySelectorAll('.w').length, base = +el.dataset.split || 0;
    setTimeout(() => restore(el), base + n * 42 + 1400);
  }), { threshold: .3 });
  document.querySelectorAll('[data-split]').forEach(el => io.observe(el));
}
```

```css
.w{display:inline-block;clip-path:inset(-.3em -.14em)}
.w>span{display:inline-block;transition:transform 1.05s var(--ease),opacity .9s var(--ease)}
.js [data-split] .w>span{transform:translateY(125%);opacity:0}
.js .reveal.in [data-split] .w>span{transform:none;opacity:1}
```

### 17.3 Ícones em linha com traço animado

Converte `<use>` em cópia em linha para animar cada traço.

```js
const ICON_ANIM = { clock:'clock', check:'check', zap:'flash', heart:'beat',
                    refresh:'spin', chart:'line', target:'target', arrow:'nudge' };

const io = !reduced ? new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('drawn'); io.unobserve(e.target); }
}), { threshold: .6 }) : null;

document.querySelectorAll('svg.ic').forEach((svg, n) => {
  const use = svg.querySelector('use'); if (!use) return;
  const id = (use.getAttribute('href') || '').slice(1);
  const sym = document.getElementById(id); if (!sym) return;
  svg.setAttribute('viewBox', sym.getAttribute('viewBox'));
  svg.replaceChildren(...[...sym.childNodes].map(c => c.cloneNode(true)));
  const name = id.replace(/^i-/, '');
  svg.dataset.i = name;
  if (ICON_ANIM[name]) svg.dataset.a = ICON_ANIM[name];
  let j = 0;
  [...svg.children].forEach(c => {
    c.setAttribute('pathLength', '1');
    c.style.transitionDelay = (j++ * 90 + (n % 5) * 40) + 'ms';
  });
  io ? io.observe(svg) : svg.classList.add('drawn');
});

function playIcons(el) {
  if (reduced) return;
  el.querySelectorAll('svg[data-a]').forEach(svg => {
    svg.classList.remove('play'); void svg.getBoundingClientRect(); svg.classList.add('play');
    clearTimeout(svg._t); svg._t = setTimeout(() => svg.classList.remove('play'), 1400);
  });
}

// toca a animação própria dos ícones quando o cursor entra no cartão
document.querySelectorAll('[data-icones]').forEach(card =>
  card.addEventListener('pointerenter', () => playIcons(card)));
```

Cada valor do mapa `ICON_ANIM` precisa de uma regra `svg.play[data-a="..."]` em 6.4.

### 17.4 Medição de contraste

O medidor está em `scripts/contraste.py`, só com a biblioteca padrão do Python:

```bash
python3 scripts/contraste.py "#5B6D71" "#F2F5F4"   # um par: texto, depois fundo -> 4,95:1
python3 scripts/contraste.py tokens.css             # todos os pares do :root de uma vez
```

No modo de arquivo, ele lê os tokens hexadecimais da seção 4.1 e mede corpo, secundário e título sobre os fundos, o texto do botão sobre a cor de ação, o botão e o foco como componente de interface, a cor de sinal e o texto de erro.

Rode em **todos** os pares antes de aplicar. Se algum ficar abaixo de 4,5:1, escureça o tom até passar.
