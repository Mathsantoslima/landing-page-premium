> Referência da skill `landing-page-premium`. O processo, os portões e as regras anti-slop estão no `SKILL.md`. A numeração das seções é a mesma em todos os arquivos.

## 9. Diagramas e ilustrações animadas

Metodologia, conceito, passo a passo e arquitetura de produto pedem uma peça que **mostre o mecanismo**. Um bloco de texto explicando "como funciona" é a seção mais pulada de qualquer página; um diagrama que se desenha sozinho e acende a parte certa quando o leitor passa o cursor é a mais lembrada.

Esta seção ensina a construir essa peça a partir da identidade da marca, com geometria calculada, movimento com propósito e acessibilidade real.

### 9.1 Quando um diagrama se justifica

Faça o diagrama quando a resposta for sim às três:

1. A ideia tem **estrutura**: etapas, camadas, partes que se relacionam, algo que entra e sai diferente.
2. O desenho sozinho, sem o texto ao lado, **sugere o mecanismo**.
3. O que o desenho mostra é **verdade sobre o produto**. Desenhar uma arquitetura que você não tem custa a credibilidade inteira no primeiro cliente técnico.

Não faça quando: a ideia é uma lista (use lista), são caixas com o nome dos seus módulos ligadas por setas (isso é organograma, não explicação), ou o diagrama só existe para ocupar o lado direito da tela.

**Teste do dedo:** tape o texto ao lado. Se o desenho sozinho não sugere o que acontece, ele falhou.

### 9.2 O arquétipo vem da topologia da ideia, não da estética

Primeiro descubra a forma da ideia. Tem começo e fim? É linear. Não tem fim? É ciclo. Tem um dono no centro? É eixo com raios. Uma coisa depende da de baixo? São camadas. Só depois escolha o desenho.

| Arquétipo | Comunica | Use quando | Cuidado |
|---|---|---|---|
| **Fluxo linear** | Passo a passo, jornada, ordem | Padrão seguro. Máximo de 5 passos | Acima de 5, agrupe |
| **Ciclo fechado** | Processo que se realimenta, melhoria contínua | A metodologia não termina, ela gira | Não use se existe entrega final clara |
| **Camadas empilhadas** | O que roda em cima do quê, abstração | Mostrar que você é a base ou o topo | Exige que as camadas sejam reais |
| **Eixo com raios** | Um centro que integra muitas pontas | Integrações, "sua operação no meio" | Vira sopa de logos sem explicar nada |
| **Esteira com estágios** | Entra bruto, sai tratado | A transformação é o valor | Precisa de rótulo em cada estágio |
| **Antes e depois** | Reposicionamento contra o caos atual | Mais persuasivo que explicativo; ótimo no topo | Os dois lados precisam ser honestos |
| **Ramificação** | Decisão, condicional, caminhos | Quando o produto escolhe caminhos | Cresce rápido demais |
| **Linha do tempo** | Duração, espera, acompanhamento longo | O tempo é o diferencial | Precisa de unidade clara |
| **Mecanismo encaixado** | Interdependência, peça que move peça | Metodologia em que uma etapa aciona a outra | **Só se as peças encaixarem de verdade**. Ver 9.5 |
| **Circuito** | Roteamento, sinal, infraestrutura | Combina com traço ortogonal e nó quadrado | Estética forte, pode brigar com a marca |
| **Órbita** | Satélites em torno de um núcleo, com vida | Versão animada do eixo com raios | Movimento contínuo cansa se for rápido |
| **Matriz de duas dimensões** | Posicionamento contra alternativas | Comparativo honesto | Vira arrogante se você está sempre no melhor quadrante |
| **Simulação da interface** | Como é de verdade | Vence o diagrama quando o produto tem tela | Dado falso mata a peça. Ver 7 |

**Clichê proibido:** nuvem, foguete, cérebro, robô, engrenagem genérica que não engrena, e a ampulheta. Ver seção 1.

### 9.3 Geometria calculada

Gere a geometria por script quando o número de elementos é variável, a simetria precisa ser exata ou há repetição. Desenhe à mão quando as formas são orgânicas e poucas. O caminho normal é híbrido: o script calcula as coordenadas, você refina terminações e cor.

