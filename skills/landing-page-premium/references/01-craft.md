> Referência da skill `landing-page-premium`. O processo, os portões e as regras anti-slop estão no `SKILL.md`. A numeração das seções é a mesma em todos os arquivos.

## 2. Craft: o que buscar

A seção 1 diz o que evitar. Esta diz o que perseguir.

Craft é a atenção deliberada em fazer bem feito, mesmo quando ninguém vai conferir. Não é enfeite nem quantidade de efeito. É o conjunto de decisões pequenas que, somadas, fazem a página parecer uma extensão natural de quem usa, em vez de um obstáculo.

O problema do termo é que ele costuma virar adjetivo vago. Esta seção transforma craft em lista verificável.

### 2.1 A régua: sete eixos

Audite nestes sete eixos. Cada item é binário, passa ou não passa.

| Eixo | Pergunta central |
|---|---|
| Estados | Todo componente tem todos os estados? |
| Geometria | Alinhamento e raio estão opticamente corretos? |
| Tipografia | O texto quebra bem em qualquer largura? |
| Movimento | A animação é rápida, interrompível e proposital? |
| Conteúdo | Vazio, pouco, muito e erro foram desenhados? |
| Acessibilidade | Funciona por teclado, com contraste medido? |
| Engenharia | Carrega sem salto, sem erro e sem espera visível? |

### 2.2 Estados de componente

Um componente sem todos os estados é trabalho pela metade. Monte a tabela antes de implementar.

Estados obrigatórios: repouso, hover, foco, pressionado, desabilitado, carregando, selecionado e erro, quando o componente admitir cada um.

| Regra | Detalhe |
|---|---|
| Foco só por teclado | Use `:focus-visible`, nunca remova o contorno sem substituto |
| Foco com raio | Com borda arredondada, prefira `box-shadow` a `outline` |
| Hover só onde há ponteiro | Envolva em `@media (hover: hover)`, senão o estado pisca no toque |
| Botão desabilitado não recebe dica | Ele sai da ordem de tabulação e a dica nunca é anunciada |
| Carregando mantém o rótulo | Acrescente o indicador, não troque o texto, para não saltar o layout |
| Envio bloqueia o botão | Evita requisição duplicada no clique duplo |
| Sem zona morta | Em lista, aumente o `padding` do item em vez da margem entre itens |

### 2.3 Geometria e alinhamento

| Detalhe | O que fazer | Como verificar |
|---|---|---|
| **Alinhamento óptico** | Formas irregulares, como seta ou triângulo de play, precisam de 1 a 2 px de correção para parecerem centradas | Troque o ícone por um quadrado. Se o quadrado parece centrado e o original não, falta correção |
| **Raio aninhado** | `raio interno = raio externo menos o padding`. Usar o mesmo raio dentro e fora é o erro mais comum | `--interno: calc(var(--externo) - var(--padding))` |
| **Peso visual** | Ícones de áreas diferentes precisam de tamanhos diferentes para pesarem igual | Desfoque a tela em 8 px e veja se algo salta |
| **Linha de 1 px** | Em tela de alta densidade, 1 px fixo engrossa | Verifique em densidade 1 e 2 |
| **Posição inteira** | Elemento em posição fracionária fica borrado | Zoom de 400% e procure borda acinzentada |

### 2.4 Tipografia de detalhe

| Detalhe | Regra |
|---|---|
| Quebra de título | `text-wrap: balance` em título, subtítulo e legenda |
| Quebra de parágrafo | `text-wrap: pretty` em bloco longo, para evitar palavra sozinha na última linha |
| Viúva e órfã | São defeito, não gosto. Palavra sozinha no fim de um título reprova |
| Números que mudam | `font-variant-numeric: tabular-nums` em contador, preço, tabela e cronômetro |
| Reticência | Um caractere só, nunca três pontos |
| Peso no hover | O peso da fonte não muda no hover nem no estado ativo, porque desloca o layout |
| Campo no celular | Mínimo de 16 px, senão o sistema aplica zoom ao focar |
| Caixa alta | Precisa de espaçamento positivo entre letras, de 2 a 8% |
| Título grande | Precisa de espaçamento negativo |

### 2.5 Craft em movimento

Sete critérios. Uma animação precisa passar nos sete.

