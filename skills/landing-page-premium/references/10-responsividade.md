> Referência da skill `landing-page-premium`. O processo, os portões e as regras anti-slop estão no `SKILL.md`. A numeração das seções é a mesma em todos os arquivos.

## 12. Responsividade e breakpoints

A página precisa ser excelente no celular **e** no monitor. Mobile-first é a ordem em que você escreve o CSS, não um teto de ambição: página pensada só para o celular chega ao 1440 com hierarquia achatada e espaço morto nas laterais.

Esta seção é medida, não opinada. O critério de aprovação está em 12.8 e o roteiro que o verifica, em 12.7.

### 12.1 A lista de larguras de dispositivo morreu

Três razões concretas:

1. **As estatísticas medem a tela, não a janela.** Em computador a janela raramente está maximizada, e mesmo maximizada perde a barra de rolagem (15 a 17 px). Projetar para 1366 é projetar para algo entre 1100 e 1351.
2. **O fator de escala do sistema embaralhou tudo.** 1536 por 864, que aparece entre as resoluções mais comuns, é um monitor Full HD a 125%. 1280 por 720 é o mesmo monitor a 150%. Notebook e monitor se misturaram no mesmo intervalo de pixels de CSS.
3. **O container passou a existir.** Com `@container` amplamente disponível desde agosto de 2025, a pergunta certa deixou de ser "qual a largura da janela" e passou a ser "quanto espaço este componente recebeu".

**Números úteis de calibragem** (Statcounter, computador no Brasil, outubro de 2026): 1920×1080 com cerca de 30%; 1366×768 com cerca de 11%; 1536×864 com cerca de 9%. O intervalo "notebook apertado", de 1280 a 1366, segue entre os mais usados, e é onde mais página quebra e o mais negligenciado. No celular, as larguras de 360 a 414 concentram a maior parte do tráfego. **Confira o painel atual antes de citar:** esses números mudam todo mês.

**O piso real de celular hoje é 360, não 320.** Mas 320 continua na bateria de teste por norma: o critério 1.4.10 da WCAG exige que o conteúdo funcione a 320 px de CSS, porque isso equivale a uma janela de 1280 com zoom de 400%.

### 12.2 Breakpoint por conteúdo

O método:

1. Construa o componente em largura fluida.
2. Arraste a janela devagar e anote a largura exata em que algo fica feio. "Feio" tem definição objetiva: o título passa de 2 para 3 linhas e cria viúva; a medida de linha passa de 75 caracteres; a imagem fica menor que 160 px e o rosto some; o botão quebra em duas linhas; dois itens ficam em uma linha e o terceiro sozinho embaixo.
3. Esse número é o breakpoint. Arredonde para o `rem` mais próximo da sua escala.
4. Se o número depende do componente e não da página, **isso não é media query, é `@container`**.

Uma landing page bem feita precisa de **2 a 4 media queries globais**, mais quantas container queries os componentes pedirem.

| Breakpoint | Valor | O que muda na página inteira |
|---|---|---|
| base | sem query | 1 coluna, navegação condensada, tipografia fluida |
| md | `48rem` | grades de 2 colunas, rodapé em colunas, campos em pares |
| lg | `64rem` | navegação horizontal, topo em 2 colunas, bento com spans |
| xl (opcional) | `90rem` | só aumenta espaçamento e tipo. **Nunca reorganiza** |

Se a sua folha tem sete media queries globais, quatro estão corrigindo um componente e deveriam ser `@container`.

**Use `rem` nas media queries, não `px`.** Em media query o `rem` é resolvido contra o tamanho de fonte inicial do navegador, não contra o `html` da página. Quem aumenta a fonte padrão recebe os breakpoints mais cedo, que é o comportamento correto.

**O caso 1280 e 1366**, onde mora a maior parte dos defeitos de computador:

| Causa | Sintoma | Correção |
|---|---|---|
| Container com largura máxima e sem respiro lateral | O conteúdo encosta na borda a 1280 e respira a 1440 | `width: min(100% - 2 * var(--gutter), 75rem)` |
| Grade de 4 colunas com cartão de mínimo 320 | 4×320 mais 3×24 dá 1352 e estoura a 1280 | `repeat(auto-fit, minmax(min(100%, 17rem), 1fr))` |
| Navegação com 7 itens e 2 botões | Itens colidem com o logotipo entre 1024 e 1366 | Breakpoint da navegação em `72rem`, não em `64rem` |
| Título do topo com tamanho fixo | Três palavras viram quatro linhas | `clamp()` com `max-width` em `ch` |
| Barra de rolagem de 15 px | O layout muda de 1366 para 1351 e passa do breakpoint | Teste também em 1351 |