Trabalhe sempre em um `viewBox` fixo e deixe o SVG escalar. Nada de coordenada em pixel de tela.

**Anel, para ciclo, eixo com raios e órbita.** O primeiro nó às 12 horas:

```js
const anel = (n, R, cx, cy, inicio = -90) =>
  Array.from({ length: n }, (_, i) => {
    const a = (inicio + i * 360 / n) * Math.PI / 180;
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), a };
  });
```

**Arco**, para passo a passo curvo: a mesma conta com abertura menor que 360, distribuída em `n - 1` intervalos.

```js
const arco = (n, R, cx, cy, inicio = -140, abertura = 100) =>
  Array.from({ length: n }, (_, i) => {
    const a = (inicio + i * abertura / (n - 1)) * Math.PI / 180;
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), a };
  });
```

**Espiral**, para processo que escala (espiral de Arquimedes, `r = a + b*t`):

```js
const espiral = (n, cx, cy, a = 10, b = 14, voltas = 2) =>
  Array.from({ length: n }, (_, i) => {
    const t = (i / (n - 1)) * voltas * 2 * Math.PI, r = a + b * t;
    return { x: cx + r * Math.cos(t), y: cy + r * Math.sin(t) };
  });
```

**Projeção isométrica**, para dar corpo sem virar ilustração 3D cara. A projeção é só um achatamento do eixo vertical mais um deslocamento de profundidade:

```js
const ISO = 0.50;                                  // 0.45 a 0.55. Acima disso parece tombado
const proj = (u, v, dz = 0) => [u, v * ISO + dz];  // dz empilha camadas
```

Para grade isométrica de ladrilhos (padrão 2 para 1, com `ALT = LARG / 2`):

```
telaX = (mapaX - mapaY) * (LARG / 2)
telaY = (mapaX + mapaY) * (ALT / 2)
```

Desenhe na ordem crescente de `mapaX + mapaY`, senão as peças se sobrepõem na ordem errada. Camadas empilhadas são o mesmo losango deslocado em `y_k = y_0 - k * (espessura + folga)`.

### 9.4 Conexões

**Ancore na borda, nunca no centro.** Seta que nasce dentro do nó é o erro mais comum e o mais visível:

```js
function aresta(a, b, ra, rb, folga = 6) {
  const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy);
  const ux = dx / L, uy = dy / L;
  return { x1: a.x + ux * (ra + folga), y1: a.y + uy * (ra + folga),
           x2: b.x - ux * (rb + folga), y2: b.y - uy * (rb + folga) };
}
```

**Curva com tangente horizontal**, estilo editor de fluxo:

```js
const curva = (a, b, k = 0.5) => {
  const dx = Math.abs(b.x - a.x) * k;
  return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
};
```

**Caminho ortogonal com canto arredondado**, estilo circuito:

```js
function orto(a, b, r = 8) {
  const mx = (a.x + b.x) / 2;
  const sy = Math.sign(b.y - a.y) || 1;
  const sx = Math.sign(b.x - a.x) || 1;
  return `M ${a.x} ${a.y} H ${mx - r * sx} Q ${mx} ${a.y} ${mx} ${a.y + r * sy}
          V ${b.y - r * sy} Q ${mx} ${b.y} ${mx + r * sx} ${b.y} H ${b.x}`;
}
```

Se duas arestas se cruzam sem relação, reordene os nós. Se não der, use o saltinho sobre o cruzamento. Seta bidirecional só quando o fluxo é mesmo nos dois sentidos.

### 9.5 Peças que encaixam de verdade

Se o arquétipo é mecanismo, as peças precisam engrenar de verdade. Dente que atravessa dente é o maior sinal de amadorismo em uma página, e todo mundo percebe mesmo sem saber explicar.

Duas engrenagens só engrenam com o mesmo módulo `m`. Com `z` dentes:

```
raio primitivo     r  = m * z / 2
distância de eixo  d  = r1 + r2
razão de rotação   w2 = -w1 * (z1 / z2)      sinal negativo: gira ao contrário
raio de cabeça     ra = r + m
raio de pé         rf = r - 1.25 * m
passo angular      D  = 2 * PI / z
```

