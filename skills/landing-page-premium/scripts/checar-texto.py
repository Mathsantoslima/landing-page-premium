#!/usr/bin/env python3
"""
checar-texto.py

Revisão anti-slop e de ritmo do texto de uma landing page (seção 10.11 da skill).
Só usa a biblioteca padrão do Python 3.8 ou mais novo. Funciona no Mac, no Windows e no Linux.

Uso:
    python3 checar-texto.py index.html
    python3 checar-texto.py copy-deck.md          # também aceita .md e .txt

O que ele lê num HTML:
    texto visível (sem script, style, svg e comentário), texto de botão e link,
    e o que aparece fora da página: <title>, meta description, og:title, og:description,
    alt, aria-label, title e placeholder.

Saída:
    BLOQUEIA  precisa ser corrigido antes de entregar
    REVISAR   leia e decida; nem toda ocorrência é erro
    RITMO     métricas que orientam, não bloqueiam

Sai com código 1 se houver qualquer BLOQUEIA.
"""

import html
import re
import statistics
import sys
import unicodedata
from html.parser import HTMLParser
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


def sem_acento(s):
    """Minúsculas e sem diacríticos, para casar 'não', 'nao' e 'NÃO' com o mesmo padrão."""
    return "".join(c for c in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(c) != "Mn")


# ---------------------------------------------------------------------------
# Regras. Padrões de palavra são escritos sem acento e casados contra o texto normalizado.
# ---------------------------------------------------------------------------

PONTUACAO = [
    ("travessão", "\u2014"),
    ("meia-risca", "\u2013"),
    ("ponto médio", "\u00B7"),
    ("marcador de lista colado no texto", "\u2022"),
    ("reticência de um caractere", "\u2026"),
    ("três pontos", "..."),
    ("exclamação (só vale dentro de citação literal)", "!"),
]

# Emoji e dingbats. Setas (U+2190 a U+21FF) ficam de fora: a seção 8.6 usa "Texto →" e "Texto ↗".
EMOJI = re.compile("[\U0001F000-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF\uFE0F]")

BLOQUEIA = [
    ("não apenas X, mas também Y", r"\bnao (?:apenas|so|somente) .{0,60}\b(?:mas|como) tambem\b"),
    ("imagine", r"\bimagin(?:e|a|ar|em)\b"),
    ("fórmula de época", r"no mundo (?:de hoje|atual)|nos dias de hoje|no cenario atual|cada vez mais|mais do que nunca|na era d"),
    ("falsa intimidade", r"e se eu (?:te )?dissesse|vamos ser honestos|convenhamos|a verdade e que|o fato e que|\bspoiler\b"),
    ("verbo de slop no imperativo", r"\b(?:transforme|revolucione|eleve|desbloqueie|potencialize|mergulhe)\b|vamos explorar|descubra como"),
]

# Casados contra o texto em minúsculas COM acento: sem acento, "é" (verbo) e "e" (conjunção) se confundem.
BLOQUEIA_COM_ACENTO = [
    ("não é X, é Y", r"\bn[ãa]o é [^.,;:!?\n]{1,40}[,.;]\s*(?:n[ãa]o é [^.,;:!?\n]{1,40}[,.;]\s*)?é\b"),
]

REVISAR = [
    ("elevação vazia", r"\b(?:revolucion|transform|potencializ|alavanc|maximiz|impulsion|fomentar|proporcionar|agregar)\w*"),
    ("jargão de vitrine", r"solucao completa|\bde ponta\b|ultima geracao|divisor de aguas|disruptiv|inovador|holistic|sinergia|ecossistema|\bjornada\b|experiencia unica|proximo nivel"),
    ("verbo coringa", r"trazer (?:mais )?(?:resultados|clientes)|entregar valor|gerar impacto|resultados (?:reais|expressivos)"),
    ("muleta de transição", r"\b(?:alem disso|dessa forma|desse modo|nesse sentido|nesse contexto|por fim|em suma|em resumo|concluindo|vale (?:destacar|lembrar|ressaltar)|e importante (?:ressaltar|destacar)|como vimos)\b"),
    ("prova genérica ou superlativo", r"milhares de|centenas de|clientes satisfeitos|referencia no mercado|lider de mercado|\bo melhor\b|\ba melhor\b|numero 1|excelencia|todos os portes"),
    ("gerundismo ou burocratês", r"\b(?:vou|vamos|vai|irei|iremos) estar \w+ndo\b|venho por meio deste|estamos (?:a|à) disposicao"),
]