**De 1440 para cima a página não reorganiza, só respira.** Largura máxima do bloco de conteúdo entre 1200 e 1280; largura máxima de prosa entre 45 e 75 caracteres; fundos e faixas vão até a borda; acima de 1600 aumente apenas espaço e tipo. **Nunca acrescente uma quinta coluna ao bento só porque cabe**: isso achata a hierarquia.

### 12.3 Mobile-first sem sacrificar o computador

Base é o CSS que vale sem nenhuma query.

```css
/* base: celular. Nenhuma media query aqui. */
.recursos {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-5);
}
@media (width >= 48rem) { .recursos { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (width >= 64rem) { .recursos { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
```

A sintaxe de intervalo (`width >= 48rem`) é amplamente disponível desde setembro de 2025. Pode usar sem reserva.

Mobile-first é ordem de **decisão**, não só de query: escolha o conteúdo que sobrevive em 360 px (o que não sobrevive entra no computador como detalhe secundário) e a hierarquia em uma coluna (se a leitura em coluna única não convence, a página não convence em largura nenhuma). Reordenar no computador com `order` ou `grid-row` é permitido, **desde que a ordem do DOM continue sendo a ordem lógica**, porque o foco de teclado segue o DOM e não o visual.

**As quatro falhas de quem só pensou no celular:**

| Falha | Sintoma | Correção |
|---|---|---|
| Colunas que nunca se formam | Tudo empilhado até 1920, com uma faixa estreita no meio | Defina explicitamente a grade de 2 e 3 colunas |
| Hierarquia achatada | No celular tudo tem o mesmo peso por falta de espaço, e isso é herdado | Escale a **razão** da escala tipográfica: menor no celular, maior no computador (12.5) |
| Espaço morto no 1440 | Conteúdo de 760 px centralizado, com 340 px de nada de cada lado | Container de 1200 a 1280 e sangria para os fundos |
| Densidade de celular no computador | Cartões de um por linha, exigindo nove rolagens | Grade com linhas menores e conteúdo em duas linhas |

**A grade de página que resolve container, respiro e sangria de uma vez**, sem `calc(50vw - 50%)` nem margem negativa, que são as duas causas clássicas de estouro horizontal:

```css
:root {
  --gutter: clamp(1rem, 0.72rem + 1.25vw, 2.5rem);
  --content-max: 75rem;
  --prose-max: 68ch;
}
.pagina {
  display: grid;
  grid-template-columns:
    [full-start] minmax(var(--gutter), 1fr)
    [content-start] min(100% - var(--gutter) * 2, var(--content-max))
    [content-end] minmax(var(--gutter), 1fr)
    [full-end];
}
.pagina > *        { grid-column: content; }
.pagina > .sangria { grid-column: full; }
.pagina > .sangria > * { display: grid; grid-template-columns: inherit; }
.prosa { max-width: var(--prose-max); }
```

Com `min()` a trilha central já nasce correta em qualquer largura, incluindo 320, e nenhum filho com largura total consegue estourar.

### 12.4 O que substitui media query

Estado em outubro de 2026, verificado na base oficial de disponibilidade:

| Recurso | Situação | Desde |
|---|---|---|
| `@container` de tamanho e unidades `cqi`, `cqw` | Amplamente disponível | ago/2025 |
| Subgrid | Amplamente disponível | mar/2026 |
| `min()`, `max()`, `clamp()` | Amplamente disponível | jan/2023 |
| `aspect-ratio` | Amplamente disponível | mar/2024 |
| `svh`, `lvh`, `dvh` | Amplamente disponível | jun/2025 |
| Sintaxe de intervalo em media query | Amplamente disponível | set/2025 |
| `:has()` e aninhamento nativo | Amplamente disponível | jun/2026 |
| `env(safe-area-inset-*)` | Amplamente disponível | jul/2022 |
| `text-wrap: balance` | Recente; vira amplamente disponível em nov/2026 | mai/2024 |
| `text-wrap: pretty` | Limitado, **sem Firefox** | |
| `scrollbar-gutter` | Recente, não amplo | dez/2024 |
| `@container` de estilo | Recente, não amplo; confirme no painel do Baseline | mai/2026 |
| `<img sizes="auto">` | Limitado | |

