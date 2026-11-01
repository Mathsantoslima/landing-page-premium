> Referência da skill `landing-page-premium`. O processo, os portões e as regras anti-slop estão no `SKILL.md`. A numeração das seções é a mesma em todos os arquivos.

## 13. Acessibilidade

Nível alvo: **WCAG 2.2 AA**. Não é opcional, e várias exigências melhoram a página para todo mundo.

### 13.1 Contraste

| Alvo | Mínimo |
|---|---|
| Texto normal | 4,5:1 |
| Texto grande (24 px, ou 18,66 px em negrito) | 3:1 |
| Borda de componente e parte de gráfico | 3:1 |
| Indicador de foco contra o fundo adjacente | 3:1 |

**Meça antes de aplicar**, não depois. Sobre gradiente ou imagem, meça o pior ponto, não um ponto qualquer. Sobre cor translúcida, meça o pixel renderizado, não o valor do CSS.

Script de medição em 17.4.

### 13.2 Teclado e foco

```css
:focus-visible{outline:2.5px solid var(--foco);outline-offset:3px;border-radius:6px}
```

- Nunca `outline: none` sem substituto.
- Nunca `tabindex` positivo. Apenas `0` e `-1`.
- Link para pular ao conteúdo como primeiro elemento focável.
- Diálogo: use `<dialog>` nativo com `showModal()`, que resolve foco inicial, prisão de foco, Esc e inerte do fundo.
- Ao fechar, devolva o foco ao elemento que abriu.
- **Header fixo:** `scroll-padding-top` igual à altura do header, senão o elemento focado fica escondido atrás dele (WCAG 2.4.11).

### 13.3 Semântica e ARIA

**Primeira regra do ARIA:** se existe elemento HTML nativo com a semântica necessária, use-o. `<button>`, `<a>`, `<details>`, `<dialog>` já trazem papel, foco e teclado. ARIA errado é pior que ARIA nenhum.

| Componente | Atributos | Teclas |
|---|---|---|
| Disclosure | `<button aria-expanded aria-controls>` | Enter, Space |
| Acordeão | Cabeçalho com `<h3><button aria-expanded aria-controls>`; painel com `role="region"` e `aria-labelledby` | Enter, Space |
| Abas | `role="tablist"`, `role="tab"` com `aria-selected` e `aria-controls`, `role="tabpanel"` com `aria-labelledby`. Só a aba ativa na ordem de Tab | Setas, Home, End |
| Diálogo | `<dialog>` nativo, ou `role="dialog" aria-modal="true"` com `aria-labelledby` | Esc fecha, Tab circula |
| Mensagem de status | `role="status"` para sucesso, `role="alert"` para erro. O contêiner precisa existir vazio antes | |

### 13.4 Formulário

- `<label for>` sempre. Placeholder não é rótulo.
- Erro com `aria-invalid="true"` e `aria-describedby` apontando para a mensagem, que fica junto ao campo.
- Valide ao sair do campo e no envio. A cada tecla, só para apagar um erro já mostrado (ver 11.5).
- Não desabilite o botão de envio por padrão, porque isso esconde o caminho.
- Tokens de `autocomplete`: `name`, `email`, `tel` ou `tel-national`, `organization`, `address-level2`. Tabela completa em 11.5.
- `inputmode` correto: `numeric` para CEP e código, `tel` para telefone.
- **Permita colar em todos os campos.** Em senha e código de verificação, bloquear a colagem reprova o critério 3.3.8; nos demais campos, é atrito sem motivo.

**Campo armadilha acessível.** Use o bloco de 11.5, com as três camadas juntas (escondido sem `display: none`, `aria-hidden="true"` e `tabindex="-1"`). Sem as três, o leitor de tela anuncia o campo, a pessoa preenche e é barrada como robô.

### 13.5 Outros critérios que importam

| Critério | Exigência |
|---|---|
| 1.4.4 Resize Text | Texto a 200% sem perda. Cuidado com `clamp()` sem parcela em `rem` |
| 1.4.10 Reflow | Sem rolagem em dois eixos a 320 px de largura |
| 1.4.12 Text Spacing | Nada corta nem sobrepõe quando o usuário aplica entrelinha de 1,5, espaço entre parágrafos de 2 vezes a fonte, entreletra de 0,12em e espaço entre palavras de 0,16em |
| 2.5.8 Target Size | Alvo de 24 × 24 px no mínimo. Use 44 px no celular |
| 2.5.7 Dragging | Toda função de arrastar tem alternativa por clique |
| 1.4.1 Use of Color | Cor nunca é o único indicador |
| 3.1.1 Language | `<html lang="pt-BR">` |
