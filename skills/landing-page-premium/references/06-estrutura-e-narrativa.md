> Referência da skill `landing-page-premium`. O processo, os portões e as regras anti-slop estão no `SKILL.md`. A numeração das seções é a mesma em todos os arquivos.

## 8. Estrutura e narrativa

### 8.1 A pergunta antes do formato

Nenhuma seção existe por ser bonita. Cada seção responde a uma pergunta que a seção anterior levantou, e o **formato é escolhido pelo conteúdo**, nunca o contrário.

A ordem de trabalho é sempre esta:

1. Escreva a pergunta que a seção responde.
2. Liste o que você tem para responder: um número, três etapas, cinco recursos, uma citação, um trecho de código, uma tela.
3. **Só então** escolha o formato no catálogo de 8.4 e 8.5.

Se você escolheu o formato primeiro e depois procurou o que colocar dentro, a seção vai nascer vazia, e nenhum acabamento salva uma seção vazia.

| # | Seção | Pergunta que responde |
|---|---|---|
| 1 | Topo | O que é isto e serve para mim? |
| 2 | Prova rápida | Posso confiar? |
| 3 | Problema | Isto é mesmo um problema meu? |
| 4 | Solução | O que exatamente vocês fazem? |
| 5 | Método | Como funciona por dentro? |
| 6 | Medição ou calculadora | Quanto vale para mim? |
| 7 | Processo | O que acontece se eu disser sim? |
| 8 | Produto | Como é na prática? |
| 9 | Públicos | Serve para o meu papel? |
| 10 | Prova | Funciona mesmo? |
| 11 | Qualificação | Isto é para mim ou não? |
| 12 | Conversão | O que faço agora? |
| 13 | Objeções | E aquela dúvida que ficou? |

Nem toda página precisa das 13. A ordem importa mais que a quantidade.

### 8.2 O esqueleto que o mercado consolidou

Levantamento de 24 páginas de produtos de software de referência (infraestrutura, ferramentas para desenvolvedor, finanças, atendimento, design) em outubro de 2026. Vinte delas seguem a mesma espinha:

```
Nav (+ faixa de anúncio)
  -> TOPO
  -> prova imediata (logos ou número)
  -> 3 a 5 blocos de produto, alternando formato
  -> prova quantitativa (métricas ou caso com número)
  -> prova humana (depoimento ou mural)
  -> ecossistema (integrações, frameworks, parceiros)
  -> confiança (compliance, segurança, garantias)
  -> conversão final, repetindo o topo
  -> rodapé grande
```

Números do levantamento, úteis como calibragem:

- **7 a 16 seções de corpo, mediana de 10 a 11.** Produto técnico e denso puxa para 14 a 16; produto vendido para executivo fica em 7 a 10.
- **A prova vem em segundo lugar em 20 de 24.** A exceção troca logos por um número verificável.
- **A conversão final repete literalmente o topo em 18 de 24:** o mesmo par de botões, às vezes o mesmo componente.
- **Nenhuma página usa o mesmo molde duas vezes seguidas.** A sequência alterna palco grande, grade, palco grande, lista. Quando precisa repetir o molde, muda o eixo: outro número de abas, outro sentido de leitura.
- **Perguntas frequentes, tabela de planos e comparação com concorrente nominal saem da home** e viram página própria, com raras exceções em que o bloco de perguntas existe como peça de busca orgânica.

### 8.3 Regras de combinação

- **Alternância obrigatória.** Duas grades seguidas achatam a página. Depois de uma grade, venha com um palco: uma peça grande, um depoimento isolado, um diagrama.
- **Um bloco invertido por página, no máximo.** A seção de fundo escuro no meio de uma página clara (ou o contrário) marca o clímax, em geral a prova quantitativa. Alternar claro e escuro em xadrez destrói o efeito e cansa.
- **Um par de ações do começo ao fim.** Primário sólido mais secundário fantasma, idênticos na navegação, no topo e na conversão final. Seis ações diferentes competindo é sintoma de página sem decisão tomada.
- **Densidade alta, texto curto.** Seção forte tem título de 5 a 9 palavras, subtítulo de uma frase, um link, e o resto é produto. Parágrafo de quatro linhas dentro de bloco de recurso não aparece em nenhuma das 24 páginas levantadas.
- **Ritmo vertical.** Espaço entre seções maior que o maior espaço interno de qualquer uma delas, sempre (Gestalt, proximidade). Ver 4.4.