BOTAO_PROIBIDO = re.compile(
    r"clique aqui|saiba mais|^\s*enviar\s*$|cadastre-se|comece (?:agora|sua jornada)|fale com (?:um )?especialista|entre em contato|solicitar orcamento"
)

BLOCOS = {
    "p", "li", "h1", "h2", "h3", "h4", "h5", "h6", "td", "th", "dd", "dt", "label", "figcaption",
    "blockquote", "button", "summary", "div", "section", "article", "header", "footer", "nav",
    "main", "aside", "form", "ul", "ol", "table", "tr", "br", "option", "legend",
}
PROSA = {"p", "li", "blockquote", "dd", "figcaption"}
IGNORAR = {"script", "style", "svg", "noscript", "template", "head"}
ATRIBUTOS = ("alt", "aria-label", "title", "placeholder")
META_TEXTO = {"description", "og:title", "og:description", "twitter:title", "twitter:description"}


class Leitor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ignorar = 0
        self.no_title = False
        self.partes = []          # texto visível, com quebra entre blocos
        self.fora_da_pagina = []  # title, meta e atributos
        self.negrito = 0
        self.chars_negrito = 0
        self.botoes = []          # (tag, texto)
        self.pilha_botao = []
        self.listas = []          # contadores de <li> por lista aberta
        self.listas_fechadas = []
        self.paragrafo = None
        self.prosa = []           # texto de p, li, blockquote, dd e figcaption, para medir ritmo
        self.pilha_prosa = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title":
            self.no_title = True
        if tag == "meta":
            chave = (a.get("name") or a.get("property") or "").lower()
            if chave in META_TEXTO and a.get("content"):
                self.fora_da_pagina.append((f"meta {chave}", a["content"]))
        for nome in ATRIBUTOS:
            if a.get(nome) and not self.ignorar:
                self.fora_da_pagina.append((f"{tag}[{nome}]", a[nome]))
        if tag in IGNORAR:
            self.ignorar += 1
            return
        if self.ignorar:
            return
        if tag in BLOCOS:
            self.partes.append("\n")
        if tag in ("strong", "b"):
            self.negrito += 1
        if tag in ("a", "button"):
            self.pilha_botao.append([tag, ""])
        if tag in ("ul", "ol"):
            self.listas.append(0)
        if tag == "li" and self.listas:
            self.listas[-1] += 1
        if tag == "p":
            self.paragrafo = ""
        if tag in PROSA:
            self.pilha_prosa.append("")

    def handle_endtag(self, tag):
        if tag == "title":
            self.no_title = False
        if tag in IGNORAR:
            self.ignorar = max(0, self.ignorar - 1)
            return
        if self.ignorar:
            return
        if tag in BLOCOS:
            self.partes.append("\n")
        if tag in ("strong", "b"):
            self.negrito = max(0, self.negrito - 1)
        if tag in ("a", "button") and self.pilha_botao:
            t, texto = self.pilha_botao.pop()
            self.botoes.append((t, re.sub(r"\s+", " ", texto).strip()))
        if tag in ("ul", "ol") and self.listas:
            self.listas_fechadas.append(self.listas.pop())
        if tag == "p" and self.paragrafo is not None:
            self.paragrafos.append(self.paragrafo)
            self.paragrafo = None
        if tag in PROSA and self.pilha_prosa:
            texto = re.sub(r"\s+", " ", self.pilha_prosa.pop()).strip()
            if texto:
                self.prosa.append(texto)

    def handle_data(self, data):
        if self.no_title and data.strip():
            self.fora_da_pagina.append(("title", data.strip()))
            return
        if self.ignorar:
            return
        self.partes.append(data)
        if self.negrito:
            self.chars_negrito += len(data.strip())
        for item in self.pilha_botao:
            item[1] += data
        if self.paragrafo is not None:
            self.paragrafo += data
        if self.pilha_prosa:
            self.pilha_prosa[-1] += data

    paragrafos = None

    def feed_all(self, s):
        self.paragrafos = []
        self.feed(s)
        self.close()


def linhas_de(texto):
    return [re.sub(r"[ \t\u00A0]+", " ", l).strip() for l in texto.split("\n") if l.strip()]


def checar_linhas(linhas, origem, achados_b, achados_r):
    for l in linhas:
        for nome, ch in PONTUACAO:
            if ch in l:
                achados_b.append((nome, origem, l))
        if EMOJI.search(l):
            achados_b.append(("emoji ou símbolo decorativo", origem, l))
        baixo = l.lower()
        for nome, pad in BLOQUEIA_COM_ACENTO:
            if re.search(pad, baixo):
                achados_b.append((nome, origem, l))
        n = sem_acento(l)
        for nome, pad in BLOQUEIA:
            if re.search(pad, n):
                achados_b.append((nome, origem, l))
        for nome, pad in REVISAR:
            if re.search(pad, n):
                achados_r.append((nome, origem, l))


