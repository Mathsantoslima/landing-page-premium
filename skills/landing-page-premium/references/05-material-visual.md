> Referência da skill `landing-page-premium`. O processo, os portões e as regras anti-slop estão no `SKILL.md`. A numeração das seções é a mesma em todos os arquivos.

## 7. Material visual próprio

Esta é a seção que mais separa o resultado de um template. **Nenhuma imagem vem de banco. Nenhuma vem de gerador de IA.**

### 7.0 Derive da marca, não do exemplo

O material visual da página precisa nascer da identidade recebida no portão 1. As técnicas abaixo são o catálogo de **como produzir**. O que elas produzem sai da marca do projeto.

**Leia o material de marca procurando por:**

| O que procurar | O que vira na página |
|---|---|
| Forma recorrente no logotipo (curva, ângulo, corte, repetição) | Geometria da ilustração técnica e dos ícones |
| Padrão gráfico ou textura já existente | Base da textura de fundo, refeita em alta resolução e na paleta |
| Grade, listra, pontilhado ou trama do material impresso | Trama de fundo, máscara e divisor entre seções |
| Ângulo característico (diagonal, isométrico, ortogonal) | Ângulo das composições e da ilustração |
| Tratamento de imagem do material (duotono, recorte, moldura) | Tratamento das telas de produto e das fotos |
| Vocabulário de forma (pontas vivas ou arredondadas) | Raio dos cartões, terminação dos traços dos ícones |
| Densidade do material (respirado ou cheio) | Espaçamento e densidade das seções |

**Exemplo de derivação.** Se o logotipo tem um corte em 30 graus, esse ângulo passa a reger a máscara da textura, a inclinação da ilustração e o recorte das imagens. A página inteira passa a conversar com a marca sem precisar repetir o logotipo em todo lugar.

**Se a marca não tiver grafismo próprio**, proponha criar um: uma forma simples derivada do logotipo ou do conceito do negócio, aplicada de forma consistente. Isso vira ativo da marca, não só enfeite da página.

**Regra:** antes de gerar qualquer textura, escreva numa linha de onde ela vem. Se a resposta for "achei bonita", está errado. Se for "é a trama do material impresso, refeita na paleta", está certo.

#### Método de derivação em 6 passos

1. **Inventário de formas.** Abra o logotipo em vetor e liste: ângulos presentes, raio de canto, espessura de traço, terminação (reta, arredondada ou chanfrada), proporção do contraforma.
2. **Isole um atributo dominante.** Se o logotipo tem um corte a 18 graus, 18 graus passa a ser o ângulo da marca. Toda hachura, gradiente linear e divisor usa esse ângulo.
3. **Reduza ao módulo mínimo.** Pegue o menor fragmento reconhecível do símbolo: um arco, um chanfro, um ponto. **Repetir o logotipo inteiro como padrão é amadorismo** e desgasta a marca.
4. **Defina o ritmo pela grade tipográfica.** Se a base é 8 px, use blocos de 16, 24, 32 ou 48 px. O fundo encaixa no texto sem ninguém perceber por quê.
5. **Escalone em três densidades:** fundo de seção com bloco de 16 px e 6% de opacidade; cartão com 32 px e 10%; topo e peça social com 96 a 160 px e 14%.
6. **Transforme em token:** `--pattern-angle`, `--pattern-tile`, `--pattern-ink`, `--pattern-alpha`. Nenhuma tela monta padrão solto.

**Teste de aprovação:** cubra o logotipo e mostre só o grafismo a alguém que conhece a marca. Se a pessoa não reconhecer, o grafismo ainda é genérico.

#### Catálogo de dispositivos gráficos

Escolha **um** e repita com disciplina. Identidade vem de repetição, não de variedade.

| Dispositivo | Caráter | Como produzir | Custo |
|---|---|---|---|
| Grade de blueprint | Engenharia, precisão, infraestrutura | Dois `linear-gradient` cruzados com `background-size` | muito baixo |
| Malha de pontos | Técnico e leve | `radial-gradient` com `background-size` | muito baixo |
| Linhas paralelas | Ritmo, movimento, dado | `repeating-linear-gradient` | muito baixo |
| Hachura diagonal | Área marcada, atenção | `repeating-linear-gradient(45deg, …)` | muito baixo |
| Grão | Materialidade, e mata banding | `feTurbulence` com mesclagem | baixo |
| Aurora e orbes | Atmosfera e profundidade no escuro | Divisões com `filter: blur()` | baixo |
| Gradiente em malha | Suavidade, energia | Vários `radial-gradient` sobrepostos | baixo a alto |
| Forma do logotipo | Identidade pura, a mais defensável | `<pattern>` em SVG com o módulo mínimo | médio |
| Topografia | Território, exploração, dado geográfico | SVG gerado a partir de ruído | médio |
| Meio-tom | Impresso, editorial, retrô técnico | Padrão SVG ou canvas | médio |
| Duotono | Unifica fotos heterogêneas na paleta | `feColorMatrix` | baixo |
| Isométrico técnico | Arquitetura de sistema | SVG com matriz isométrica | alto |
| Partículas | Rede, conexão, tempo real | Canvas 2D | médio |