### 8.4 Catálogo de topos

Escolha pelo que você tem para mostrar, não pelo que parece moderno.

| # | Padrão | Composição | Use quando | Não use quando |
|---|---|---|---|---|
| **H1** | Centrado clássico | Selo de anúncio, título em 2 linhas, subtítulo de 1 frase, par de ações, imagem larga logo abaixo | A categoria já é conhecida e a tela prova o valor | O valor está no comportamento, e a tela parada não explica nada |
| **H2** | Demonstração embutida | Texto ao lado ou acima de uma réplica da interface que troca de estado sozinha | O valor é o fluxo em movimento e precisa ser visto em 5 segundos | Não há como manter a réplica em dia com o produto real |
| **H3** | Dividido com código | Esquerda: sobrelinha, título, parágrafo e comando copiável. Direita: trecho real de 15 a 25 linhas | O público é inteiramente técnico e a prova é o tamanho do código | Quem decide a compra é financeiro ou operação |
| **H4** | Vídeo curto em laço | Título curto, uma ação, vídeo mudo de 8 a 20 segundos com imagem de pôster | Produto visual ou conceito novo, com orçamento real de produção | Vídeo amador: derruba a página inteira |
| **H5** | Tipográfico puro | Título longo com ênfase gráfica, par de ações, fundo abstrato. Sem produto | Plataforma ampla demais para caber em uma tela; o posicionamento é a mensagem | Produto desconhecido, que ainda precisa provar que existe |
| **H6** | Com formulário embutido | Título, subtítulo, campo único, botão e microtexto de risco | A métrica é geração de contato e a venda é consultiva | Produto de autosserviço: o campo vira atrito inútil |
| **H7** | Com seletor de entrada | Caixa de ação com 2 a 4 abas representando caminhos distintos de começar | Há mais de um jeito de começar e o caminho muda por perfil | Existe um só caminho: as abas viram ruído |
| **H8** | Com abas de público | Título, subtítulo e abas que trocam o conjunto de imagens por segmento | Produto horizontal vendido para 3 ou 4 segmentos distintos | Menos de 3 segmentos reais: use blocos alternados |
| **H9** | Com número ao vivo | Faixa com uma métrica que corre (volume processado, execuções, atendimentos hoje) | A escala é o diferencial e o número é verificável | O número é pequeno ou está parado |
| **H10** | De instalação | Título, subtítulo, um botão único, linha de requisito e dois links terciários | Aplicativo de mesa ou linha de comando: a conversão é o binário | Produto web, onde não existe download |

### 8.5 Catálogo de seções de corpo