| Situação | Ferramenta certa |
|---|---|
| O mesmo cartão em 1 coluna no topo, 3 na grade, 2 no rodapé | `@container` |
| Tipo e espaço contínuos | `clamp()`, que elimina o degrau visível do breakpoint |
| Grade que ganha colunas sozinha | `repeat(auto-fit, minmax(min(100%, 17rem), 1fr))` |
| Largura máxima que respeita o respiro | `width: min(100% - 2 * var(--gutter), 75rem)` |
| Piso e teto de tamanho | `max(12rem, 20cqi)`: piso em `rem` responde ao zoom, teto ao container |
| Reserva de espaço para mídia | `aspect-ratio` com largura total |
| Cartões cujos títulos precisam alinhar | `subgrid` |
| Título de poucas palavras com viúva | `text-wrap: balance`, só em título |

**Container query na prática.** O padrão é sempre: o invólucro é o container, os filhos reagem.

```css
.grade { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); gap: var(--space-4); }
.cartao { container-type: inline-size; container-name: cartao; }

@container cartao (width >= 24rem) {
  .cartao__corpo { display: grid; grid-template-columns: 4rem minmax(0, 1fr); gap: var(--space-3); }
  .cartao__titulo { font-size: 1.25rem; }
}
@container cartao (width >= 34rem) {
  .cartao__descricao { display: block; }   /* some nos tamanhos menores */
}
```

Duas armadilhas: `container-type: inline-size` cria contenção no eixo horizontal, então o elemento deixa de ser dimensionado pelo conteúdo nesse eixo (não use em algo que precisa de `max-content`); e **um container não consulta a si mesmo**, a consulta sobe para o container mais próximo acima.

**Quebra sem media query**, para itens de larguras naturais diferentes:

```css
.acoes { display: flex; flex-wrap: wrap; gap: var(--space-3); }
.acoes > * { flex: 1 1 14rem; min-width: 0; }
```

Variante "ou os dois na linha, ou cada um na sua": `flex: 1 1 calc((34rem - 100%) * 999)`. Acima de 34rem o multiplicador fica negativo, a base vira 0 e os dois ficam lado a lado; abaixo, vira um valor gigante e cada um ocupa a linha inteira.

### 12.5 Tipografia e espaço, com rigor

#### Por que `clamp()` precisa de `rem` no meio

Critério 1.4.4 da WCAG: o texto precisa poder ser ampliado a 200% sem perda de conteúdo ou função.

`clamp(1rem, 2.5vw, 1.5rem)` tem o termo preferido só em `vw`. Sob **zoom apenas de texto**, a janela não muda, `2.5vw` não muda, e o texto não cresce. **Reprova.**

`clamp(1rem, 0.9rem + 0.5vw, 1.25rem)` tem um componente que cresce com a raiz. **Passa.**

**Regra numérica:** na largura-alvo de computador (1440), o componente em `rem` deve responder por **pelo menos 50%** do valor final. Verificando: `clamp(1rem, 0.95rem + 0.3vw, 1.25rem)` a 1440 dá 15,2 mais 4,32, com o `rem` contribuindo 78%. Passa. Já `clamp(1rem, 0.4rem + 1.2vw, 1.25rem)` tem o `rem` contribuindo 27%. Reprova.

**E nunca use `px` no terceiro argumento.** Teto em `px` trava e o texto para de crescer antes dos 200%.

#### Escala que não achata nem estoura

Razão variável: menor no celular, maior no computador. É isso que impede o achatamento, porque **o título escala muito mais que o corpo**.

