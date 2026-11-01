> Referência da skill `landing-page-premium`. O processo, os portões e as regras anti-slop estão no `SKILL.md`. A numeração das seções é a mesma em todos os arquivos.

## 4. Sistema de design

### 4.1 Estrutura de tokens

**Os nomes são fixos. Os valores vêm da ficha do portão 1.** Copie a estrutura, nunca os valores.

```css
:root{
  /* SUPERFÍCIES: derive do neutro da marca */
  --bg:____;               /* fundo da página. Evite branco puro, que endurece */
  --panel:____;            /* painel de seção alternada, 2 a 4% mais escuro que o fundo */
  --panel-2:____;          /* hover de superfície */
  --white:#fff;            /* cartão sobre painel */

  /* TEXTO: derive do tom escuro da marca, não de cinza neutro */
  --ink:____;              /* título e fundo escuro */
  --text:____;             /* corpo. Alvo: 7:1 sobre o fundo */
  --muted:____;            /* secundário. Alvo: 4,5:1 no mínimo, MEÇA */
  --line:____;             /* borda. Use o tom escuro com 6 a 10% de opacidade */
  --line-2:____;

  /* MARCA */
  --accent:____;           /* sinal: destaque, gráfico, estado ativo. Traço e ícone pedem 3:1 */
  --action:____;           /* ação: botão primário. Precisa de 4,5:1 com o --on-action */
  --on-action:#fff;        /* texto e ícone sobre o botão primário */
  --foco:____;             /* indicador de foco: 3:1 contra o fundo. Em geral, o próprio --action */
  --accent-tint:____;      /* fundo de selo, o acento com 10 a 15% */
  --second:____;           /* contraponto, um elemento por composição */

  /* ESTADO: ajuste o matiz à paleta, mantendo a leitura cultural */
  --danger:____; --danger-tint:____; --ok:____;

  /* TIPOGRAFIA: famílias da ficha */
  --f-head:'____',ui-sans-serif,system-ui,sans-serif;
  --f-body:'____',ui-sans-serif,system-ui,sans-serif;
  --f-serif:'____',Georgia,serif;          /* opcional, só para destaque */

  /* MOVIMENTO: uma curva para quase tudo */
  --ease:cubic-bezier(.22,1,.36,1);

  /* SUPERFÍCIE: o matiz da sombra sai do --ink, nunca preto puro */
  --sh-ui:0 1px 2px ____,0 14px 34px -14px ____;
  --sh-float:0 2px 6px ____,0 30px 60px -24px ____;

  /* LAYOUT: os mesmos nomes usados na seção 12 */
  --gutter:clamp(1rem,0.72rem + 1.25vw,2.5rem);  /* respiro lateral */
  --content-max:75rem;                            /* largura do conteúdo. Ver 4.4 */
  --prose-max:68ch;                               /* texto corrido. Ver 12.5 */

  /* ESPAÇO: interno de componente é fixo; entre blocos e seções é fluido (12.5) */
  --space-1:.25rem; --space-2:.5rem; --space-3:.75rem;
  --space-4:1rem;   --space-5:1.5rem; --space-6:2rem;
  --space-bloco:clamp(2rem,1.5rem + 2.2vw,4rem);
  --space-secao:clamp(3rem,1.75rem + 5.6vw,8rem);
}
```

Meça os pares de contraste destes tokens antes de seguir: `python3 scripts/contraste.py tokens.css`.

**Exemplo de preenchimento** (projeto de consultoria em saúde, tom sóbrio e clínico). Serve para mostrar a coerência entre os campos, **não para copiar**:

```css
--bg:#FAFAF7; --panel:#F2F5F4; --panel-2:#EAF0EE;
--ink:#102B32; --text:#44585D; --muted:#5B6D71;
--line:rgba(16,43,50,.09); --line-2:rgba(16,43,50,.06);
--accent:#4EADA3; --action:#1F6F66; --accent-tint:#E3F1EE; --second:#D8BCA3;
--f-head:'Manrope'; --f-body:'Inter'; --f-serif:'PT Serif';
```

Repare na lógica, que é o que se reaproveita: o fundo é off-white e não branco; o texto deriva do tom escuro da marca e não de cinza puro; a cor de ação é uma versão mais escura do sinal, para passar no contraste com branco; a borda é o tom escuro com baixa opacidade, para pertencer à paleta.

Repare também no que a medição revela: o `--accent` deste exemplo mede 2,56:1 sobre o `--bg`, abaixo dos 3:1 que gráfico e ícone exigem (13.1). Por isso ele só preenche área grande e fundo de selo; traço, ícone e texto usam o `--action`. É assim que se descobre, antes de desenhar, qual cor pode fazer o quê.