**Regra de escolha:** o grafismo precisa ser um argumento sobre o produto, não enfeite. Infraestrutura pede grade ou isométrico. Dados pedem mapa de calor ou partículas. Ferramenta de desenvolvedor pede terminal ou pixel. Serviço humano pede traço desenhado.

#### Receita de grão, que resolve o banding

Gradiente longo sem grão produz faixas visíveis em tela de 8 bits. Esta é a correção:

```html
<svg width="0" height="0" aria-hidden="true">
  <filter id="grain" color-interpolation-filters="sRGB" x="0" y="0" width="1" height="1">
    <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="3" seed="7" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="linear" slope="0.35"/></feComponentTransfer>
  </filter>
</svg>
```
```css
.grain::after{content:"";position:absolute;inset:0;pointer-events:none;
  filter:url(#grain);opacity:.35;mix-blend-mode:overlay;background:#808080}
```

| Parâmetro | Faixa útil |
|---|---|
| `baseFrequency` | 0,6 a 0,9 para grão fino. 0,15 a 0,35 para nuvem |
| `numOctaves` | 3 é o ponto de equilíbrio. Acima de 4 custa sem ganho |
| `seed` | Troque por seção, para não repetir o mesmo desenho |
| `stitchTiles` | `stitch`, obrigatório quando houver repetição |
| Opacidade final | 0,03 a 0,08 sobre cor chapada |

**Desempenho:** filtro SVG é recalculado a cada repintura. Nunca anime um elemento filtrado, e se a área passar de uma tela, troque por um WebP de 256 × 256 repetido.

#### Gradiente em malha que não parece amador

```css
.mesh{background:
  radial-gradient(60% 45% at 18% 12%, var(--c1), transparent 65%),
  radial-gradient(50% 40% at 82%  8%, var(--c2), transparent 60%),
  radial-gradient(70% 55% at 55% 85%, var(--c3), transparent 70%),
  var(--bg)}
```

Seis decisões que separam o bom do amador:

1. Três ou quatro pontos, nunca oito. Mais que isso vira lama.
2. Matizes vizinhos, com variação de até 40 graus. Cores complementares se anulam no meio e sujam.
3. Elipses, não círculos. Círculo perfeito denuncia que é CSS.
4. Pelo menos um ponto fora da tela, para o olho não achar o centro.
5. Sempre sobre uma cor base sólida, com opacidade abaixo de 0,6.
6. Grão por cima, obrigatório.

#### Três regras de ouro

1. **Use máscara.** `mask-image` radial dissolve o grafismo onde o texto começa. É a técnica que mais evita o padrão competir com a leitura.
2. **Asse o que for caro.** Grafismo que não reage ao usuário deve ser renderizado fora e exportado em WebP. Um arquivo de 80 KB custa menos que um canvas a 60 quadros por segundo. As páginas de maior acabamento do mercado fazem exatamente isso.
3. **Um dispositivo por página.** Dois já é colagem.

#### Erros que denunciam amadorismo

| Erro | Correção |
|---|---|
| Faixas no gradiente | Grão de 3 a 6% por cima |
| Moiré | Evite período menor que 2 px. Teste em tela não retina |
| Densidade errada | Escalone por contexto, conforme o passo 5 |
| Padrão forte demais | Teto de 15% de opacidade. Fundo é fundo |
| Padrão atrás de parágrafo | Máscara abrindo clareira na área de leitura |
| Repetição visível | Bloco maior, semente variada, ou gradiente por cima |
| Logotipo repetido como padrão | Use o módulo mínimo |
| Arquivo pesado demais | Repetir um bloco pequeno em vez de uma imagem grande |
| Misturar dialetos | Um ângulo, uma espessura, um sistema |
| Gradiente roxo para azul | Proibido pela seção 1 |

**Modo escuro:** defina o grafismo com `currentColor` ou `color-mix` sobre token. No escuro, a mesma opacidade aparenta mais contraste, então reduza para cerca de 60% do valor usado no claro.

### 7.1 Texturas procedurais

Gere a textura por código, **na paleta do projeto e com a geometria derivada da marca** (ver 7.0). Ela nasce na cor certa, pode ser refeita em qualquer tamanho e não existe em nenhum outro site.

Receita com ruído fractal (Python, NumPy e Pillow; instale com `pip install numpy pillow`):