A fase importa tanto quanto o raio. A peça vizinha entra **meio dente defasada** em relação à linha que liga os dois centros:

```python
import math
PASSO = 2 * math.pi / N          # N = número de dentes
fases = [ANG]                     # ANG = fase da primeira peça, em radianos
for i in range(QTD - 1):
    e = (fases[i] - ANG) % PASSO
    if e > PASSO / 2:
        e -= PASSO
    fases.append(ANG + math.pi - e + PASSO / 2)
```

Animação sincronizada, sem JavaScript. O período é inversamente proporcional ao número de dentes:

```css
:root { --giro: 14s; }
.peca-a { animation: girar     var(--giro) linear infinite; }
.peca-b { animation: girar-inv calc(var(--giro) * var(--zB) / var(--zA)) linear infinite; }
@keyframes girar     { to { transform: rotate(360deg); } }
@keyframes girar-inv { to { transform: rotate(-360deg); } }
.peca-a, .peca-b { transform-box: fill-box; transform-origin: center; }
```

**`transform-box: fill-box` não é opcional.** Sem ele a peça orbita o canto do SVG em vez de girar no próprio eixo. Vale para qualquer parte que gira, pulsa ou escala.

A mesma lógica serve para peças de encaixe que não são engrenagens: gere a borda **uma vez** e reutilize espelhada (`scale(-1,1)`). Se cada peça desenhar a própria borda, elas nunca fecham.

### 9.6 Movimento do diagrama

| Técnica | Como | Duração |
|---|---|---|
| Traço que se desenha | `stroke-dasharray: L; stroke-dashoffset: L -> 0`, com `L = path.getTotalLength()` | 600 a 1200 ms, saída suave, escalonamento de 80 a 180 ms entre caminhos |
| Pulso percorrendo o caminho | `offset-path: path(...)` com `offset-distance: 0% -> 100%`, ou `animateMotion` com `mpath` | 1,2 a 2,4 s, linear, contínuo, atraso aleatório por partícula |
| Nós acendendo em sequência | `animation-delay: calc(var(--i) * 140ms)` | aparecer em 240 a 360 ms |
| Rotação contínua | Ver 9.5 | 8 a 20 s por volta. Abaixo de 6 s distrai |
| Revelação por rolagem | `IntersectionObserver` com limiar de 0,35 trocando uma classe | 400 a 800 ms |
| Destaque sincronizado | Ver 9.7 | 150 a 200 ms. Precisa ser quase instantâneo |

Normalize o caminho com `pathLength="1"` quando quiser controlar o traço sem medir, e use a mesma curva de aceleração do resto da página (ver seção 6).

```js
document.querySelectorAll('.desenha').forEach((p, i) => {
  const L = p.getTotalLength();
  p.style.strokeDasharray = L;
  p.style.strokeDashoffset = L;
  p.style.animation = `desenhar 800ms var(--ease) ${i * 140}ms forwards`;
});
```

```css
@keyframes desenhar { to { stroke-dashoffset: 0; } }
```

Regra de ouro das duas velocidades: **movimento ambiente** (o que roda sozinho) é lento e de amplitude baixa, ciclo de 8 s ou mais; **movimento explicativo** dispara quando a seção entra na tela, acontece uma vez e **termina**. Laço rápido no campo de visão enquanto a pessoa lê o título é o defeito mais comum.

Obrigatório, sem exceção:

```css
@media (prefers-reduced-motion: reduce) {
  .diagrama *, .diagrama *::before { animation: none !important; transition: none !important; }
  .diagrama .particula { display: none; }
}
```

O estado parado precisa ser o estado **completo e legível**, não o primeiro quadro.

### 9.7 A conversa entre o texto e o desenho

É o que separa um diagrama bonito de um diagrama que ensina. Três padrões, em ordem de custo:

**A. O passo acende a parte.** Barato e de alto retorno.

```html
<ol class="passos">
  <li><button data-alvo="no-2">2. O pedido entra na fila</button></li>
</ol>
<svg id="d" role="img" aria-labelledby="dT dD"> ... <g id="no-2"> ... </g></svg>
```