**Regra absoluta:** nenhuma cor, sombra ou curva escrita fora do token. Valor solto no CSS é dívida imediata.

### 4.2 Cor

**Papel por família, não decoração:**

- **Neutros:** carregam 90% da interface. Fundo, borda, texto.
- **Ação:** uma única cor. Tudo que a usa é clicável; nada que a use é decorativo. Isso é Lei da Similaridade mais Efeito Von Restorff: se tudo se destaca, nada se destaca.
- **Sinal:** destaque, gráfico, estado ativo. Precisa ser distinguível da cor de ação.
- **Contraponto:** um acento quente para quebrar monocromia. Um elemento por composição.
- **Estado:** sucesso, atenção, erro. Cada um com fundo, borda e texto.

**Proporção:** mire 70% neutro, 25% estrutura, 5% ação. A cor de ação ocupa o mínimo possível para maximizar o salto de contraste do botão.

**Fundo:** use off-white, não branco puro. Branco puro endurece a página e faz o cartão branco desaparecer.

**Nunca** codifique significado apenas por cor (WCAG 1.4.1). Erro precisa de ícone ou texto, não só de vermelho.

#### Direções visuais: ofereça escolha, não imponha

Quando o usuário não tiver paleta definida, proponha duas ou três destas direções e peça que escolha. Cada uma leva a uma página diferente, com o mesmo nível de qualidade.

| Direção | Caráter | Como se monta | Combina com |
|---|---|---|---|
| **Escura técnica** | Produto, precisão, engenharia | Fundo quase preto, um acento vivo, tipografia sans de baixo contraste, superfícies com borda de 1 px e brilho interno | Ferramenta de desenvolvedor, infraestrutura, dados |
| **Clara institucional** | Confiança, sobriedade, cuidado | Off-white, um tom escuro profundo, um acento de marca, muito espaço | Saúde, jurídico, financeiro, consultoria |
| **Editorial** | Autoridade, conteúdo, opinião | Serifa de peso alto nos títulos, grade de colunas, pouca cor, foto ou ilustração grande | Mídia, educação, conteúdo, pesquisa |
| **Calorosa** | Proximidade, humano, artesanal | Neutros quentes, acento terroso, raio generoso, textura visível | Serviço local, bem-estar, alimentação, comunidade |
| **Monocromática com um acento** | Rigor, foco, maturidade | Uma escala de neutros bem resolvida e uma única cor saturada em menos de 5% da área | Qualquer produto que queira parecer sério |
| **Vibrante contida** | Energia sem infantilidade | Base neutra, dois acentos saturados em área muito pequena, geometria limpa | Produto jovem, criativo, esportivo |

Em todas elas valem as mesmas regras: uma cor de ação, proporção aproximada de 70, 25 e 5, contraste medido e nenhuma cor fora de token.

**Como derivar a cor de ação a partir da cor da marca:** mantenha o matiz, reduza a luminosidade até o contraste com o texto do botão alcançar 4,5:1, e guarde a cor original como sinal. É isso que evita o botão vibrante e ilegível, erro comum quando a cor da marca é clara.

### 4.3 Tipografia

**Três papéis fixos. As famílias que ocupam cada papel vêm da ficha do portão 1.**

| Papel | Uso | Observação |
|---|---|---|
| Título | Todos os títulos e números grandes | Peso de 400 a 600, em geral 400 ou 500. Nunca 800 |
| Corpo | Corpo, rótulo, interface | 400, 500, 600 |
| Destaque | Apenas o trecho de destaque de um título | Opcional. Um destaque por título |

**Pareamentos que funcionam**, para propor quando o usuário não tiver tipografia definida. Todos com licença aberta:

| Direção | Título | Corpo | Destaque |
|---|---|---|---|
| Neutra de produto | Inter ou Geist | a mesma, em peso menor | nenhum, ou itálico da própria |
| Humanista | Manrope | Inter | PT Serif itálico |
| Editorial | Fraunces ou Playfair Display | Inter ou Source Sans | itálico da própria serifa |
| Técnica | Geist ou Space Grotesk | IBM Plex Sans | IBM Plex Mono em rótulo |
| Geométrica | Poppins ou Outfit | Inter | nenhum |
| Clássica | Libre Franklin | Libre Franklin | Libre Caslon itálico |

**Uma família só, em pesos diferentes, é a escolha mais segura.** Hierarquia por peso e tamanho erra menos que hierarquia por família.

**A família de destaque é opcional, e o efeito dela é grande.** Um único trecho do título numa serifa itálica, quando o resto é sans, é o detalhe que mais diferencia o resultado de um template. Vale também o caminho inverso: título em serifa com um trecho em sans. Dois destaques no mesmo título anulam o efeito.

