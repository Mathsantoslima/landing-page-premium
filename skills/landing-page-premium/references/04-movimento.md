> Referência da skill `landing-page-premium`. O processo, os portões e as regras anti-slop estão no `SKILL.md`. A numeração das seções é a mesma em todos os arquivos.

## 6. Movimento

### 6.0 Calibre a intensidade pela ficha

O vocabulário de movimento é o mesmo em qualquer projeto. A **intensidade** vem do nível escolhido no portão 1.

| Nível | Distância de entrada | Cascata | Ciclo automático | Paralaxe | Combina com |
|---|---|---|---|---|---|
| **Discreto** | 8 a 12 px, só opacidade em boa parte | 20 a 30 ms | não | não | Financeiro, jurídico, saúde séria |
| **Equilibrado** (padrão) | 16 a 20 px | 40 a 50 ms | sim, pausando | leve, só em ponteiro fino | Maioria dos produtos |
| **Expressivo** | 24 a 32 px, com desfoque leve | 60 a 80 ms | sim | sim | Criativo, consumidor, lançamento |

Em todos os níveis: a saída é mais rápida que a entrada, a curva é a mesma, e o bloco de movimento reduzido é obrigatório.

### 6.1 Vocabulário mínimo

**Uma curva principal** para quase tudo: `cubic-bezier(.22,1,.36,1)`.

Para casos específicos:

| Situação | Curva |
|---|---|
| Entrada (elemento aparece) | `cubic-bezier(.05,.7,.1,1)` (desacelera) |
| Saída (elemento some) | `cubic-bezier(.3,0,.8,.15)` (acelera) |
| Movimento bidirecional | `cubic-bezier(.2,0,0,1)` |
| Cor e loop ambiente | `linear` |

Nunca use `linear` em movimento espacial. Nunca use o `ease` padrão do CSS em hover, porque ele tem aceleração inicial e atrasa a percepção de resposta.

**Duas faixas de duração:** interface, de 50 a 300 ms, e entrada ou transição grande, de 300 a 600 ms. Dentro delas:

| Tipo | Duração |
|---|---|
| Micro-feedback | 50 a 150 ms |
| Hover e foco | 120 a 200 ms |
| Mudança de estado | 200 a 300 ms |
| Entrada de elemento | 300 a 500 ms |
| Saída | 150 a 250 ms, sempre mais rápida que a entrada |
| Transição grande | 400 a 600 ms |

Regra: quanto maior a área percorrida, maior a duração.

### 6.2 Entrada coreografada

Três camadas, em ordem de sofisticação:

**1. Revelação por rolagem.** Blocos sobem 18 px e aparecem.

```css
.js .reveal:not(.in){opacity:0;transform:translateY(18px)}
.reveal{transition:opacity .9s var(--ease),transform .9s var(--ease)}
```

**2. Coreografia do topo.** Atraso declarado por elemento, com desfoque leve:

```css
.js .intro{opacity:0;transform:translateY(18px);filter:blur(6px)}
.js.ready .intro{opacity:1;transform:none;filter:none;
  transition:opacity .9s var(--ease),transform 1.15s var(--ease),filter .9s var(--ease);
  transition-delay:calc(var(--d,0) * 1ms)}
```

```html
<h1 class="intro" style="--d:0">…</h1>
<p  class="intro" style="--d:560">…</p>
<div class="intro" style="--d:680">…</div>
```

A classe `ready` entra depois de `document.fonts.ready`, com teto de 800 ms, para a animação não começar com a fonte errada.

As duas classes de controle, ligadas assim. A classe `js` garante que, sem JavaScript, nada fica invisível:

```html
<!-- no <head>, antes do CSS -->
<script>document.documentElement.classList.add('js')</script>
```

```js
// revelação por rolagem: .reveal ganha .in ao entrar na tela, uma vez
const ioReveal = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); ioReveal.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => ioReveal.observe(el));

// coreografia do topo: espera a fonte, com teto de 800 ms
Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 800))])
  .then(() => document.documentElement.classList.add('ready'));
```

**3. Revelação por palavra** em títulos. Ver o código em 17.2.

**Cascata:** 30 a 80 ms entre itens, 42 ms é um bom padrão. Teto total de 500 a 800 ms. Em lista longa, aplique a cascata nos 6 a 8 primeiros e libere o resto de uma vez.

### 6.3 Microinterações obrigatórias

Uma página premium tem movimento em toda interação. O mínimo:

| Elemento | Comportamento |
|---|---|
| Botão | Seta gira, fundo muda, pressão leve no clique |
| Cartão | Elevação, com elementos internos em velocidades diferentes |
| Cartão escuro | Brilho radial que segue o cursor |
| Ícone | Traço desenhado na entrada, animação própria no hover |
| Navegação | Marca a seção atual e mostra progresso de leitura |
| Número | Conta até o valor ao entrar na tela |
| Topo | Paralaxe leve, só em ponteiro fino |

**Brilho que segue o cursor:**

```css
.spot{isolation:isolate}
.spot::after{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;
  background:radial-gradient(360px circle at var(--mx,50%) var(--my,30%),
             color-mix(in srgb,var(--accent) 22%,transparent),transparent 62%);
  opacity:0;transition:opacity .35s;pointer-events:none}
.spot:hover::after{opacity:1}
```

```js
document.querySelectorAll('.spot').forEach(el => el.addEventListener('pointermove', e => {
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  el.style.setProperty('--my', (e.clientY - r.top) + 'px');
}));
```

### 6.4 Ícones animados por traço

Duas etapas. Primeiro o traço se desenha quando o ícone entra na tela. Depois, cada ícone tem uma animação própria no hover.

```css
svg.ic[data-i]>*{stroke-dasharray:1 1;transition:stroke-dashoffset .9s var(--ease)}
.js svg.ic[data-i]:not(.drawn)>*{stroke-dashoffset:1}

.ic .hand{transform-box:view-box;transform-origin:12px 12px}
.ic .eye,.ic .dot{transform-box:fill-box;transform-origin:center}

@keyframes i-spin{to{transform:rotate(360deg)}}
@keyframes i-redraw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes i-beat{0%,100%{transform:scale(1)}18%{transform:scale(1.22)}54%{transform:scale(1.12)}}

@keyframes i-nudge{40%{transform:translateX(3px)}}
@keyframes i-flash{30%{opacity:.35}}

svg.play[data-a="spin"]{animation:i-spin .9s var(--ease)}
svg.play[data-a="beat"]{animation:i-beat .9s ease}
svg.play[data-a="check"] .chk{animation:i-redraw .65s var(--ease) both}
svg.play[data-a="clock"] .hand{animation:i-spin .9s var(--ease)}
svg.play[data-a="line"]>*{animation:i-redraw .8s var(--ease) both}
svg.play[data-a="nudge"]{animation:i-nudge .6s var(--ease)}
svg.play[data-a="flash"]{animation:i-flash .6s ease}
svg.play[data-a="target"] .dot{animation:i-beat .9s ease}
```

Cada nome em `data-a` precisa de uma regra aqui. O mapa de ícone para animação está em 17.3; ícone novo ganha linha nos dois lugares.

**Dois detalhes técnicos que a maioria erra:**

1. `pathLength="1"` em cada forma normaliza o comprimento do traço. Sem isso, você precisa medir com `getTotalLength()` em JS e a animação fica dependente do tamanho.
2. Em SVG, `transform-origin` é relativo ao `viewBox`, não ao elemento. Sem `transform-box: fill-box`, uma rotação gira em torno do canto do canvas.

O script de conversão está em 17.3.

### 6.5 Empilhamento de seções

Duas seções finais em que a primeira fica presa e a segunda sobe por cima:

```css
.stackfx{position:relative}
.stack-card{position:sticky;top:var(--st,12px);z-index:1}
.stack-top{position:relative;z-index:2;margin-top:24px;
           box-shadow:inset 0 0 0 1px var(--line-2),0 -40px 80px -40px color-mix(in srgb,var(--ink) 45%,transparent)}
```

```js
// quando a seção presa é mais alta que a tela, ancore pelo fim
const card = document.querySelector('.stack-card');
const fit = () => card.style.setProperty('--st', Math.min(12, innerHeight - card.offsetHeight - 12) + 'px');
addEventListener('resize', fit); fit();
```

**Atenção:** `overflow: hidden` ou `auto` em qualquer ancestral mata o `sticky`. Para cortar decoração, use `overflow: clip`, que não cria contexto de rolagem.

**Não acrescente** redução de escala nem escurecimento sem pedido. O efeito pedido é o empilhamento.

### 6.6 Movimento reduzido

Implemente junto, não depois.

