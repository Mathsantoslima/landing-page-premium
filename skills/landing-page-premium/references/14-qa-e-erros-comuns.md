> Referência da skill `landing-page-premium`. O processo, os portões e as regras anti-slop estão no `SKILL.md`. A numeração das seções é a mesma em todos os arquivos.

## 16. QA executável

Não é leitura de código. É execução em navegador controlado. Rode antes de mostrar ao usuário.

A bateria automática está pronta em três scripts, que cobrem a maior parte desta seção:

| Script | Cobre |
|---|---|
| `node scripts/auditar-responsivo.mjs index.html --shots --zoom200 --reduced-motion` | Estouro, alvos, fontes, contraste medido na página, sticky, CLS, movimento reduzido, zoom de 200%, erros de console e requisições (12.7 e 12.8) |
| `python3 scripts/checar-texto.py index.html` | Slop de texto, botões, ritmo, negrito, tríades (10.11) |
| `python3 scripts/contraste.py tokens.css` | Pares de contraste dos tokens, antes de aplicar (13.1) |

Os trechos abaixo cobrem o que os scripts não fazem, como a ordem de foco, e servem de base para quem monta o próprio roteiro com Playwright.

### 16.1 O que medir

```js
// 1. rolagem horizontal, o defeito mais comum
await page.setViewportSize({ width: 360, height: 800 });
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
// precisa ser 0

// 2. elemento culpado, quando houver estouro: use o trecho de console de 12.6,
//    que acha a raiz da cadeia em vez de listar todos os descendentes

// 3. erro de console
page.on('pageerror', e => erros.push(e.message));
page.on('console', m => m.type() === 'error' && erros.push(m.text()));

// 4. imagem que falhou
page.on('response', r => { if (r.status() >= 400) erros.push(r.status() + ' ' + r.url()); });

// 5. ordem de foco e foco visível
for (let i = 0; i < 10; i++) {
  await page.keyboard.press('Tab');
  await page.evaluate(() => {
    const a = document.activeElement, cs = getComputedStyle(a);
    const temFoco = cs.outlineStyle !== 'none' || cs.boxShadow !== 'none';  // 2.2: foco com raio usa box-shadow
    return (a.textContent || a.ariaLabel || a.tagName).trim().slice(0, 40)
         + (temFoco ? ' [foco ok]' : ' [SEM FOCO]');
  });
}

// 6. movimento reduzido mostra tudo
const p = await browser.newPage({ reducedMotion: 'reduce' });
await p.goto(url);
await p.evaluate(() => [...document.querySelectorAll('.reveal')]
  .filter(e => getComputedStyle(e).opacity !== '1').length);  // precisa ser 0

// 7. zoom de 200%, equivale a metade da largura
await page.setViewportSize({ width: 720, height: 450 });
```

### 16.2 Lista de verificação

**Slop**

- [ ] Zero travessão, meia-risca e ponto médio em texto visível
- [ ] Nenhuma seção repete o molde da anterior
- [ ] Nenhuma imagem de banco ou gerada por IA
- [ ] Nenhum ícone de robô, cérebro ou circuito
- [ ] Trocando logotipo e paleta, a página **não** serviria para qualquer empresa
- [ ] Nenhum número sem origem

**Sistema**

- [ ] Toda cor vem de token
- [ ] No máximo dois tokens de sombra
- [ ] Um destaque por título
- [ ] Nenhuma seção inventa componente fora do sistema
- [ ] Toda duração e curva vêm do vocabulário definido

**Responsividade**

- [ ] Sem rolagem horizontal em 360 px e 390 px
- [ ] Verificado em 1280, 1366 e 1440 px
- [ ] Zoom de 200% sem rolagem horizontal
- [ ] Nenhum texto cortado ou sobreposto

**Acessibilidade**

- [ ] Todo par de texto com 4,5:1 ou mais, medido
- [ ] Navegação completa por teclado, com setas nas abas
- [ ] Foco visível em tudo que é focável
- [ ] Foco devolvido ao fechar diálogo
- [ ] Imagem decorativa com `aria-hidden`, imagem de conteúdo com `alt`
- [ ] Erro de formulário ligado ao campo
- [ ] Movimento reduzido mostra a página completa
- [ ] `scroll-padding-top` compensando header fixo

**Acabamento**

- [ ] Zero erro no console
- [ ] Nenhuma requisição com erro
- [ ] Nenhum gráfico ou indicador zerado
- [ ] Imagens com `width`, `height` e carregamento adiado abaixo da dobra
- [ ] Imagem do topo sem `lazy`, com `fetchpriority="high"`
- [ ] Imagem de compartilhamento com endereço absoluto
- [ ] Título animado volta a texto selecionável

## 18. Erros comuns

| Erro | Consequência | Correção |
|---|---|---|
| Grid sem `minmax(0,1fr)` | Rolagem horizontal no celular | Declarar como base em todo grid |
| `clamp()` com `vw` puro | Texto não escala com o zoom, falha WCAG | Incluir parcela em `rem` no termo do meio |
| Título animado sem restaurar | Copiar o título traz marcação quebrada | Devolver o HTML original após a animação |
| `loading="lazy"` na imagem do topo | LCP ruim | Remover e usar `fetchpriority="high"` |
| Imagem sem `width` e `height` | Salto de layout | Sempre declarar, ou usar `aspect-ratio` |
| `overflow: hidden` em ancestral | `position: sticky` para de funcionar | Trocar por `overflow: clip`, ou remover |
| `transform-origin` em SVG sem `transform-box` | Rotação gira em torno do canto do canvas | `transform-box: fill-box` |
| Peso 800 em título grande | Aparência de template | Peso de 400 a 600 |
| Linha antes do rótulo de seção | Lê como travessão | Rótulo sobre fundo cinza, sem linha |
| Trocar imagem de compartilhamento com o mesmo nome | Prévia antiga por dias | Nome novo a cada versão |
| Movimento reduzido só no fim | Elementos invisíveis para quem ativou | Implementar junto com a animação |
| Bloquear colagem no campo | Em senha e código, falha o critério 3.3.8; nos demais, atrito | Permitir colar em todos os campos |
| Campo armadilha só oculto no CSS | Leitor de tela anuncia e barra a pessoa | `aria-hidden`, `tabindex="-1"` e `autocomplete="off"` juntos |
| Animar `top` ou `height` | Queda de quadros | Animar `transform` e `opacity` |
| Entregar sem abrir no navegador | Defeito que o usuário encontra primeiro | Rodar os três scripts e o QA da seção 16 |