**Teto:** 2 famílias (3 se a serifa for só para destaque), 3 pesos, 6 tamanhos na página inteira.

**Escala fluida com `clamp()`:**

```css
.t-hero{font-size:clamp(2.55rem,1.55rem + 3.7vw,4.25rem);line-height:1.06;letter-spacing:-.024em}
.t-h2  {font-size:clamp(2.05rem,1.45rem + 2.3vw,3.35rem);line-height:1.12;letter-spacing:-.02em}
.t-h3  {font-size:clamp(1.25rem,1.1rem + .5vw,1.5rem);line-height:1.25;letter-spacing:-.012em}
.lead  {font-size:clamp(1.0625rem,1rem + .3vw,1.1875rem);line-height:1.6}
body   {font-size:1rem;line-height:1.6}
```

**Regra de acessibilidade crítica:** o termo do meio do `clamp()` **precisa** ter uma parcela em `rem`. Com `vw` puro, o texto não escala com o zoom do usuário, o que viola WCAG 1.4.4.

**Altura de linha, inversa ao tamanho:**

| Tamanho | Altura |
|---|---|
| Display 56 px ou mais | 1,0 a 1,1 |
| Título 32 a 48 px | 1,15 a 1,25 |
| Subtítulo 20 a 24 px | 1,4 a 1,45 |
| Corpo 16 a 18 px | 1,5 a 1,6 |

**Tracking:** título grande entre `-0,02em` e `-0,04em`; corpo em 0; rótulo em caixa alta entre `+0,05em` e `+0,1em`.

**Medida de linha:** 50 a 75 caracteres, ideal perto de 66. Use `max-width: 65ch` em texto corrido. Subtítulo de topo entre 40 e 55 caracteres. Título com no máximo 3 linhas.

**Acabamento:** `text-wrap: balance` em título e `text-wrap: pretty` em parágrafo.

### 4.4 Espaço e grid

**Base de 8 px.** Todo espaçamento e dimensão em múltiplo de 8, com 4 permitido para micro-ajuste.

**Regra de agrupamento (Gestalt, mensurável):** o espaço entre grupos deve ser no mínimo **2× o espaço interno do grupo**.

| Relação | Espaço |
|---|---|
| Rótulo para campo | 8 px |
| Campo para campo | 16 px |
| Grupo para grupo | 32 a 48 px |
| Seção para seção | `var(--space-secao)`, ver 12.5 |

**Dois níveis de contêiner.** O painel arredondado é mais largo que o texto dentro dele. A largura exata depende da densidade escolhida na ficha: 70rem (1120 px) para leitura confortável, 75rem (1200 px) como padrão, 82,5rem (1320 px) ou mais para página densa de produto. O valor escolhido vai no `--content-max`.

```css
.panel{width:min(86rem,100% - 24px);margin-inline:auto;border-radius:28px}
.wrap {width:min(var(--content-max),100% - 2 * var(--gutter));margin-inline:auto}
```

Isso cria moldura visível e impede que o texto chegue à borda da tela.

**Grids sempre com `minmax(0,1fr)`:**

```css
.grid{display:grid;grid-template-columns:minmax(0,1fr)}
@media (min-width:900px){.grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
```

Sem o `minmax(0, …)`, conteúdo de linha única força a coluna a crescer além da tela e cria rolagem horizontal no celular. É o defeito mais comum e mais invisível em revisão de código.

### 4.5 Superfície

**Sombra em camadas.** Uma sombra única grande parece borrão. Combine uma sombra de contato curta com uma ampla e difusa:

```css
--sh-ui:   0 1px 2px color-mix(in srgb, var(--ink) 6%, transparent),
           0 14px 34px -14px color-mix(in srgb, var(--ink) 28%, transparent);
--sh-float:0 2px 6px color-mix(in srgb, var(--ink) 6%, transparent),
           0 30px 60px -24px color-mix(in srgb, var(--ink) 35%, transparent);
```

O matiz da sombra sai do `--ink`, não do preto puro. Com `color-mix()`, a sombra acompanha a paleta sem nenhum valor solto.

**Teto:** dois tokens de sombra na página inteira. Mais que isso é vocabulário descontrolado.

**Borda de 1 px como acabamento:** `box-shadow: inset 0 0 0 1px var(--line)` em vez de `border`, porque não afeta o cálculo de tamanho.

**Raio:** painel 28 px, cartão 22 a 24 px, elemento de interface 10 a 14 px, botão e selo 999 px. Raio interno igual ao externo menos o padding, com mínimo de 4 px.

**Blur:** só em navegação flutuante e sobreposição. `backdrop-filter` custa paint; muitos elementos simultâneos derrubam o desempenho.

### 4.6 Economia de variáveis