```js
const svg = document.getElementById('d');
document.querySelectorAll('.passos button').forEach(b => {
  const alvo = svg.querySelector('#' + b.dataset.alvo);
  const liga = () => alvo.classList.add('ativo');
  const desliga = () => alvo.classList.remove('ativo');
  b.addEventListener('mouseenter', liga);  b.addEventListener('focus', liga);
  b.addEventListener('mouseleave', desliga); b.addEventListener('blur', desliga);
});
```

Use `<button>` e trate `focus`, não um `<li>` com `mouseenter`: senão a interação simplesmente não existe no teclado. A relação é bidirecional: passar o cursor no nó também acende o texto. E no toque, o primeiro passo já começa ativo.

**B. A rolagem avança o diagrama.** Texto em coluna que rola, desenho com `position: sticky; top: 15vh`. Cada bloco de texto é observado e escreve `data-passo` no SVG; o CSS faz o resto. Nunca anime geometria dentro do tratador de rolagem: troque classes.

**C. Abas trocam a vista.** `role="tablist"`, `aria-selected`, setas do teclado. Mais barato de manter que B e melhor no celular.

Em qualquer um dos três: o destaque **nunca é só de cor**. Mude também a espessura do traço ou a opacidade do resto.

### 9.8 Derivar o desenho da identidade da marca

Esta é a diferença entre um diagrama que parece ter saído de uma ferramenta de fluxograma e um que pertence àquela marca. Antes de desenhar, monte este bloco a partir do material coletado no portão 1:

1. **Espessura do traço** vem do peso da tipografia e do logotipo. Tipografia leve pede traço de 1 a 1,25; tipografia pesada ou condensada pede 2 a 3. Use **no máximo duas espessuras**, estrutura e detalhe, na razão de 1 para 2.
2. **Terminação e junção.** `round` lê como humano e próximo; `butt` com `miter` lê como técnico e preciso. Siga a mesma lógica do raio dos botões: raio grande pede terminação arredondada.
3. **Ângulo.** Se a marca tem um ângulo (um corte diagonal, um itálico, uma seta), use **esse mesmo ângulo** em todas as diagonais do desenho. Ângulo arbitrário é o que mais entrega "genérico".
4. **Cor.** Estrutura em neutro, em 90% do desenho. **Uma** cor de marca para o caminho ativo. No máximo uma secundária para erro ou para o estado "antes". Nunca colorir todos os nós.
5. **Raio dos nós:** o mesmo raio dos cartões e campos do sistema, ou círculo puro. Não invente um terceiro valor.
6. **Grade.** Distâncias múltiplas do espaço base. Nós a 96 ou 128, folga de ancoragem de 6 a 8.
7. **Tipografia dentro do desenho:** mesma família, um único tamanho, peso médio, entreletra levemente aberta. Caixa igual à da marca.
8. **Textura.** Se a marca tem grão, hachura, meio-tom ou traço desenhado à mão, leve isso para o diagrama com `<pattern>`. É o que separa o desenho da marca do desenho de ferramenta. Ver seção 7.
9. **Tema.** Todo `fill` e `stroke` sai de `currentColor` ou de variável. Nunca `stroke="#000"`.

### 9.9 Acessibilidade do diagrama

O padrão mais robusto entre leitores de tela:

```html
<svg role="img" aria-labelledby="dT dD" viewBox="0 0 640 360">
  <title id="dT">Como um pedido vira atendimento concluído</title>
  <desc id="dD">Quatro etapas ligadas por setas: o pedido chega, entra na fila,
  é executado com repetição automática em caso de falha, e termina com o
  resultado registrado.</desc>
</svg>
```