```python
import numpy as np
from PIL import Image

def noise(w, h, cell, seed):
    """Ruído suave: grade aleatória ampliada com interpolação bicúbica."""
    r = np.random.default_rng(seed)
    gw, gh = max(2, w // cell + 3), max(2, h // cell + 3)
    small = r.random((gh, gw)).astype(np.float32)
    big = Image.fromarray(small, 'F').resize((gw * cell, gh * cell), Image.BICUBIC)
    return np.clip(np.asarray(big, dtype=np.float32)[:h, :w], 0, 1)

def fbm(w, h, base, octaves, seed):
    """Soma de oitavas: cada uma com metade da amplitude e o dobro da frequência."""
    acc, amp, tot = np.zeros((h, w), np.float32), 1.0, 0.0
    for o in range(octaves):
        acc += amp * noise(w, h, max(4, base // (2 ** o)), seed + o * 17)
        tot += amp; amp *= 0.5
    return acc / tot

def pinta(campo, escuro, claro, caminho):
    """Mapeia o campo de 0 a 1 entre duas cores da paleta e salva. WebP ou PNG."""
    hx = lambda h: np.array([int(h.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4)], np.float32)
    a, b = hx(escuro), hx(claro)
    rgb = (a + (b - a) * campo[..., None]).astype(np.uint8)
    Image.fromarray(rgb, 'RGB').save(caminho, quality=82)

# exemplo: textura de topo nas cores do projeto, não nas deste exemplo
# pinta(fbm(1600, 900, 160, 5, seed=7), '#102B32', '#1F6F66', 'textura-topo.webp')
```

Catálogo de técnicas. Escolha pelo caráter da marca, não por gosto:

| Técnica | Caráter que transmite | Uso típico |
|---|---|---|
| Seda: ruído fractal com distorção de domínio e realce especular | Fluidez, sofisticação, cuidado | Moldura de telas de produto |
| Grão: gradiente radial sobre base escura com granulação | Profundidade, densidade, seriedade | Cartões e seções escuras |
| Pixel quantizado com matriz de Bayer | Técnico, digital, retrô controlado | Fundo de topo, pé de seção |
| Trama geométrica derivada do logotipo | Pertencimento à marca | Divisor, fundo de painel |
| Linhas finas paralelas com máscara radial | Precisão, engenharia | Brilho atrás de título em destaque |
| Papel ou tecido por ruído de alta frequência | Artesanal, humano, tátil | Marca calorosa ou editorial |
| Mapa de contorno ou topografia por ruído | Exploração, dado, território | Produto de dados ou logística |

Uma ou duas técnicas por página. Mais que isso vira colagem.

**Distorção de domínio** é o que transforma ruído comum em seda: amostre o ruído em coordenadas deslocadas por outro ruído.

**Quantização de Bayer** produz estética de pixel sem parecer imagem de baixa resolução:

```python
BAYER = np.array([[0,32,8,40,2,34,10,42],[48,16,56,24,50,18,58,26],
                  [12,44,4,36,14,46,6,38],[60,28,52,20,62,30,54,22],
                  [3,35,11,43,1,33,9,41],[51,19,59,27,49,17,57,25],
                  [15,47,7,39,13,45,5,37],[63,31,55,23,61,29,53,21]], np.float32) / 64.0
```

**Alternativa em CSS puro** quando não houver Python: grão com `feTurbulence` em SVG como data URI, sobre o gradiente, com `opacity` entre 0,04 e 0,08 e `mix-blend-mode: overlay`. Resolve o banding do gradiente e dá textura.

### 7.2 UI do produto recriada em HTML

Para mostrar o produto, **recrie a interface em HTML e fotografe**, em vez de usar captura de tela.

Vantagens concretas:

- Nítida em qualquer densidade, porque é texto e vetor.
- Herda os tokens do projeto, inclusive tema escuro.
- Cada parte é animável separadamente.
- Leve, em KB e não em MB.
- Atualizar um número é editar uma string, não reexportar.

Processo: monte a tela em HTML num arquivo separado, renderize em 1320 × 825 com densidade 2× em navegador controlado, exporte em WebP e gere também recortes para o celular.

**Honestidade obrigatória:** a recriação precisa ser fiel ao produto real. Nunca invente funcionalidade. Use dados fictícios coerentes e avise na página que os dados são de demonstração.

### 7.3 Ilustração técnica em SVG

Para explicar um conceito ou método, gere uma ilustração em traço, por código. Vantagem: a geometria fica correta de verdade. Se são engrenagens, calcule a fase dos dentes para que encaixem. Se é um fluxo, calcule os pontos de conexão.

Ilustração gerada por código também pode ser animada peça por peça no navegador.

### 7.4 Imagem de compartilhamento

Composição de 1200 × 630, conceitual, com os elementos da identidade: ilustração, textura e tipografia do sistema. Não use captura de tela.

**Dois detalhes que costumam falhar:**

1. O endereço em `og:image` precisa ser absoluto, com `https://`.
2. Ao trocar a imagem, **mude o nome do arquivo**, porque aplicativos de mensagem guardam a prévia em cache por dias.
