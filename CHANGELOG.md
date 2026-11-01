# Histórico de versões

## 1.0.0 (01/11/2026)

Primeira versão pública. Parte do arquivo único da skill, de 4.500 linhas, reorganizado e revisado para distribuição.

### Estrutura

- O arquivo único virou um `SKILL.md` de 395 linhas (o método, os 11 portões e a entrega) mais 15 arquivos em `references/`, lidos só quando o portão pede. A ativação passou de cerca de 70 mil tokens para cerca de 6 mil.
- A numeração original das seções foi mantida em todos os arquivos, para as remissões internas ("ver 10.4") continuarem valendo.
- A descrição foi reescrita para caber no limite de 1.024 caracteres do Claude e do Codex.
- Instalação pelo catálogo de plugins do Claude Code, pelo Codex, pelo `npx skills` e por `.zip` para o Claude no navegador.

### Scripts

- `scripts/auditar-responsivo.mjs`: extraído da seção 12.7. Aceita arquivo local, captura erros de console e requisições com erro, verifica elemento cortado à esquerda e avisa alvo entre 24 e 44 px no celular. Deixou de acusar como defeito três padrões que a própria skill recomenda: `overflow: clip`, coluna fixa em tabela rolável e topo com `100svh`. A passada de zoom de 200% deixou de medir como CLS o salto causado pelo próprio zoom.
- `scripts/checar-texto.py`: substitui os comandos `grep` da seção 10.11, que não funcionavam no Mac (`grep -P`) nem no Windows. Lê também título, meta description, `og:*`, `alt` e `aria-label`. Não confunde mais o "e" de conjunção com o "é" de "não é X, é Y". Libera as setas `→` e `↗`, que a seção 8.6 recomenda.
- `scripts/contraste.py`: mede um par ou todos os pares de um arquivo de tokens.

### Correções no conteúdo

- Contagem de portões (9 para 11) e remissão de tipografia (4.4 para 4.3).
- Nomes de token unificados entre as seções 4 e 12 (`--gutter`, `--content-max`, `--space-*`); `--on-action` e `--foco` passaram a existir na estrutura.
- Componentes deixaram de trazer a cor do projeto de exemplo escrita direto no código; tudo sai de token.
- Ícones da 17.3 ganharam as cinco animações que faltavam no CSS da 6.4; o formulário passou a preencher o carimbo de tempo contra robô; o teste de movimento reduzido da 16.1 passou a abrir a página antes de medir.
- Validação de formulário, colagem bloqueada (WCAG 3.3.8) e espaçamento de texto (WCAG 1.4.12) corrigidos e alinhados entre as seções 11 e 13.
- Dados checados contra a fonte: os números de Rive contra Lottie estavam invertidos; o efeito de olhar o teste A/B 20 vezes é de cerca de 25%, não 50%; o dado de nível de leitura é de 2024, não de 2017; a perda por CAPTCHA tem fonte só para 3,2%; o estudo de campos de formulário foi atribuído ao levantamento certo. Estatísticas sem fonte localizada foram retiradas ou marcadas como ordem de grandeza.