| # | Formato | Estrutura | Comunica melhor |
|---|---|---|---|
| **S1** | Faixa de logos | Uma linha de texto, 8 a 30 logos monocromáticos, alguns clicáveis para o caso | Legitimidade imediata, sem argumento |
| **S2** | Bento grid | 5 a 7 células desiguais, cada uma com título, uma linha e **mini-interface funcional** (ver 8.9) | Dizer "a plataforma faz N coisas" sem abrir N seções |
| **S3** | Abas com tela de produto | Título, 2 a 5 abas rotuladas; cada aba troca imagem, subtítulo e link | Comparar modos do mesmo produto no mesmo espaço |
| **S4** | Palco fixo com lista rolante | Mídia fixa de um lado; 3 a 5 painéis de texto avançam com a rolagem e trocam a mídia | Narrativa em etapas em que o visual evolui |
| **S5** | Antes e depois | Duas peças lado a lado rotuladas, o emaranhado contra a solução | Tornar a dor visível em um segundo |
| **S6** | Tabela comparativa | Colunas por opção, linhas agrupadas, selo de estado por coluna | Comparar **modos de entrega** do próprio produto. Concorrente nominal vai para página própria |
| **S7** | Passo a passo numerado | 3 blocos 01, 02, 03 com título, parágrafo e peça visual por passo | "Como funciona" e tempo até o primeiro resultado |
| **S8** | Dividido alternado | Texto de um lado, mídia do outro, invertendo a cada bloco | 2 a 4 recursos que merecem respiro sem virar grade |
| **S9** | Grade de recursos com ícone | 6 a 9 cartões: ícone, título, uma linha | Cauda longa de recursos que ninguém vai ler em detalhe |
| **S10** | Grade de números | 4 a 6 cartões: número grande, legenda curta, origem do dado | Trocar adjetivo por dado |
| **S11** | Depoimento em destaque | Logo, citação de 1 a 3 linhas, foto de 48 px, nome, cargo, link para o caso | Autoridade de um nome que o comprador reconhece |
| **S12** | Mural de casos | 6 a 20 cartões em alvenaria ou esteira, com citação, foto, logo e origem | Volume de prova: muita gente, não uma |
| **S13** | Bloco de código copiável | Trecho com seletor de linguagem e botão copiar com estado "Copiado" | Provar simplicidade e que a interface de programação existe |
| **S14** | Diagrama | Esquema rotulado, às vezes animado (ver seção 9) | "Onde isto encaixa no que eu já tenho" |
| **S15** | Grade de integrações | 6 a 20 blocos com logo e nome, cada um levando ao guia | Reduzir medo de migração e mostrar ecossistema |
| **S16** | Bloco invertido | Um único bloco de fundo oposto ao da página, em geral a grade de números | Marcar o clímax. Uma vez por página |
| **S17** | Faixa de confiança | 6 a 9 selos de conformidade, certificação ou garantia, com título | Destravar o comprador que precisa justificar risco |
| **S18** | Perguntas frequentes | 5 a 15 perguntas em acordeão | **Objeção comercial**, não recurso: preço, cancelamento, prazo, comparação |
| **S19** | Conversão final | Título curto e aspiracional, com **os mesmos** botões do topo | Fechar o laço |
| **S20** | Rodapé grande | 4 a 11 colunas, estado do sistema, selos, notas legais numeradas | Navegação de cauda longa e confiança |

### 8.6 Componentes recorrentes

| Componente | Serve para | Anatomia |
|---|---|---|
| Selo de anúncio | Sinalizar que o produto está vivo | Pílula com borda sutil acima do título, clicável, com seta |
| Link com seta | Hierarquia terciária | `Texto →` interno, `Texto ↗` externo. Nunca dentro do botão primário |
| Par fixo de ações | Atender autosserviço e venda consultiva ao mesmo tempo | Sólido mais fantasma, idênticos em navegação, topo e fim |
| Microtexto de risco | Tirar atrito debaixo do botão | Até 6 palavras: "sem cartão", "resposta em 1 dia útil" |
| Navegação flutuante | Permanecer sem pesar | Barra translúcida com desfoque, último item é botão sólido |
| Prova embutida | Validar sem abrir seção | Frase com número dentro do bloco de recurso |
| Esteira de logos | Volume de clientes | Laço em CSS com o conjunto **duplicado no DOM**, logos na cor do texto, desvanecimento nas bordas |
| Avatares empilhados | Humanizar um número | 3 a 5 círculos sobrepostos em -8 px mais a contagem |
| Barra de comando copiável | Converter em um clique | Fundo escuro, prefixo, botão que vira "Copiado" por 2 segundos |
| Contador animado | Dar peso a um número | Dígitos rolando ao entrar no campo de visão. Só com número verificável |
| Seletor de periodicidade | Empurrar o plano anual | **Dentro do cartão**, não global |
| Comparador de planos | Decidir | Cabeçalho fixo com ação por coluna, seletor de plano para colapsar no celular |
| Régua de volume | Precificar por uso | Paradas rotuladas que reescrevem os cartões e movem o selo de recomendado |
| Nota de rodapé numerada | Sustentar afirmação regulada | Sobrescrito no corpo, ancorado em bloco legal no rodapé |
| Selo de estado | Confiança operacional | "Tudo operacional" com bolinha, no rodapé, levando à página de estado |

### 8.7 Topo

Máximo de 5 elementos: título, subtítulo, ação primária, prova de uma linha e visual do produto. Cada elemento extra reduz a taxa de clique do principal.

O título precisa dizer o que é e para quem, em menos de 9 palavras quando possível.

### 8.8 Navegação

4 a 5 itens no máximo, ou nenhum em página de campanha paga. O menu lista decisões, não um índice de tudo.

### 8.9 Bento grid

Use com critério. Funciona quando há **um bloco claramente dominante**; vira ruído quando todas as células têm o mesmo peso.

**Regras de composição:**