Esta é a medição mais útil que existe sobre páginas de produto de altíssimo nível, e contraria a intuição de quase todo mundo: **a sofisticação vem de usar pouquíssimas variáveis em muitas combinações, não de ter muitas variáveis.**

Levantamento de estilos computados e do CSS de produção de uma página de produto de referência, com quase 10 mil pixels de altura e sete blocos de conteúdo:

| Dimensão | Quantidade no sistema inteiro |
|---|---|
| Famílias tipográficas | **2** (uma display para título, uma de texto para o resto) |
| Tamanhos de texto usados na página | 12, de 18 definidos |
| Entrelinhas | **5 tokens**: 0,8 / 1,0 / 1,125 / 1,25 / 1,375 |
| Entreletras | **4 tokens**, todos em `em` e negativos |
| Rampa neutra | **15 degraus de um mesmo cinza**, do quase preto ao quase branco |
| Fundos de página | **2**, mais um terceiro para uma única seção |
| Cores saturadas | 4, e **só dentro da réplica da interface do produto** |
| Raios | 7 valores, cada um ligado a um tipo de objeto |
| Durações de transição | **3** |
| Curvas de aceleração | **1** |
| Larguras de contêiner | **4** |

**A regra de ouro extraída:** um corpo de display, uma curva, duas temperaturas de fundo, uma rampa neutra. Se o seu sistema tem onze cinzas diferentes, seis durações e quatro curvas, ele não é rico, está descontrolado.

Cinco decisões de sistema que mais elevam o resultado, cada uma traduzida em regra aplicável a qualquer marca:

#### 1. Duas temperaturas, uma rampa, acento só dentro do produto

A página alterna dois fundos e nada mais. Todo texto, borda e superfície sai de uma única rampa neutra. As cores saturadas aparecem **exclusivamente** onde representam um estado real do produto: o indicador de microfone ligado, o cursor de um colega, o botão ativo da barra de formatação.

Se a sua marca é verde, **a página não é verde**: a página é neutra e o verde é o que acende quando algo está certo. É isso que faz o acento valer alguma coisa. Ver 4.2.

#### 2. Um corpo de display para a página inteira

Todos os títulos de seção têm o **mesmo tamanho**. A variação está em entrelinha (0,8 / 0,9 / 1,0) e em peso (500 / 600), nunca em tamanho.

Entrelinha entre 0,8 e 1,0 para corpos acima de 56 px; nunca abaixo de 1,1 para corpos abaixo de 36 px.

#### 3. Compensação óptica entre fundo claro e escuro

O achado mais fino da medição: **o mesmo corpo de 80 px usa entreletra de -0,05em sobre fundo claro e -0,02em sobre fundo escuro**, e o peso cai de 600 para 500 no escuro.

Texto claro sobre fundo escuro ganha peso óptico pelo sangramento da luz. Afrouxe a entreletra e reduza um grau de peso quando inverter a temperatura. E **entreletra sempre em `em`, nunca em `px`**, para acompanhar o corpo.

```css
:root{
  --display: ____;                /* um único tamanho de display para a página */
  --lh-display: .85;              /* entrelinha fechada, só em corpo grande */
  --track-fundo-claro: -0.05em;   /* texto escuro sobre fundo claro */
  --track-fundo-escuro: -0.02em;  /* texto claro sobre fundo escuro: afrouxa */
}
```

#### 4. Cada seção escolhe a própria largura de conteúdo

Defina de **três a quatro larguras de contêiner**, não uma. Conteúdo que exige leitura fica estreito e ganha mais respiro. Conteúdo que exige amplitude fica largo.

Na página medida, a seção de coluna mais estreita é justamente a de maior respiro vertical. Mudar a largura entre seções é o recurso mais barato e mais subestimado para criar ritmo, e é invisível como truque.

#### 5. O respiro vertical é composto à mão, não derivado de token

Os espaços **internos** obedecem a múltiplos reconhecíveis (12, 14, 18, 20, 24, 40, 64, 96). Mas o espaçamento vertical **entre blocos** usa números irregulares: 131, 152, 160, 180, 184, 240, 247, 294.

Isso é composição ajustada à arte, não grade. A grade organiza o conteúdo; o respiro entre blocos é desenhado seção por seção até a emenda sumir. Derivar o vertical de um token de 8 px produz uma página que "bate" e não respira. Nenhum estúdio de referência publica escala de espaçamento numerada para página de produto, e esse silêncio é informativo.

**Como conciliar com o token.** Comece de `--space-secao` (12.5) e ajuste à mão, seção por seção, olhando a emenda. O valor ajustado fica no CSS da própria seção, com um comentário de uma linha dizendo por que ele difere do padrão. Assim o desvio é decisão registrada, não valor solto.