| Degrau | 360 px | 1440 px | Declaração |
|---|---|---|---|
| menor | 14,0 | 15,0 | `clamp(0.875rem, 0.85rem + 0.11vw, 0.9375rem)` |
| corpo | 16,0 | 19,0 | `clamp(1rem, 0.93rem + 0.28vw, 1.1875rem)` |
| 1 | 19,2 | 25,3 | `clamp(1.2rem, 1.07rem + 0.57vw, 1.583rem)` |
| 2 | 23,0 | 33,8 | `clamp(1.44rem, 1.21rem + 1.0vw, 2.11rem)` |
| 3 | 27,6 | 45,0 | `clamp(1.728rem, 1.36rem + 1.63vw, 2.81rem)` |
| 4 | 33,2 | 60,0 | `clamp(2.074rem, 1.52rem + 2.47vw, 3.75rem)` |
| 5 (título) | 39,8 | 80,0 | `clamp(2.488rem, 1.65rem + 3.72vw, 5rem)` |

A razão entre título e corpo é 2,49 no celular e 4,21 no computador. Essa diferença é intencional: é a hierarquia crescendo com a tela.

#### Medida de linha, com a correção que quase ninguém faz

A unidade `ch` é a largura do algarismo zero, que em fontes de interface fica entre 0,5 e 0,58 em. Como as minúsculas são mais estreitas, **`65ch` entrega de 72 a 80 caracteres reais**, não 65.

Para 65 caracteres de verdade, use cerca de `58ch`, ou calcule direto:

```
largura_alvo = caracteres_alvo × 0,5 × tamanho_da_fonte
```

Com corpo de 19 px e alvo de 68 caracteres: 68 × 0,5 × 19 dá 646 px, ou seja `max-width: 40.5rem`.

#### Espaço em dois modos

Interno de componente é fixo, porque componente não deve inchar com a tela. Entre seções é fluido.

```css
:root {
  --space-1:.25rem; --space-2:.5rem; --space-3:.75rem;
  --space-4:1rem;   --space-5:1.5rem; --space-6:2rem;

  --space-secao: clamp(3rem, 1.75rem + 5.6vw, 8rem);
  --space-bloco: clamp(2rem, 1.5rem + 2.2vw, 4rem);
}
```

O teto do `--space-secao` só é atingido a 1786 px, e é ele que impede o espaço morto em tela muito larga.

**Regra do vazio:** o espaço vertical entre seções nunca passa de **1,6 vez** a altura do maior bloco de texto da seção. Uma seção com três linhas de texto e 128 px de respiro acima e abaixo parece abandonada. Nessas, use `--space-bloco`.

### 12.6 Reflow por tipo de seção, e as armadilhas do celular

#### Por seção

| Seção | No celular | Armadilha | Solução |
|---|---|---|---|
| Topo | 1 coluna, imagem abaixo, título em até 3 linhas | Tamanho fixo gera título de 5 linhas; `100vh` esconde a ação atrás da barra do navegador; recorte corta o rosto | `clamp()` com `max-width` em `ch`, `min-height: 100svh`, `object-position` declarado |
| Bento | Tudo em 1 coluna, na ordem de importância | `grid-column: span 2` herdado faz o bloco ocupar 2 de 1 coluna e estourar | Spans só dentro de `@container` ou acima do breakpoint. `min-width: 0` **e** `min-height: 0` nos filhos |
| Grade de cartões | 1 coluna | `minmax(280px, 1fr)` estoura a 320 | `minmax(min(100%, 17rem), 1fr)` e `subgrid` para alinhar as partes |
| Navegação | Logotipo, uma ação e o botão de menu | Menu recolhido cedo demais; painel sem travar o foco; âncora caindo atrás do cabeçalho fixo | Breakpoint medido pela soma real das larguras; `inert` no fundo; `scroll-padding-top` igual à altura do cabeçalho |
| Passo a passo horizontal | Empilhado, com a linha conectora na vertical | A conectora continua horizontal depois de empilhar e cruza o texto | `grid-auto-flow` trocando de coluna para linha, e a conectora desenhada pela mesma query |
| Depoimento | Um por vez, avatar de 48 px | Três colunas a 1024 dão 300 px cada e a citação vira 9 linhas; aspas decorativas enormes criam estouro | 2 colunas a 1024, 3 só a partir de 1280; `overflow: clip` no cartão |
| Rodapé | Colunas empilhadas | `space-between` sem quebra comprime tudo; acordeão por altura máxima quebra a busca na página | `auto-fit` e `<details>` nativo, aberto acima do breakpoint |
| Formulário | 1 coluna sempre, rótulo acima | Fonte menor que 16 px causa zoom no iOS; pares forçados lado a lado a 320; botão sob a barra do sistema | `font-size: max(1rem, 16px)`, pares com `flex-wrap`, área segura |

