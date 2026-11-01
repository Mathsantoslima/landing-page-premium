> Referência da skill `landing-page-premium`. O processo, os portões e as regras anti-slop estão no `SKILL.md`. A numeração das seções é a mesma em todos os arquivos.

## 5. Componentes

### 5.0 Escolha uma assinatura de componente

Antes de desenhar os componentes, escolha **uma** assinatura e aplique em toda a página. É ela que faz a página parecer desenhada por uma pessoa, e não montada de pedaços.

| Assinatura | Botão | Cartão | Combina com |
|---|---|---|---|
| **Pílula** | Raio total, seta num círculo | Raio alto, 20 a 28 px | Marca calorosa, consumidor, saúde |
| **Retangular suave** | Raio de 8 a 12 px, sem seta | Raio igual ao do botão | Produto técnico, financeiro |
| **Quina viva** | Raio 0 a 4 px, borda de 1 px | Raio 0, borda marcada | Editorial, moda, arquitetura |
| **Elevado** | Sombra forte, sem borda | Sombra em camadas | Produto de consumo |
| **Contornado** | Fundo transparente, borda de 1,5 px | Borda, sem sombra | Minimalista, escuro técnico |

A assinatura precisa aparecer em botão, cartão, campo, selo e painel. Raio de botão e raio de cartão na mesma família, nunca pílula no botão com quina viva no cartão.

O exemplo detalhado abaixo usa a assinatura **pílula**. Ao escolher outra, mantenha a estrutura e troque raio, borda e presença da seta.

### 5.1 Botão

Exemplo com a assinatura pílula: rótulo à esquerda e seta dentro de um círculo à direita. A seta fica girada em repouso e volta ao normal no hover.

```css
.btn{display:inline-flex;align-items:center;gap:12px;height:52px;padding:0 6px 0 22px;
     border-radius:999px;font:500 1rem/1 var(--f-body);white-space:nowrap;
     transition:background-color .25s var(--ease),transform .25s var(--ease)}
.btn .arr{width:40px;height:40px;border-radius:50%;display:inline-flex;
          align-items:center;justify-content:center;transition:transform .35s var(--ease)}
.btn .arr svg{width:17px;height:17px;transform:rotate(-45deg);transition:transform .35s var(--ease)}
.btn:hover .arr svg{transform:rotate(0)}
.btn:active{transform:scale(.97)}

.btn-primary{background:var(--action);color:var(--on-action);
             box-shadow:0 10px 24px -12px color-mix(in srgb,var(--action) 70%,transparent)}
.btn-primary .arr{background:var(--on-action);color:var(--action)}
```

**Regras, válidas em qualquer assinatura:** altura mínima de 44 px (24 px é o mínimo da norma, 44 é o padrão prático no celular). Uma ação primária por tela. A cor de ação é exclusiva de elemento clicável. Micromovimento no clique.

**A seta que gira é um exemplo de microassinatura, não uma obrigação.** Alternativas com o mesmo efeito: ícone que desliza para a direita, fundo que preenche de um lado ao outro, borda que acende, rótulo que troca por um mais curto. Escolha uma e repita na página inteira.

### 5.2 Rótulo de seção

Texto curto em caixa alta, 12 px, sobre fundo cinza translúcido, raio 7 px. **Sem linha antes, sem traço, sem ícone.**

```css
.label{display:inline-flex;align-items:center;height:26px;padding:0 9px;border-radius:7px;
       background:color-mix(in srgb,var(--ink) 6%,transparent);font:500 .75rem/1 var(--f-body);
       letter-spacing:.06em;text-transform:uppercase;color:color-mix(in srgb,var(--ink) 68%,transparent)}
```

A linha horizontal antes do rótulo lê como travessão e é marca de slop.

**Alternativas ao rótulo com fundo:** texto em caixa alta com a cor de ação e sem fundo; número da seção em fonte monoespaçada; ponto colorido seguido do texto. Escolha uma e repita.

### 5.3 Título com destaque

```html
<h2 class="t-h2">Texto do título com <span class="em glow">trecho em destaque.</span></h2>
```

```css
.em{font-family:var(--f-serif);font-style:italic;font-weight:400;
    color:var(--action);position:relative;isolation:isolate;white-space:nowrap}
/* brilho de linhas verticais atrás do destaque */
.glow::before{content:"";position:absolute;inset:-34% -6% -30%;z-index:-1;
  background:repeating-linear-gradient(90deg,color-mix(in srgb,var(--accent) 32%,transparent) 0 1px,transparent 1px 5px);
  -webkit-mask:radial-gradient(closest-side,#000 25%,transparent);
  mask:radial-gradient(closest-side,#000 25%,transparent);pointer-events:none}
```

### 5.4 Painel de seção

Duas variantes, clara e escura, alternadas ao longo da página. A alternância dá o ritmo vertical e substitui separadores horizontais (Gestalt de região comum).

### 5.5 Lista com palco sincronizado

Lista de itens à esquerda, palco que troca de conteúdo à direita. Um item aberto por vez, com barra de progresso que dispara o próximo.

Requisitos: `role="tablist"` com `aria-selected`; setas, Home e End; pausa no hover, no foco e fora da tela; ao clicar, o avanço automático para de vez.

### 5.6 Cartão de problema

Cada cartão carrega uma miniatura de interface real, não um ícone. Mostrar uma mensagem sem resposta comunica mais rápido que um ícone de relógio. Esse é o detalhe que tira a página do território de template.

### 5.7 Formulário

Etapas curtas, barra de progresso, botão de voltar, máscara de entrada, erro ligado ao campo, campo armadilha contra robô.

**A barra de progresso começa preenchida** na etapa 1 (Goal-Gradient: a motivação cresce com a proximidade da meta).

### 5.8 Ícones

Biblioteca própria em `viewBox="0 0 24 24"`, traço de 1,8 px, sem preenchimento. Declare uma vez num SVG oculto e referencie com `<use>`. Para animar o traço individualmente, o script substitui cada `<use>` por cópia em linha (ver 6.4).

Nunca use icon font. Nunca use emoji. Nunca use ícone que represente "tecnologia" de forma abstrata.
