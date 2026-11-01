> Referência da skill `landing-page-premium`. O processo, os portões e as regras anti-slop estão no `SKILL.md`. A numeração das seções é a mesma em todos os arquivos.

## 15. Leis e princípios com critério de verificação

Referência rápida. Cada linha tem a aplicação e o teste.

### 15.1 Heurísticas de usabilidade

| Heurística | Aplicação | Teste |
|---|---|---|
| Visibilidade do estado | Barra de progresso, contador de etapa, seção atual na navegação | Todo processo de mais de um passo mostra posição e total |
| Correspondência com o mundo real | Rótulo na linguagem do leitor | Nenhum rótulo com jargão interno do produto |
| Controle e liberdade | Voltar no formulário, Esc fecha, ciclo para ao clique | Todo avanço automático cede ao comando manual |
| Consistência | Mesmo botão, rótulo e painel em todas as seções | Dois componentes de mesma função têm anatomia idêntica |
| Prevenção de erro | Máscara, faixa limitada, preenchimento automático | Entrada numérica tem mínimo e máximo coerentes |
| Reconhecer em vez de lembrar | Resultado visível no momento da decisão, ação fixa após o topo | A informação de decisão está visível quando se decide |
| Flexibilidade | Controle deslizante com campo numérico pareado | Entrada por arraste tem alternativa digitável |
| Estética e minimalismo | Vocabulário restrito de sombra, curva e destaque | O sistema cabe numa página de tokens |
| Recuperação de erro | Mensagem com causa e próximo passo | Nenhum erro termina sem caminho |
| Ajuda | Perguntas frequentes antes da conversão, respondendo objeção real | A ajuda está no ponto de atrito, não numa página à parte |

### 15.2 Leis de interação

| Lei | Aplicação | Teste |
|---|---|---|
| Fitts | Alvo grande e perto. Ação na largura total no celular | Alvo de 44 px, logo abaixo do último campo |
| Hick | Menos escolhas por vez | Navegação com até 5 itens, uma ação primária |
| Jakob | Seguir a convenção que o usuário já conhece | Logotipo à esquerda, ação à direita, rodapé com legal |
| Miller | Blocos de 4 a 7 itens | Nenhuma lista com 12 bullets |
| Von Restorff | Uma cor de ação na página | Nada decorativo usa a cor de ação |
| Posição serial | Melhor argumento em primeiro, segundo melhor por último | Verifique a ordem dos bullets |
| Pico e fim | Investir no momento de maior valor e na confirmação | A tela de confirmação tem próximo passo, não só agradecimento |
| Doherty | Resposta abaixo de 400 ms | Feedback visual em menos de 100 ms no clique |
| Goal-Gradient | Barra já começa preenchida | Etapa 1 de 3 mostra 33%, não 0% |
| Zeigarnik | Tarefa iniciada cria tensão de conclusão | Primeira etapa curta aumenta a conclusão |
| Tesler | A complexidade fica no sistema | Calculadora em vez de 12 campos |
| Postel | Aceitar entrada em qualquer formato | Telefone com ou sem máscara é aceito |
| Estética e usabilidade | O acabamento compra tolerância a atrito | Investir desproporcionalmente no topo |
| Occam | Remover o que não contribui para a decisão | Apagar a seção e a conversão não cai? Era ruído |

### 15.3 Gestalt com medida

| Princípio | Regra mensurável |
|---|---|
| Proximidade | Espaço entre grupos no mínimo 2× o espaço interno |
| Similaridade | A cor de ação é exclusiva de elemento clicável |
| Região comum | Painel ou cartão agrupa, dispensando linha divisória |
| Conectividade uniforme | Linha que liga passos vence cor e distância. É o agrupador mais forte |
| Continuidade | Um eixo de alinhamento por seção |
| Figura e fundo | Texto sobre imagem exige 4,5:1 medido no pior pixel |
| Fechamento | Cortar um cartão na borda sinaliza que há mais |
| Destino comum | Elementos do mesmo grupo entram com atraso próximo |
| Prägnanz | Grid de 12 colunas com divisões limpas: 2, 3, 4, 6 |
| Ponto focal | Um foco por tela. No topo, a ação é o maior salto de contraste |

### 15.4 Hierarquia visual

Cinco alavancas, em ordem de força: **tamanho**, **peso**, **cor**, **posição**, **espaço**.

- Salto perceptível de tamanho exige pelo menos 1,25× entre níveis.
- Diferença de peso precisa de 2 degraus, de 400 para 700, não de 400 para 500.
- Texto primário entre 90% e 100% de opacidade, secundário entre 60% e 70%, sempre respeitando 4,5:1.
- Isolar é a forma mais barata de destacar.

**Teste do desfoque:** aplique 10 px de desfoque na tela. O título e a ação precisam ser identificáveis sem leitura.