#### Tabela comparativa, pior caso número 1

Cinco planos e doze atributos não cabem em 360 px. **Nunca resolva com `transform: scale()`**: quebra zoom, leitor de tela e alvo de toque.

**A. Rolagem horizontal com região acessível.** Correta quando a comparação lado a lado é o valor da seção.

```html
<div class="tabela-rolavel" role="region" aria-label="Comparativo de planos" tabindex="0">
  <table>...</table>
</div>
```

```css
.tabela-rolavel { overflow-x: auto; overscroll-behavior-x: contain; scroll-snap-type: x proximity; }
.tabela-rolavel table { border-collapse: collapse; min-width: 46rem; }
.tabela-rolavel th[scope="row"] { position: sticky; left: 0; background: var(--bg); z-index: 1; }
.tabela-rolavel td, .tabela-rolavel th { scroll-snap-align: start; }
.tabela-rolavel:focus-visible { outline: 2px solid var(--foco); outline-offset: 2px; }
```

`role="region"` mais `tabindex="0"` mais `aria-label` é o que torna a área rolável alcançável por teclado. Sem isso, quem navega por teclado não consegue rolar a tabela. Acrescente sombras nas bordas para avisar que há mais conteúdo.

**B. Uma ficha por plano no celular.** Correta quando a decisão é escolher um plano, não comparar atributo a atributo. Custo: transformar `table` em blocos destrói a semântica para leitor de tela, então reponha os papéis com `role="table"`, `role="row"` e `role="cell"`.

**C. Seletor de duas colunas.** Dois campos "comparar X com Y" e a tabela mostra só essas duas. É o que melhor converte em página de preço, e o mais trabalhoso.

**Decisão:** até 3 colunas, B. De 4 para cima com atributos comparáveis, A. Em página de preço com intenção de compra, C.

#### Diagrama horizontal, pior caso número 2

Ver também a seção 9. Quatro estratégias, em ordem de preferência:

1. **Duas versões do desenho**, trocadas por `<picture>` com `media`. A melhor, e a que quase ninguém faz.
2. **SVG embutido que se reorganiza.** Media query dentro de um SVG embutido responde à **janela**, não ao SVG. E o `viewBox` não pode ser trocado por CSS: precisa de `matchMedia` em JavaScript.
3. **Rolagem horizontal com encaixe**, para sequência linear, sempre com `role="region"`, `tabindex="0"` e um indicador visível de posição.
4. **Escalar o desenho inteiro.** Só funciona se o texto continuar legível. A conta: um SVG com `viewBox` de 1200 e texto de 14 unidades renderiza esse texto a 14 × (360/1200), ou seja **4,2 px** no celular. Regra: `tamanho_no_viewBox >= 12 × largura_do_viewBox / 360`. Para um `viewBox` de 1200, o texto precisa ter no mínimo 40 unidades. Se o desenho não comporta, volte à opção 1.

#### Encontrar o culpado do estouro horizontal

`* { outline: 1px solid red }` não serve: mostra todas as caixas, não qual estoura. Rode isto no console:

```js
(() => {
  const w = document.documentElement.clientWidth;
  const alvos = [...document.querySelectorAll('body *')].filter(e => {
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && (r.right > w + 1 || r.left < -1);
  });
  const set = new Set(alvos);
  // raiz = nenhum ancestral estoura. É onde a correção costuma entrar.
  const raizes = alvos.filter(e => {
    let p = e.parentElement;
    while (p && p !== document.body) { if (set.has(p)) return false; p = p.parentElement; }
    return true;
  });
  console.table(raizes.map(e => {
    const r = e.getBoundingClientRect();
    return {
      seletor: e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') +
        (typeof e.className === 'string' && e.className.trim()
          ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : ''),
      largura: Math.round(r.width),
      excesso: Math.round(r.right - w),
      texto: (e.textContent || '').trim().slice(0, 40)
    };
  }));
  raizes.forEach(e => { e.style.outline = '3px solid magenta'; e.style.outlineOffset = '-3px'; });
  return raizes;
})();
```

Causas, por frequência:

| Causa | Correção |
|---|---|
| `width: 100vw` dentro de um pai com respiro lateral | Largura total, ou a grade de 12.3 |
| Margem negativa de meia janela para sangria | A mesma grade |
| Grade sem `minmax(0,1fr)` ou flex sem `min-width: 0` | Acrescentar |
| Palavra longa (endereço, e-mail, código) | `overflow-wrap: anywhere` no bloco de texto |
| Imagem sem largura máxima | `img, svg, video { max-width: 100%; height: auto; }` |
| Decoração em posição absoluta saindo pela direita | `overflow: clip` no invólucro, **não** `hidden` |
| Deslocamento horizontal em animação de entrada | `overflow-x: clip` na seção, ou anime opacidade e deslocamento vertical |

**Nunca "corrija" com `overflow-x: hidden` no `body`.** Isso esconde o sintoma, torna o conteúdo inalcançável e **quebra `position: sticky`** em todos os descendentes.

#### As outras armadilhas do celular

| Armadilha | Causa | Correção |
|---|---|---|
| `100vh` corta a ação do topo | No iOS, `100vh` equivale à altura com a barra do navegador **retraída**. Ao carregar ela está expandida, e a parte de baixo do topo, onde costuma estar a ação, fica atrás da barra | `min-height: 100svh` para layout. `height: 100dvh` **só** para elementos fixos. `dvh` em layout dispara reflow a cada rolagem e vira tremor e CLS |
| `position: sticky` não gruda | Qualquer ancestral com `overflow` diferente de `visible` vira o contexto de rolagem. O caso mais comum é o `overflow-x: hidden` posto no `body` | Trocar por `overflow: clip` onde era só cortar decoração; remover do `body` e corrigir a causa real. O pai direto também precisa ser mais alto que o elemento |
| Hover grudado no toque | `:hover` sem guarda | `@media (hover: hover) and (pointer: fine)`, mais `:focus-visible` e `:active` sempre. **Nunca esconda informação atrás de hover**: em toque ela não existe |
| Alvo pequeno demais | WCAG 2.2 exige 24 por 24 px (critério 2.5.8) | Use **44 px como padrão** e 24 como piso. Cresça a área sem crescer o ícone, com um `::after` posicionado e centralizado |
| Zoom automático do iOS no campo | O iOS amplia a janela ao focar um campo com fonte menor que 16 px | `input, select, textarea { font-size: max(1rem, 16px); }`. O `max()` protege também quando a raiz foi definida em 10 px. **Nunca** use `maximum-scale=1` nem `user-scalable=no`: isso desativa o zoom do usuário e reprova em acessibilidade |
| Teclado virtual cobrindo o campo | O teclado encolhe a janela visual, não a de layout | Ouvir `visualViewport` e rolar o campo focado para a área visível; barra de ação do formulário em `sticky`, não em `fixed` |
| Botão sob a barra do sistema | Aparelho com entalhe ou indicador inferior | `viewport-fit=cover` no meta, mais `padding-block-end: calc(var(--space-4) + env(safe-area-inset-bottom, 0px))`. **Sempre com o valor de reserva `0px`**, senão navegadores que não reconhecem descartam a declaração inteira |

```js
// mantém o campo focado visível quando o teclado abre
const vv = window.visualViewport;
if (vv) {
  const reposicionar = () => {
    const el = document.activeElement;
    if (!el || !/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
    const r = el.getBoundingClientRect();
    const limite = vv.height - 16;
    if (r.bottom > limite) window.scrollBy({ top: r.bottom - limite + 24, behavior: 'smooth' });
  };
  vv.addEventListener('resize', reposicionar);
  document.addEventListener('focusin', () => setTimeout(reposicionar, 300));
}
```

#### Imagem: `sizes` errado desperdiça banda

Sem `sizes`, o navegador assume a janela inteira. Numa tela de 1440 com densidade 2, ele busca um arquivo de 2880 px mesmo que a imagem apareça numa coluna de 400. O candidato certo teria 800. Como bytes escalam com área, a diferença é de **cerca de 13 vezes**.

A conta do desperdício: uma imagem de 2400 px exibida num espaço de 600 px com densidade 1 tem fator linear 4, e desperdiça `1 - 1/4²`, ou seja **94%** dos pixels decodificados.

