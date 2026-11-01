# Landing page premium

Uma skill para o Claude e o Codex construírem landing pages com acabamento de produto de software maduro. Ela fecha a oferta e a copy antes do design, monta o visual a partir da sua marca, mede a página do celular ao monitor e verifica tudo no navegador antes de entregar.

> Chegou aqui pelo direct do Instagram? Vá direto para [Instalação](#instalação). Leva de 2 a 5 minutos.

---

## O que ela faz

Você pede uma landing page. Em vez de sair desenhando, o agente segue um processo de 11 etapas, que a skill chama de portões. Cada portão tem um critério de saída, e o agente só avança quando o critério é cumprido.

Na prática, isso significa que ele vai:

1. **Perguntar antes de desenhar.** Público, ação que a página precisa gerar, cores, fontes, logotipo, manual de marca, restrições legais do seu setor.
2. **Escrever a oferta e a copy primeiro.** Manchete testada, mecanismo, prova, garantia, objeções. A página é desenhada em volta do texto real, não de texto provisório.
3. **Montar o visual a partir da sua marca.** Paleta, tipografia, texturas e ilustrações nascem da sua identidade. Duas páginas feitas com esta skill não devem parecer irmãs.
4. **Produzir material visual próprio.** Textura gerada por código, telas do produto recriadas em HTML, diagramas em SVG. Nada de foto de banco nem imagem gerada por IA.
5. **Medir em vez de achar.** Contraste calculado, auditoria em dez larguras de tela (de 320 a 1920 px), zoom de 200%, movimento reduzido, erros de console.
6. **Revisar o texto contra vícios de IA.** Travessão, "não é X, é Y", "imagine", "transforme", superlativo sem prova, botão "Saiba mais".
7. **Dizer o que mediu e o que não testou.** Ela nunca apresenta a página como validada comercialmente.

## Para quem é

- Quem vende serviço, produto digital, software ou consultoria e precisa de uma página de venda que não tenha cara de template.
- Freelancer ou agência que cria páginas para clientes e quer um processo repetível, com padrão de qualidade verificável.
- Quem já tem uma página e quer uma auditoria: o que está quebrado, por que, e o que corrigir primeiro.

**Não é para:** aplicativo, painel interno, e-mail marketing, carrossel de rede social ou peça estática. Para isso, a skill vai dizer que não se aplica.

## Como ela trabalha: os 11 portões

| # | Portão | O que acontece | O que sai dele |
|---|---|---|---|
| 1 | Briefing e identidade | Perguntas sobre negócio, público e marca. Sem resposta, ela propõe opções e pede escolha | Ficha de identidade preenchida |
| 2 | Oferta e mensagem | Banco de frases do cliente, ficha de oferta, registro de alegações, manchete | Copy deck aprovado |
| 3 | Piso de qualidade | Mede as páginas de referência que você indicar, em vez de olhar a olho | Tabela de parâmetros |
| 4 | Tokens | Cores, tipografia, espaço e sombra viram variáveis, com contraste medido | Bloco de tokens do CSS |
| 5 | Material visual | Decide de onde vem cada imagem | Texturas, telas e diagramas próprios |
| 6 | Componentes | Botão, campo, cartão e selo, com todos os estados | Kit de componentes |
| 7 | Seções | Cada seção responde a uma pergunta do leitor, e o formato sai do conteúdo | Página montada |
| 8 | Movimento | Animação com propósito, e a versão para quem pede menos movimento | Coreografia de entrada |
| 9 | Responsividade | Auditoria automática em dez larguras | Relatório e capturas |
| 10 | QA | Acessibilidade, performance, conversão e revisão de copy | Lista de verificação aprovada |
| 11 | Refinamento | Um pedido por vez, verificado antes do próximo | Versão final |

## O que tem dentro

```
landing-page-premium/
├── skills/landing-page-premium/        a skill propriamente dita
│   ├── SKILL.md                        o método: regras, os 11 portões e a entrega
│   ├── references/                     o detalhe de cada portão, lido só quando precisa
│   │   ├── 01-craft.md                 acabamento: estados, geometria, tipografia de detalhe
│   │   ├── 02-sistema-de-design.md     tokens, cor, tipografia, espaço, superfície
│   │   ├── 03-componentes.md           botão, rótulo, título com destaque, cartões, ícones
│   │   ├── 04-movimento.md             curvas, durações, microinterações, movimento reduzido
│   │   ├── 05-material-visual.md       texturas, interface recriada em HTML, imagem de compartilhamento
│   │   ├── 06-estrutura-e-narrativa.md ordem das seções, catálogo de topos e de seções, bento
│   │   ├── 07-diagramas.md             diagramas e ilustrações animadas em SVG
│   │   ├── 08-copy-e-oferta.md         manchete, oferta, setor regulado, anti-slop de texto, português
│   │   ├── 09-conversao.md             o que move conversão, formulário, LGPD, prova, medição, teste A/B
│   │   ├── 10-responsividade.md        breakpoints, armadilhas do celular, critério de aprovação
│   │   ├── 11-acessibilidade.md        WCAG 2.2 AA na prática
│   │   ├── 12-performance.md           métricas, vídeo no topo, fontes, animação vetorial
│   │   ├── 13-leis-e-principios.md     heurísticas, leis de interação e Gestalt, com teste
│   │   ├── 14-qa-e-erros-comuns.md     QA executável e tabela de erros comuns
│   │   └── 15-codigo-de-referencia.md  trechos prontos de JavaScript e CSS
│   ├── scripts/                        verificações automáticas
│   │   ├── auditar-responsivo.mjs      auditoria por largura de tela, no navegador
│   │   ├── checar-texto.py             revisão anti-slop e de ritmo do texto
│   │   └── contraste.py                medição de contraste dos tokens
│   └── agents/openai.yaml              nome e descrição que o Codex mostra
├── .claude-plugin/                     permite instalar pelo catálogo de plugins do Claude Code
├── empacotar.sh                        gera o .zip para o Claude no navegador
├── CHANGELOG.md
└── LICENSE
```

O `SKILL.md` é curto de propósito. O agente lê o método inteiro e abre só a referência do portão em que está. Isso mantém a conversa leve: a skill ocupa cerca de 260 tokens fixos por sessão e cerca de 6 mil quando é ativada.

---

## Instalação

Escolha o lugar onde você usa IA. Se usa mais de um, instale em cada um.

| Onde você usa | Caminho | Tempo |
|---|---|---|
| Claude Code (terminal, VS Code, app de desktop) | [Opção A](#opção-a-claude-code) | 1 minuto |
| Claude no navegador ou no app (claude.ai) | [Opção B](#opção-b-claude-no-navegador-ou-no-app) | 3 minutos |
| Codex (terminal, extensão de IDE ou app do ChatGPT) | [Opção C](#opção-c-codex) | 2 minutos |
| Outro agente compatível com skills (Cursor, OpenCode e outros) | [Opção D](#opção-d-qualquer-agente-compatível) | 1 minuto |

### Opção A: Claude Code

Dentro de uma sessão do Claude Code, rode os dois comandos:

```
/plugin marketplace add Mathsantoslima/landing-page-premium
/plugin install landing-page-premium@math-lima
```

Pronto. Para receber atualizações depois, rode os dois e reinicie a sessão:

```
/plugin marketplace update math-lima
/plugin update landing-page-premium@math-lima
```

<details>
<summary>Prefere instalar sem o catálogo de plugins? Copie a pasta à mão.</summary>

No Mac ou no Linux, no terminal:

```bash
git clone https://github.com/Mathsantoslima/landing-page-premium.git
mkdir -p ~/.claude/skills
cp -R landing-page-premium/skills/landing-page-premium ~/.claude/skills/
```

No Windows, no PowerShell:

```powershell
git clone https://github.com/Mathsantoslima/landing-page-premium.git
New-Item -ItemType Directory -Force "$HOME\.claude\skills" | Out-Null
Copy-Item -Recurse landing-page-premium\skills\landing-page-premium "$HOME\.claude\skills\"
```

Abra uma sessão nova do Claude Code. Para atualizar, rode `git pull` na pasta clonada e copie de novo.

</details>

### Opção B: Claude no navegador ou no app

1. Baixe o arquivo: **[landing-page-premium.zip](https://github.com/Mathsantoslima/landing-page-premium/releases/latest/download/landing-page-premium.zip)**. Não descompacte.
2. No Claude, abra **Configurações > Capacidades** (*Settings > Capabilities*) e ative **Execução de código e criação de arquivos** (*Code execution and file creation*). As skills dependem disso.
3. Vá em **Personalizar > Skills** (*Customize > Skills*), clique em **+**, depois em **Criar skill** e em **Enviar uma skill** (*Upload a skill*).
4. Envie o `.zip` que você baixou. A skill aparece na lista; confira se ela está ligada.

Funciona nos planos Free, Pro, Max, Ultra, Team e Enterprise. No Team e no Enterprise, o administrador precisa ter liberado skills para a organização.

**Uma limitação desse ambiente:** a auditoria de responsividade precisa abrir a página num navegador, e o ambiente do Claude no navegador pode não ter um. Nesse caso, ele roda as verificações de texto e de contraste e te entrega o comando da auditoria para você rodar no seu computador (veja [Rodar as verificações](#rodar-as-verificações-você-mesmo)).

### Opção C: Codex

O jeito mais simples é pedir ao próprio Codex. Numa sessão, escreva:

```
$skill-installer instale a skill de https://github.com/Mathsantoslima/landing-page-premium/tree/main/skills/landing-page-premium
```

<details>
<summary>Ou copie a pasta à mão.</summary>

No Mac ou no Linux:

```bash
git clone https://github.com/Mathsantoslima/landing-page-premium.git
mkdir -p ~/.agents/skills
cp -R landing-page-premium/skills/landing-page-premium ~/.agents/skills/
```

No Windows, no PowerShell:

```powershell
git clone https://github.com/Mathsantoslima/landing-page-premium.git
New-Item -ItemType Directory -Force "$HOME\.agents\skills" | Out-Null
Copy-Item -Recurse landing-page-premium\skills\landing-page-premium "$HOME\.agents\skills\"
```

</details>

Se a skill não aparecer, reinicie o Codex. Para conferir, rode `/skills` e procure `landing-page-premium`.

### Opção D: qualquer agente compatível

Com o Node.js instalado, um comando detecta os agentes que você tem e pergunta onde instalar:

```bash
npx skills add Mathsantoslima/landing-page-premium
```

---

## Como usar

A skill entra sozinha quando o seu pedido fala de landing page, página de venda, copy, oferta ou conversão. Se quiser chamar pelo nome:

| Onde | Como chamar |
|---|---|
| Claude Code, instalada pelo catálogo | `/landing-page-premium:landing-page-premium` |
| Claude Code, instalada à mão | `/landing-page-premium` |
| Codex | `$landing-page-premium` |
| Claude no navegador ou no app | escreva "use a skill landing-page-premium" no pedido |

### Pedidos que funcionam bem

**Criar do zero**

```
Quero uma landing page para a minha consultoria financeira para clínicas odontológicas.
A ação principal é agendar um diagnóstico de 45 minutos. Vou te mandar o logo e as cores.
```

**Auditar uma página que já existe**

```
Audite esta landing page: https://seusite.com.br
Quero saber o que está quebrado, por que, e o que corrigir primeiro.
```

**Só a copy e a oferta**

```
Antes de qualquer design, me ajude a fechar a oferta e a manchete da página do meu curso.
Público: donos de pequenas transportadoras. Ainda não tenho depoimentos.
```

**Revisar um texto pronto**

```
Revise o texto desta página contra as regras anti-slop da skill e me devolva a versão corrigida.
```

### Tenha isto em mãos

Quanto mais material de marca você entregar, mais a página fica com a cara do seu negócio:

- logotipo em SVG, ou PNG com fundo transparente;
- cores da marca, em hexadecimal, se tiver;
- nome das fontes, se tiver;
- manual de marca, se existir;
- de três a cinco peças já publicadas (post, apresentação, site antigo);
- dados reais de resultado, com origem e data;
- depoimentos com autorização por escrito para usar nome e foto.

Sem nada disso, a skill propõe direções e pede para você escolher. Ela não inventa número nem depoimento.

### O que você recebe

A página em HTML, CSS e JavaScript, que você publica onde quiser (Vercel, Netlify, Hostinger, o seu servidor). Se você trabalha com React, Next.js, Astro, Tailwind, Webflow ou Lovable, avise no começo: o método é o mesmo e o agente adapta o código.

---

## Rodar as verificações você mesmo

Os três scripts ficam na pasta `scripts/` da skill. Copie-os para a pasta do seu projeto, ou chame pelo caminho completo.

| Comando | O que faz | Precisa de |
|---|---|---|
| `python3 contraste.py tokens.css` | Mede o contraste de todos os pares de cor do seu `:root` | Python 3 |
| `python3 checar-texto.py index.html` | Procura vícios de texto de IA, botões proibidos e ritmo uniforme | Python 3 |
| `node auditar-responsivo.mjs index.html --shots` | Abre a página em dez larguras e mede estouro, alvos de toque, fontes, contraste, CLS e erros | Node.js 18 ou mais novo e Playwright |

Para a auditoria, instale o Playwright uma vez, na pasta do projeto:

```bash
npm i -D playwright
npx playwright install chromium
```

No Windows, troque `python3` por `py`.

Cada script mostra `[x]` para o que bloqueia a entrega e `[!]` para o que vale revisar, e termina com APROVADO ou REPROVADO.

---

## Perguntas frequentes

**Preciso saber programar?**
Não para usar a skill: você conversa com o agente. Para publicar a página e rodar a auditoria no seu computador, ajuda saber abrir um terminal e colar um comando. O README traz os comandos prontos.

**Funciona no plano gratuito do Claude?**
Sim, no Claude no navegador e no app, desde que a execução de código esteja ligada. O Claude Code e o Codex exigem os planos que dão acesso a eles.

**A página sai pronta para publicar?**
Sai tecnicamente pronta e verificada. O que ela não tem como garantir é a conversão: isso só a medição com tráfego real responde, e a skill vai te dizer exatamente isso na entrega.

**Por que ela não usa foto de banco ou imagem gerada por IA?**
Porque são as duas marcas mais rápidas de página genérica. No lugar, ela gera textura, ilustração e telas do produto por código, a partir da sua marca. Fotos próprias, como a sua ou a da sua equipe, são bem-vindas.

**Funciona em outro idioma?**
O método funciona em qualquer idioma. Mas a skill foi escrita para o Brasil: as regras de português, de formatação de moeda e data, e as normas citadas (Código de Defesa do Consumidor, LGPD, CFM, OAB) são brasileiras.

**Posso usar nas páginas que eu faço para clientes?**
Pode. Veja os termos em [Licença](#licença).

**Achei um erro ou tenho uma sugestão.**
Abra uma [issue](https://github.com/Mathsantoslima/landing-page-premium/issues) com o que aconteceu, o que você esperava e, se puder, o pedido que você fez ao agente.

**Como desinstalo?**
No Claude Code pelo catálogo: `/plugin uninstall landing-page-premium@math-lima`. Instalada à mão: apague a pasta `landing-page-premium` de `~/.claude/skills` ou de `~/.agents/skills`. No Claude no navegador: **Personalizar > Skills**, abra a skill e escolha excluir.

---

## Licença

Você pode usar e adaptar esta skill para criar páginas para você e para os seus clientes, inclusive em trabalho pago. As páginas que você criar são suas.

Você não pode vender, revender ou redistribuir a skill, no todo ou em parte, como produto, curso, template ou item de pacote pago. Os termos completos estão em [LICENSE](LICENSE).

## Autor

Feita por Matheus Lima (Math). Histórico de versões em [CHANGELOG.md](CHANGELOG.md).