| Critério | Regra prática |
|---|---|
| **Natural** | Nada aparece nem some instantaneamente |
| **Rápida** | Abaixo de 300 ms na maioria dos casos. Para resposta a clique, abaixo de 200 ms |
| **Proposital** | Pergunte quantas vezes a pessoa verá aquilo. Ação repetida muitas vezes por dia não se anima |
| **Performática** | Só `transform` e `opacity`. Nunca `transition: all` |
| **Interrompível** | Use `transition`, não `keyframes`, em estado que o usuário pode reverter no meio |
| **Acessível** | Movimento reduzido tem variante, não ausência silenciosa |
| **Certa no corpo** | Revise no dia seguinte, com olhos descansados |

**Valor proporcional ao gatilho.** Caixa de diálogo entra de 0,96 para 1, não de 0 para 1. Botão pressionado vai a 0,97, não a 0,8. Exagero de escala é marca de amadorismo.

**A origem importa.** O elemento precisa crescer de onde ele viria fisicamente. Em SVG, use `transform-box: fill-box`, senão a rotação gira em torno do canto do canvas.

**Pause o que está fora da tela.** Animação em laço fora da viewport gasta processamento à toa.

### 2.6 Estados de conteúdo

Desenhe quatro estados para todo bloco que recebe dado: vazio, pouco, muito e erro.

| Estado | Regra |
|---|---|
| Vazio | Nunca só "nenhum resultado". Ofereça o próximo passo |
| Pouco | Um item só não pode parecer defeito |
| Muito | Texto longo trunca com `min-width: 0` no filho do flex. Teste com conteúdo absurdo |
| Erro | Diz a causa e o caminho, e não perde o que a pessoa digitou |
| Carregando | O esqueleto tem o layout final, senão há salto quando o conteúdo chega |

### 2.7 Detalhes que quase ninguém nota

Estes separam trabalho artesanal de trabalho apressado.

- Seleção de texto estilizada com `::selection`, na cor da marca.
- Elemento decorativo com `pointer-events: none`, senão ele rouba o clique.
- Clicar no rótulo foca o campo, e o ícone dentro do campo também.
- Campo dentro de `<form>`, para Enter enviar.
- `inputmode` e `autocomplete` corretos em todo campo.
- Validar depois de sair do campo, nunca a cada tecla.
- Permitir enviar incompleto, para o erro aparecer, e mover o foco para o primeiro erro.
- Nunca bloquear a colagem.
- Confirmação junto ao gatilho, como um sinal de certo dentro do próprio botão copiar, em vez de aviso no canto da tela.
- Ícone com `prefers-color-scheme` no próprio SVG.
- Ao trocar o tema, desligue as transições por um instante, senão a página inteira anima junto.
- `scroll-margin-top` nos títulos, para o cabeçalho fixo não cobrir a âncora.
- Imagem sempre em `<img>`, nunca como fundo, para leitor de tela e para o menu de copiar imagem.
- Espaço não separável entre número e unidade.
- Setas navegam listas, e Esc fecha o que estiver aberto.

### 2.8 Craft invisível

Sustenta a percepção de qualidade sem aparecer.

- Zero salto de layout: dimensão explícita em toda imagem, esqueleto com o layout final, fonte com `font-display: swap`.
- Tema aplicado antes da primeira pintura, sem piscar.
- Preparar o carregamento do que está na primeira dobra e adiar o resto.
- Nenhum erro no console.
- Seleção e cópia funcionando, inclusive em título animado.
- Imagem de compartilhamento e ícone do site completos. A página é o ativo mais compartilhado do produto.

### 2.9 Craft específico de landing page

| Ponto | Regra |
|---|---|
| Topo | Recebe todo o orçamento de carregamento. Salto de layout aqui é fatal, porque é onde o olho está |
| Consistência entre seções | Mesmo ritmo vertical, mesma largura, mesma escala. Páginas quebram porque cada seção foi feita num momento diferente |
| Fronteira claro e escuro | Sombra, borda e foco precisam de valor por superfície. Sombra com matiz do fundo, nunca cinza |
| Composição complexa | Teste também em tela muito larga, com zoom de 50% |
| Ação fixa no celular | Só aparece depois que a ação principal sai da tela, respeita a área segura e não cobre o conteúdo final |
| Entrada por rolagem | É o maior vetor de exagero. Toda seção com a mesma entrada longa é sintoma |