def frases_de(linhas):
    frases = []
    for l in linhas:
        for f in re.split(r"(?<=[.?!])\s+", l):
            if len(f.split()) > 2:
                frases.append(f)
    return frases


def cortar(s, n=110):
    s = s.strip()
    return s if len(s) <= n else s[:n] + " [cortado]"


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    caminho = Path(sys.argv[1])
    if not caminho.exists():
        print(f"Arquivo não encontrado: {caminho}")
        return 2
    bruto = caminho.read_text(encoding="utf-8", errors="replace")
    eh_html = caminho.suffix.lower() in (".html", ".htm") or bool(re.search(r"(?i)<(html|body|p|div)\b", bruto))

    achados_b, achados_r, extras = [], [], []
    prosa = None
    if eh_html:
        leitor = Leitor()
        leitor.feed_all(bruto)
        visivel = linhas_de(html.unescape("".join(leitor.partes)))
        checar_linhas(visivel, "texto", achados_b, achados_r)
        checar_linhas([t for _, t in leitor.fora_da_pagina], "fora da página", achados_b, achados_r)

        for tag, texto in leitor.botoes:
            if texto and BOTAO_PROIBIDO.search(sem_acento(texto)):
                achados_b.append(("texto de botão proibido (10.9)", tag, texto))

        listas = [n for n in leitor.listas_fechadas if n > 0]
        if listas:
            tres = sum(1 for n in listas if n == 3)
            if tres * 2 > len(listas):
                extras.append(f"REVISAR  tríade: {tres} de {len(listas)} listas têm exatamente 3 itens. Quebre algumas.")
        total_chars = sum(len(l) for l in visivel) or 1
        pct_negrito = 100 * leitor.chars_negrito / total_chars
        if pct_negrito > 8:
            extras.append(f"REVISAR  negrito em {pct_negrito:.1f}% do texto. Teto: 8%.")
        prosa = leitor.prosa
        longos = [p for p in leitor.paragrafos if len(p.split()) > 70]
        for p in longos[:5]:
            extras.append(f"REVISAR  parágrafo com {len(p.split())} palavras (máximo 70): {cortar(p)}")
    else:
        visivel = linhas_de(bruto)
        checar_linhas(visivel, "texto", achados_b, achados_r)

    # -----------------------------------------------------------------------
    print(f"\nArquivo: {caminho}")
    print("=" * 60)
    if achados_b:
        print(f"\nBLOQUEIA ({len(achados_b)})")
        for nome, origem, l in achados_b:
            print(f"  [x] {nome}  [{origem}]\n      {cortar(l)}")
    else:
        print("\nBLOQUEIA: nenhuma ocorrência.")

    if achados_r:
        print(f"\nREVISAR ({len(achados_r)})")
        for nome, origem, l in achados_r:
            print(f"  [!] {nome}  [{origem}]\n      {cortar(l)}")
    for e in extras:
        print("  " + e)

    # ritmo só em prosa: rótulo, botão e célula de tabela não são frase
    frases = frases_de(prosa if prosa is not None else visivel)
    if len(frases) >= 5:
        n = [len(f.split()) for f in frases]
        curtas = sum(1 for x in n if x < 8)
        acima22 = sum(1 for x in n if x > 22)
        acima25 = [f for f in frases if len(f.split()) > 25]
        media = statistics.mean(n)
        print("\nRITMO")
        print(f"  frases: {len(n)}  média: {media:.1f}  mediana: {statistics.median(n)}  "
              f"curtas (<8): {curtas} ({100 * curtas / len(n):.0f}%)  acima de 22: {acima22}")
        if not 12 <= media <= 18:
            print("  [!] média fora da faixa de 12 a 18 palavras por frase")
        if curtas / len(n) < 0.10 and acima22 == 0:
            print("  [!] ritmo uniforme demais: menos de 10% de frases curtas e nenhuma acima de 22 palavras")
        for f in acima25[:5]:
            print(f"  [!] frase com {len(f.split())} palavras (máximo 25): {cortar(f)}")

    print()
    if achados_b:
        print(f"REPROVADO: {len(achados_b)} ocorrência(s) bloqueante(s).")
        return 1
    print("APROVADO nas regras bloqueantes. Leia os itens REVISAR antes de entregar.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