```html
<img src="/foto-800.webp"
     srcset="/foto-400.webp 400w, /foto-640.webp 640w, /foto-800.webp 800w,
             /foto-1200.webp 1200w, /foto-1600.webp 1600w"
     sizes="(width >= 64rem) 32vw, (width >= 48rem) 48vw, 100vw"
     width="1200" height="800" alt="..." loading="lazy" decoding="async">
```

`sizes` precisa espelhar o CSS real: se o container tem máximo de 1200 px, a condição correta é `min(32vw, 384px)`, não `32vw`. `width` e `height` sempre presentes, mesmo com `srcset`, para reservar a caixa. A imagem do topo recebe `fetchpriority="high"` e **nunca** `loading="lazy"`. Degraus de cerca de 1,5 vez entre si.

### 12.7 Auditoria medida

O roteiro complementa o QA geral da seção 16: aqui a verificação é **por largura**. Ele mede estouro horizontal com a cadeia de culpados, elemento cortado à esquerda, alvo de toque, fonte efetiva do corpo e dos campos, contraste, imagem maior que o espaço de layout, `sticky` quebrado, `100vh` em altura de layout, medida de linha, CLS, erros de JavaScript e requisições com erro; e captura a tela por largura.

O script está em `scripts/auditar-responsivo.mjs`. Precisa de Node 18 ou mais novo e do Playwright, instalado uma vez na pasta do projeto:

```bash
npm i -D playwright && npx playwright install chromium

# página publicada
node scripts/auditar-responsivo.mjs https://sua-landing.com.br --shots --zoom200 --reduced-motion

# arquivo local, antes de publicar
node scripts/auditar-responsivo.mjs ./index.html --shots

# só algumas larguras, para iterar rápido
node scripts/auditar-responsivo.mjs ./index.html --widths=360,1280,1440
```

| Opção | O que faz |
|---|---|
| `--widths=` | Larguras testadas. Padrão: 320, 360, 390, 414, 768, 1024, 1280, 1366, 1440 e 1920 |
| `--out=` | Pasta do relatório e das capturas. Padrão: `./rel-responsivo` |
| `--shots` | Salva captura de página inteira por largura, para a revisão a olho do critério 15 de 12.8 |
| `--zoom200` | Passada extra com zoom só de texto a 200% (WCAG 1.4.4), nas larguras a partir de 768 |
| `--reduced-motion` | Passada extra com a preferência de movimento reduzido ligada |

**Como ler a saída.** `[x]` é falha bloqueante de 12.8; `[!]` é aviso de qualidade, que exige justificativa escrita para passar. O relatório completo fica em `relatorio.json`, com o seletor de cada culpado. O script sai com código 1 quando há falha, então serve direto em integração contínua.

O que o script **não** acusa, de propósito, porque é o padrão recomendado por esta skill: decoração que vaza dentro de um invólucro com `overflow: clip`; coluna fixa (`sticky` horizontal) dentro de tabela rolável; topo com `100svh`.

**Zoom de página a 400%** (critério 1.4.10) não precisa de API: uma janela de 1280 com zoom de 400% equivale a uma janela de 320 px de CSS, e 320 já está na bateria.

**Movimento reduzido:** a passada `--reduced-motion` conta quantos elementos continuam animando. O bloco que torna isso zero:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 12.8 Critério de aprovação

A página só passa se **todas** as afirmações forem verdadeiras em **cada** largura da bateria (320, 360, 390, 414, 768, 1024, 1280, 1366, 1440, 1920), medidas, não observadas a olho.

**Bloqueantes:**

1. `scrollWidth <= clientWidth + 1`. Zero estouro horizontal, e nenhum `overflow-x: hidden` em `html` ou `body` escondendo o problema.
2. Nenhum elemento visível com borda esquerda abaixo de -1 px fora de área rolável ou de recorte intencional. Nada cortado à esquerda.
3. Todo alvo interativo não embutido em texto mede ao menos 24 por 24 px, que é o piso da norma. Nas larguras até 480, abaixo de 44 por 44 gera aviso: 44 é o padrão prático no celular.
4. Todo bloco de corpo com mais de 40 caracteres tem fonte efetiva de ao menos 16 px.
5. Todo campo de formulário tem fonte efetiva de ao menos 16 px.
6. Contraste de ao menos 4,5:1 para texto normal e 3:1 para texto grande, em todo texto com fundo determinável.
7. CLS de no máximo 0,1 por largura, medido **depois** de rolar a página inteira.
8. Nenhum `position: sticky` vertical dentro de contêiner que não rola na vertical (`overflow: hidden`, ou `auto` posto só para conter estouro). `overflow: clip` não quebra o `sticky`.
9. Na passada de zoom de texto a 200%: nenhum texto permanece abaixo de 18 px e nenhum estouro novo aparece.
10. Na passada de movimento reduzido: nenhuma animação acima de 0,2 s permanece ativa.