### 2.10 Onde craft vira exagero

A linha é simples: **o detalhe reduz esforço, dúvida ou erro de quem usa, ou torna o estado mais legível?** Se sim, é craft. Se ele só chama atenção para si mesmo, e o custo em tempo, quadros e carga cognitiva recai sobre quem usa, é exagero.

Sinais de exagero:

- Animar ação que a pessoa repete dezenas de vezes por dia.
- Entrada longa em toda seção.
- Movimento automático sem controle de pausa.
- Efeito que atrasa o acesso ao conteúdo.
- `will-change` aplicado de forma preventiva, que pode piorar o desempenho.

Teste do dia seguinte: o que pareceu ótimo na hora costuma parecer lento 48 horas depois. Revise com olhos descansados e remova o que atrasa.

### 2.11 Vocabulário

Use os termos corretos ao descrever decisões.

| Termo | Significado |
|---|---|
| Correção óptica | Deslocar alguns pixels para que pareça centrado |
| Raio aninhado | Raio interno igual ao externo menos o padding |
| Overshoot | Animação que passa do alvo e volta |
| Mola | Animação por rigidez e amortecimento, em vez de duração e curva |
| Interrompibilidade | Capacidade de mudar de alvo no meio da animação |
| Origem da transformação | Ponto de onde escala e rotação partem |
| Scrub | Animação atrelada a um valor contínuo, como a rolagem |
| Coreografia | Relação temporal entre elementos que se movem juntos |
| Véu | Camada translúcida sobre imagem para garantir contraste do texto |
| Sangria | Elemento que vai até a borda da tela |
| Fio de cabelo | Linha da menor espessura perceptível |
| Elevação | Hierarquia de profundidade por sombra |
| Faixas | Degraus visíveis num gradiente |
| Área segura | Margem reservada para entalhe e barra inferior |
| Zona morta | Espaço entre itens que não responde ao clique |
| Propriedades de composição | `transform` e `opacity`, animáveis sem recalcular layout |

### 2.12 Noventa por cento familiar, dez por cento novo

Emprestando a regra de proporção do cinema: **cerca de 90% da experiência deve ser familiar e cerca de 10% nova**. Novidade funciona como ponto de exclamação, e como tempero você não quer demais. Quem lê não vai formular essa pergunta, mas vai **sentir a resposta** e decidir a partir dela sem perceber.

Os 10% vão para **o que acontece uma vez**: a primeira tela, a primeira rolagem, o primeiro momento em que a pessoa entende o produto. Novidade bate forte ali justamente porque a maioria das páginas não é assim. Em tudo que se repete, a convenção vence.

**O diagnóstico que esta skill existe para evitar.** O defeito mais comum de 2026 não é página feia, é **página polida que se desmancha no uso**: parece ambiciosa e impressionante à primeira vista, e começa a cair aos pedaços no momento em que alguém de verdade tenta usá-la. A forma está lá. O encaixe não. A parte difícil do design raramente é gerar a forma: é entender o problema bem o bastante para saber **o que** deveria existir e **como**. Confundir forma gerada com problema resolvido é o erro central.

O teste que separa um do outro: **quase toda decisão de gosto tem uma razão lógica se você olhar de perto o suficiente**. Dê um passo atrás, pergunte por que tomou aquela decisão, articule em voz alta por que tem que ser assim, transforme em regra, e seja estrito com a regra. O que não é arbitrário tem intenção autoral e sinal de iteração percebido ao longo de tudo, em vez de excesso aparentemente aleatório em nome da ousadia.

Três consequências práticas:

- **Gosto é julgamento construído sob restrição, não preferência.** Não se atalha com mais ferramenta. Ao calibrar o seu, não rotule as coisas como boas ou ruins: force-se a explicar **por que** algo parece ótimo.
- **Gosto é exercido dentro do trabalho, não curado no fim.** Os detalhes em que você escolhe investir e os acordos que você se recusa a fazer são o gosto.
- **Entregue qualidade mínima viável, não produto mínimo viável.** Resolva o problema de forma completa, com refinamento suficiente para a pessoa usar bem e construir confiança. É fácil demais entregar algo que é só "bom o bastante": são as microdecisões de todo dia que deixam o trabalho medíocre, devagar e com certeza.