- Base de 8 px. Linha de 96 a 104 px de altura, travada com `grid-auto-rows` **ou** `aspect-ratio`, nunca os dois.
- Gap entre metade do raio e o raio inteiro. Raio 24 px pede gap de 12 a 20 px.
- Quantidade por tipo: 4 a 6 células 1×1, 2 a 3 células 2×1, 1 a 2 células 1×2 e **exatamente uma** célula 2×2. Total de 4 a 8 por seção.
- O bloco dominante carrega a informação mais importante, não a que tem mais texto.
- Célula pequena recebe número, ícone ou rótulo curto. Nunca parágrafo.
- Cada célula mostra um **fragmento funcional**, não um ícone decorativo: a regra que o sistema aplica, o campo que ele preenche, o estado que ele devolve.
- No celular vira coluna única, então a ordem do DOM precisa ser a ordem de leitura no celular. Reordene no desktop com `grid-template-areas`.

**Teste:** se você não consegue nomear qual é a célula mais importante, não use bento.

### 8.10 O que separa as melhores das medianas

Estes seis pontos apareceram em todas as páginas fortes do levantamento e em nenhuma das fracas.

1. **Mostram o produto real, não ilustração genérica.** A interface é recriada em HTML e CSS com dados plausíveis e específicos do domínio. Dado de preenchimento visível (`Lorem`, `R$ 1.234`, `Nome Sobrenome`) mata a seção.
2. **Número no lugar de adjetivo.** "20 mil horas por ano" em vez de "economia significativa". E o número vem com origem e data quando a afirmação é forte.
3. **A prova é verificável.** Depoimento com foto, cargo, empresa e link para o caso completo. Avaliação com a fonte carimbada e link para o original.
4. **Honestidade converte.** Dizer em que caso o produto não é a melhor escolha, e nomear a alternativa, vende mais que esconder. O bloco de perguntas decorativo, que só repete o argumento de venda, não engana ninguém.
5. **Uma ação, repetida.** Um par de botões do começo ao fim.
6. **Acabamento com assinatura.** Um elemento que abre e fecha a página, uma ênfase tipográfica que só aquela marca usa, um detalhe que não precisava existir. Ver seção 2.

### 8.11 Movimentos recentes, a usar com critério

Estes padrões estão em alta em 2026. Nenhum deles é obrigatório, e todos envelhecem. Adote só o que o produto sustenta.

- Superfície para agente de IA como ação de primeira classe: um botão que copia o texto de configuração para colar em um agente, com o mesmo peso da ação humana; uma versão da página em texto puro para leitura automatizada.
- Demonstração interativa no topo no lugar da captura de tela.
- Terminal ou comando de instalação usado como elemento gráfico, no topo e na conversão final.
- Contador ao vivo da plataforma, quando o número é real.
- Blocos numerados que a rolagem percorre, transformando a página em um percurso único em vez de seções soltas.
- Bento com fragmento funcional por célula, não ícone.
- Prova social como captura do site do cliente, não como logo vetorial.
- Conformidade com título antagonista em vez de faixa neutra de selos.

### 8.12 Como apresentar um software sem virar catálogo

Esta subseção vem da desmontagem medida de uma página de produto de referência, e resolve o problema mais comum de página de software: a seção de recursos que vira lista de supermercado.

#### O que mostrar primeiro

**O todo, não uma parte.** A primeira imagem é a tela principal do produto inteiro, e só depois vêm as funções. A ordem que funciona é: produto inteiro, quatro funções, uma situação de uso, compatibilidade, escopo, profundidade. Catálogo faz o inverso, começa por itens.

#### A densidade cai conforme a contagem sobe

Nunca mais de **quatro itens com arte** por vez. Quando a seção precisa de seis ou sete, o formato do item **muda**: com seis, vira texto puro sem ícone; com sete, vira um azulejo pequeno e estático.

**Seis itens com a mesma riqueza de quatro é exatamente onde a página vira catálogo.** Se você precisa de mais itens, empobreça o item.

#### Troque o formato de apresentação a cada seção

Na página medida, sete seções usaram seis formatos distintos e **nenhum se repetiu**.