**Condição de qualidade**, que exige justificativa escrita para passar:

11. Nenhuma imagem com largura natural acima de 1,6 vez o espaço de layout multiplicado pela densidade, e nenhum `srcset` sem `sizes`.
12. Medida de linha de prosa entre 45 e 80 caracteres.
13. Nenhuma altura de layout escrita em `100vh`. Use `100svh` no layout e `100dvh` só em elemento fixo.
14. Zero erros de JavaScript em qualquer largura.
15. **As capturas de 360, 1280, 1366 e 1440 foram abertas e revisadas por uma pessoa.** Medição não substitui o olho para hierarquia e espaço morto.

### 12.9 Erros comuns de responsividade

| Erro | Sintoma | Correção |
|---|---|---|
| `overflow-x: hidden` no `body` para matar a barra | Some a barra, o sticky para de grudar e parte do conteúdo fica inalcançável | Ache a causa com o trecho de console de 12.6 ou com a auditoria de 12.7; `overflow: clip` local onde era só decoração |
| `width: 100vw` em bloco de sangria | Barra horizontal exatamente da largura da barra de rolagem | Grade de página de 12.3 |
| `min-height: 100vh` no topo | No iOS a ação fica atrás da barra do navegador, e a seção pula ao rolar | `100svh` no layout, `100dvh` só em elemento fixo |
| `clamp()` sem `rem` no meio | Com zoom de texto o título não cresce | Componente em `rem` dominante |
| Teto do `clamp()` em `px` | O texto para de crescer antes dos 200% | Teto sempre em `rem` |
| `minmax(280px, 1fr)` | Estoura a 320 px | `minmax(min(100%, 17rem), 1fr)` |
| Campo com fonte de 14 px | O iOS amplia ao focar e a página fica deslocada | `font-size: max(1rem, 16px)` |
| `maximum-scale=1` no meta | A pessoa não consegue ampliar | Remover e resolver pelo item acima |
| `srcset` sem `sizes` | Banda desperdiçada e carregamento lento no 4G | `sizes` espelhando o CSS real |
| Imagem sem `width` e `height` | CLS alto, o texto pula quando a imagem carrega | Sempre ambos, mais `aspect-ratio` |
| Informação exclusiva no hover | Em toque ela não existe | Guarda de `hover` e informação sempre visível |
| Tabela com `transform: scale()` no celular | Texto de 9 px e alvos de 14 px | Rolagem com região acessível, ou ficha por plano |
| Diagrama com largura total | O texto do SVG renderiza a 4 px | Duas versões do desenho, ou rolagem com encaixe |
| `grid-column: span 2` sem query | O bloco estoura onde só há uma coluna | Spans só dentro de `@container` ou acima do breakpoint |
| Menu recolhido já em 1024 | 340 px de vazio na barra do computador pequeno | Meça a soma real das larguras. Costuma ser `72rem` |
| Âncora com cabeçalho fixo | O título fica atrás do cabeçalho | `scroll-padding-top` igual à altura do cabeçalho |
| Container com largura máxima e sem respiro | A 1280 o conteúdo encosta nas bordas | `width: min(100% - 2 * var(--gutter), 75rem)` |
| Breakpoints em `px` | Quem aumenta a fonte do navegador não recebe o layout simplificado | Breakpoints em `rem` |
| Barra fixa sem área segura | O botão fica sob a barra do sistema | `env(safe-area-inset-bottom, 0px)` e `viewport-fit=cover` |
| `text-wrap: balance` em parágrafo | Nada acontece e o layout fica mais caro | `balance` só em título |
| Palavra longa em cartão estreito | Barra horizontal de 40 px a 360 | `overflow-wrap: anywhere` |
| `100dvh` em seção de layout | A página treme a cada rolagem e isso vira CLS | `svh` no layout, `dvh` só em fixo |