```css
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{animation:none!important;transition-duration:.01ms!important}
  .js .reveal:not(.in){opacity:1;transform:none}
  .js .intro{opacity:1!important;transform:none!important;filter:none!important}
  .stack-card{position:relative}
  .js svg.ic[data-i]:not(.drawn)>*{stroke-dashoffset:0}
}
```

No JS, leia a preferência uma vez e reutilize a constante em todo o código (17.1, 17.2 e 17.3 contam com ela):

```js
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
```

**Desligue:** paralaxe, movimento de área grande, rotação, escala, ciclo automático, rolagem suave.
**Mantenha:** mudança de cor, opacidade curta, feedback de estado. Remover todo feedback prejudica a visibilidade do estado do sistema.

**Regra de conteúdo em movimento (WCAG 2.2.2):** qualquer movimento automático que dure mais de 5 segundos e conviva com outro conteúdo precisa de pausa. Os ciclos automáticos desta skill pausam no hover, no foco e fora da tela, o que atende.

### 6.7 Regras binárias e a heurística de frequência

#### Quando não animar

A decisão mais importante de movimento não é a curva, é **se deve haver movimento**. Use a frequência de uso:

| Frequência | Decisão |
|---|---|
| Dezenas ou centenas de vezes por dia (atalho, paleta de comandos) | **Nenhuma animação, nunca** |
| Várias vezes por sessão (hover, navegar lista) | Reduzir drasticamente |
| Ocasional (janela, gaveta, aviso) | Animação padrão |
| Raro ou de primeira vez (abertura, conclusão, celebração) | Pode encantar |

Numa landing page quase tudo é de primeira vez, e é por isso que ela comporta mais movimento que um aplicativo. **Essa é a autorização técnica, e ela tem limite:** a regra geral de que animação de interface fica abaixo de 300 ms vale para interface, e a exceção declarada é exatamente "a não ser que você esteja trabalhando em página de marketing". A coreografia longa, de 1 s a 1,5 s com atrasos encadeados, é legítima **quando o movimento acompanha leitura**, nunca quando acompanha um clique.

#### Regras que não admitem exceção

| Regra | Motivo |
|---|---|
| **Nunca `transition: all`** | Pode animar propriedade de layout sem você perceber e travar a página. Liste as propriedades |
| **Nunca anime propriedade de layout** (`top`, `left`, `width`, `height`) | Só `transform` e `opacity` pulam layout e pintura |
| **Nunca anime a partir de `scale(0)`** | Nada no mundo real some e reaparece. Comece de `.95` ou mais, junto com a opacidade |
| **Nunca `ease-in` em interface** | Atrasa o movimento inicial, justamente quando o olho está mais atento. A 300 ms, `ease-in` **parece** mais lento que `ease-out` nos mesmos 300 ms |
| **Nunca mude o peso da fonte no hover** | Desloca o layout |
| Transição, não `keyframes`, para o que dispara rápido | Transição é interrompível e remira no meio do caminho; `keyframes` reinicia do zero |
| Ordem de implementação: CSS, depois a API de animação do navegador, depois biblioteca | Biblioteca é a última opção, não a primeira |
| `:active` com `transform: scale(.97)` em tudo que é pressionável | Entre `.95` e `.98`, em 160 ms |
| `transform-origin` ancorado ao gatilho em elemento flutuante | Exceto janela modal, que fica no centro por não estar ancorada |
| Animação em laço pausa quando sai da tela | Poupa processador e bateria |
| Troca de tema não dispara transição | Senão o hover anima junto e a página pisca |
| Escalonamento entre itens de lista: 30 a 80 ms | E **nunca** bloqueie a interação enquanto o escalonamento toca |
| Estado de carregamento: atraso de 150 a 300 ms para aparecer, mínimo de 300 a 500 ms visível | Senão pisca |
| Transformação em SVG vai no `<g>`, com `transform-box: fill-box` | Ver 9.5 |

#### Revisão em câmera lenta

Antes de dizer que o movimento está pronto, **multiplique todas as durações por 2 a 5**, ou use o painel de animações do navegador, e procure quatro defeitos que só aparecem desacelerados:

1. Dois estados de cor visíveis ao mesmo tempo durante a transição.
2. Curva que começa ou termina de forma abrupta.
3. Origem de transformação errada, com o elemento girando ou escalando a partir do ponto errado.
4. Propriedades que deveriam andar juntas e estão fora de sincronia.

Depois, **revise no dia seguinte.** Olhos frescos notam imperfeição que a sessão de trabalho esconde.