| Formato | Custo de produção | Onde cabe |
|---|---|---|
| Captura real do produto, cortada pela borda | Baixo | Abertura, quando o produto já é bonito |
| Animação vetorial dentro de um cartão | Alto | Função que **é** um movimento: arrastar, filtrar, notificar |
| Vídeo com a interface recriada em HTML por cima | Muito alto | Quando há pessoas na cena |
| Imagem estática em azulejo | Baixo | Prova de escopo, muitos itens |
| Interface recriada em HTML embutido no texto | Médio | Quando o recurso acontece dentro de texto |
| A própria página virando o produto | Médio de produção, alto de concepção | O recurso de maior profundidade |

**Liste os formatos antes de desenhar e proíba o segundo uso de cada um.** Se duas seções pedem o mesmo formato, uma delas está falando da mesma coisa que a outra, e deve ser cortada ou fundida com a irmã.

#### O padrão de legenda que mata o molde de catálogo

Esta é a decisão de micro-tipografia com maior retorno da página inteira, e custa duas linhas de CSS. Em vez do trio **ícone, título, parágrafo** que define visualmente todo catálogo de recursos, a legenda é **um único parágrafo** cuja primeira frase está em peso maior e cor cheia, e o resto em peso leve com opacidade reduzida:

```html
<p class="legenda">
  <span class="entrada">Atalhos de teclado.</span>
  Acesso imediato às ações mais usadas, sem tirar a mão do teclado.
</p>
```

```css
/* --fg é a cor de texto da superfície: --ink no claro, o texto claro na seção escura */
.legenda {
  font-size: 1rem; font-weight: 300; line-height: 1.375;
  letter-spacing: -.02em; color: color-mix(in srgb, var(--fg) 65%, transparent);
}
.legenda .entrada { font-weight: 500; color: var(--fg); }
```

Um bloco de texto em vez de três elementos, e a hierarquia feita por **peso e opacidade** em vez de tamanho. Meça o contraste do trecho a 65%: ele também precisa de 4,5:1.

#### Deixe a mídia atravessar a borda da seção

Na página medida, a captura da abertura **começa acima da própria seção** e sai pela base sem raio inferior; a arte do fechamento está deslocada para fora pela esquerda; os azulejos vazam além do contêiner.

**Em toda seção, pelo menos um elemento gráfico deve cruzar uma borda do contêiner.** É isso que impede a página de parecer uma pilha de caixas, e é o que mais distingue visualmente uma página composta de uma página montada. Exige `overflow: clip` no invólucro (não `hidden`, que quebra o `sticky` dos descendentes, ver 12.6), e disciplina de largura nos filhos. Combine com `object-position` declarado e com o véu em gradiente que dissolve a base da imagem na cor da seção, em vez de cortá-la numa linha reta.

#### A regra de variação

**Cada seção muda pelo menos três destas cinco variáveis** em relação à anterior:

1. Largura da coluna de conteúdo.
2. Posição do texto (à esquerda, recuado, na segunda coluna, em coluna estreita dentro de contêiner largo).
3. Formato da mídia.
4. Presença de movimento. **Inclua de propósito uma seção completamente parada**: numa página cheia de movimento, a seção estática é que cria a pausa.
5. Temperatura do fundo, com no máximo um bloco invertido por página (ver 8.3).

#### Três pretos, não um

A página medida usa três tons de quase preto a menos de dez pontos de distância entre si: um para a abertura e o fechamento, outro para os cartões, outro para a seção de contraste. Suficiente para o olho ler **camadas** sem ler cores diferentes. O mesmo vale para a família de quase brancos.

#### Detalhes que separam esta execução de uma cópia dela

- O aro claro ao redor de um cartão escuro vai como `box-shadow` com `background-clip: padding-box`, **não como `border`**. Assim o fundo do cartão não vaza por baixo do aro semitransparente e a aresta fica limpa. É esse aro que faz um retângulo quase preto sobre fundo quase branco parecer um objeto iluminado em vez de um buraco.
- Raio e contorno **mudam conforme o objeto**: um cartão grande com movimento dentro é uma janela e pede um raio; um azulejo pequeno e estático é outro objeto e pede outro. Objeto diferente, token diferente.
- Numa réplica de interface, posicione os elementos sobrepostos em **porcentagem**, não em pixel. É a diferença entre uma réplica que escala junto com o vídeo e um print legendado.
- Na mesma réplica, mostre um **micro-estado real**: um controle em vermelho, dois microfones mudos, uma palavra cortada no meio com o cursor piscando. Uma cena com tudo ligado e tudo perfeito lê como ilustração; uma cena com um estado intermediário lê como captura.
