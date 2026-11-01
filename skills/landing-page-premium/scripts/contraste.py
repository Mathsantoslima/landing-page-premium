#!/usr/bin/env python3
"""
contraste.py

Mede contraste WCAG 2.2 (seções 13.1 e 17.4 da skill). Só usa a biblioteca padrão do Python 3.8+.

Dois modos:

    python3 contraste.py "#5B6D71" "#F2F5F4"
        mede um par: primeiro a cor do texto, depois a do fundo

    python3 contraste.py tokens.css
        lê os tokens hexadecimais do :root e mede os pares que o portão 4 exige
        (texto, secundário e título sobre os fundos; texto do botão sobre a cor de ação;
        borda de foco e cor de sinal como componente de interface)

Limites:
    texto normal 4,5:1 | texto grande 3:1 | componente de interface e foco 3:1

Sai com código 1 se algum par obrigatório reprovar.
"""

import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


def hx(h):
    h = h.strip().lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) != 6 or not re.fullmatch(r"[0-9a-fA-F]{6}", h):
        raise ValueError(f"cor inválida: #{h}")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def lum(c):
    def f(v):
        v = v / 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = map(f, c)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contraste(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True)
    return (la + 0.05) / (lb + 0.05)


def veredito(ratio):
    return {
        "texto normal (4,5:1)": ratio >= 4.5,
        "texto grande (3:1)": ratio >= 3.0,
        "interface e foco (3:1)": ratio >= 3.0,
    }


# (texto, fundo, limite, papel). Pares ausentes no arquivo são pulados.
PARES = [
    ("--text", "--bg", 4.5, "corpo sobre o fundo"),
    ("--text", "--panel", 4.5, "corpo sobre o painel"),
    ("--muted", "--bg", 4.5, "secundário sobre o fundo"),
    ("--muted", "--panel", 4.5, "secundário sobre o painel"),
    ("--ink", "--bg", 4.5, "título sobre o fundo"),
    ("--ink", "--panel", 4.5, "título sobre o painel"),
    ("--on-action", "--action", 4.5, "texto do botão sobre a cor de ação"),
    ("--action", "--bg", 3.0, "botão como componente sobre o fundo"),
    ("--foco", "--bg", 3.0, "indicador de foco sobre o fundo"),
    ("--accent", "--bg", 3.0, "cor de sinal em gráfico ou estado"),
    ("--danger", "--bg", 4.5, "texto de erro sobre o fundo"),
]


def tokens_de(css):
    raiz = "\n".join(re.findall(r":root\s*\{([^}]*)\}", css, flags=re.S)) or css
    tokens = {}
    for nome, valor in re.findall(r"(--[\w-]+)\s*:\s*([^;]+);", raiz):
        m = re.search(r"#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b", valor)
        if m:
            tokens[nome] = m.group(0)
    # texto do botão: se não houver token próprio, assume branco, que é o padrão da seção 5.1
    tokens.setdefault("--on-action", tokens.get("--white", "#ffffff"))
    return tokens


def modo_par(texto, fundo):
    r = contraste(hx(texto), hx(fundo))
    print(f"{texto} sobre {fundo}: {r:.2f}:1")
    for nome, ok in veredito(r).items():
        print(f"  {'passa' if ok else 'REPROVA'}  {nome}")
    return 0 if r >= 4.5 else 1


def modo_arquivo(caminho):
    tokens = tokens_de(Path(caminho).read_text(encoding="utf-8"))
    if not tokens:
        print("Nenhum token hexadecimal encontrado no :root.")
        return 2
    falhas = 0
    medidos = 0
    print(f"Tokens lidos: {len(tokens)}\n")
    for a, b, limite, papel in PARES:
        if a not in tokens or b not in tokens:
            continue
        medidos += 1
        r = contraste(hx(tokens[a]), hx(tokens[b]))
        ok = r >= limite
        falhas += 0 if ok else 1
        marca = "ok " if ok else "[x]"
        print(f"{marca} {r:5.2f}:1  exige {limite}:1  {a} {tokens[a]} sobre {b} {tokens[b]}  ({papel})")
    if not medidos:
        print("Nenhum par conhecido. Use os nomes de token da seção 4.1 ou meça par a par.")
        return 2
    print()
    print(f"REPROVADO: {falhas} par(es) abaixo do limite." if falhas else "APROVADO: todos os pares medidos passam.")
    print("Lembrete: cor translúcida, gradiente e imagem se medem no pixel renderizado (seção 13.1).")
    return 1 if falhas else 0


def main():
    args = sys.argv[1:]
    try:
        if len(args) == 2:
            return modo_par(*args)
        if len(args) == 1 and Path(args[0]).exists():
            return modo_arquivo(args[0])
    except ValueError as e:
        print(e)
        return 2
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main())