- `role="img"` vai **no `<svg>`**, nunca em um `<g>` interno.
- `role="img"` faz o leitor tratar o conteúdo como opaco, então **todo texto dentro do SVG precisa existir também fora dele ou na descrição**.
- **A informação não pode existir só no desenho.** O padrão forte é lista ordenada em HTML de verdade ao lado, e o SVG como reforço visual. Fica acessível, indexável e continua funcionando se o SVG falhar.
- Diagrama com mais de 6 nós ganha descrição longa estruturada, visível para todo mundo em `<details>`.
- Parte decorativa recebe `aria-hidden="true"` e `focusable="false"`.
- O traço é componente de interface: **mínimo de 3:1** contra o fundo (WCAG 1.4.11). Traço cinza-claro de 1 px sobre branco reprova.
- Parte clicável é `<button>` de verdade, com nome acessível, alvo de 24 px e foco visível.
- Animação que se repete por mais de 5 segundos precisa de controle de pausa (WCAG 2.2.2), ou precisa terminar, ou precisa respeitar o `prefers-reduced-motion`. Um par de botões "Reproduzir" e "Recomeçar" resolve e ainda melhora a peça.
- Texto dentro do SVG em unidade que escala, para sobreviver ao zoom de 200% (WCAG 1.4.4).

### 9.10 No celular

Diagrama horizontal de 5 colunas vira 5 tiras ilegíveis. Nunca resolva com `transform: scale()` no conjunto.

Resolva com uma destas três, nesta ordem de preferência:

1. **Outro arranjo:** uma media query troca o `viewBox` e reempilha os nós na vertical. O script que gerou a geometria gera as duas versões.
2. **Rolagem horizontal com indicador explícito**, quando a sequência precisa ser lida em linha.
3. **Troca por lista**, quando o desenho não sobrevive à largura. A lista ordenada já existe por acessibilidade (ver 9.9), então é só mostrá-la.

### 9.11 Ferramentas e quando valem

| Ferramenta | Quando vale |
|---|---|
| SVG embutido com CSS | O padrão para 80% dos casos. Leve, animável, acessível, respeita tema |
| Script gerador (Node ou Python) que cospe o SVG | Geometria repetitiva, simetria exata, número de elementos variável |
| Biblioteca de animação | Linha do tempo longa, sincronia fina, narrativa por rolagem complexa. Dispensável para 3 nós acendendo |
| Biblioteca de visualização de dados | Só quando o desenho vem de **dados**. Para diagrama fixo é peso morto |
| Estética de traço à mão | Marca informal ou editorial. Dá personalidade sem abrir mão do script |
| Animação exportada de ferramenta de vídeo | Só com motion designer no time. Arquivo grande, difícil de tematizar e de sincronizar com o cursor |
| Vídeo | Último recurso. Não escala, não tematiza, não interage |
| Canvas ou WebGL | Acima de uns 2000 elementos, ou globo e partículas |
| Ferramenta de fluxograma automático | **Nunca em landing page.** Tipografia e espaçamento genéricos entregam na hora |

Regra rápida: menos de 40 elementos, desenhe à mão; geometria repetitiva, gere por script; dados variáveis, biblioteca de visualização; acima de 2000 elementos, Canvas.

Exporte de ferramenta de design apenas o rascunho da forma, e **reescreva o SVG à mão**: a saída vem com identificadores automáticos, transformações aninhadas e grupos inúteis que ninguém consegue manter seis meses depois.

### 9.12 Erros comuns de diagrama

| Erro | Sintoma | Correção |
|---|---|---|
| Diagrama que não explica | Caixas com o nome dos seus módulos | Desenhe o mecanismo, não o organograma |
| Nós demais | Acima de 7 ninguém lê | Agrupe ou faça dois diagramas |
| Movimento que distrai | Laço rápido perto do título | Ambiente lento, explicativo que termina |
| Quebra no celular | Cinco colunas de 60 px | Ver 9.10 |
| Falta legenda | Cor que significa algo sem dizer o quê | Legenda ou rótulo direto |
| Metáfora errada | Funil para o que não perde ninguém; ciclo para o que acaba | Volte a 9.2 |
| Seta ambígua | Nasce no centro, cruza sem salto | Ver 9.4 |
| Âncora errada | A peça orbita em vez de girar | `transform-box: fill-box` |
| Ignora o tema escuro | Cor fixa no atributo | Variável ou `currentColor` |
| Impossível de manter | SVG exportado, sem identificador legível | Nós e arestas com `id` e `data-*` com nome |
| Mente sobre o produto | Arquitetura que não existe | Desenhe o que você tem |
