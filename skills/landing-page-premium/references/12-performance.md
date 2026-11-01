> Referência da skill `landing-page-premium`. O processo, os portões e as regras anti-slop estão no `SKILL.md`. A numeração das seções é a mesma em todos os arquivos.

## 14. Performance

### 14.1 Métricas

| Métrica | Bom | Meta interna |
|---|---|---|
| LCP (carregamento) | 2,5 s | menos de 2,0 s |
| INP (resposta) | 200 ms | menos de 150 ms |
| CLS (estabilidade) | 0,1 | menos de 0,05 |

### 14.2 Orçamento

| Item | Alvo |
|---|---|
| Peso da primeira visualização | 500 KB a 1 MB |
| HTML | 50 KB, ou mais se o CSS estiver embutido |
| Imagem do topo | 150 a 200 KB |
| Famílias de fonte | 1 ou 2, com 3 pesos |
| Requisições na primeira visualização | até 40 |

### 14.3 Regras que mais pesam

**Carregamento:**

- A imagem do topo precisa estar no HTML inicial, como `<img src>`. Imagem de fundo em CSS atrasa a descoberta.
- `fetchpriority="high"` na imagem do topo, em no máximo uma ou duas imagens.
- **Nunca** `loading="lazy"` na imagem do topo. É o erro mais comum.
- `loading="lazy"` e `decoding="async"` em tudo abaixo da dobra.

**Estabilidade:**

- `width` e `height` explícitos em **toda** imagem, vídeo e incorporação.
- Reserve espaço para qualquer coisa injetada depois.
- Nunca anime propriedades de layout. Anime apenas `transform` e `opacity`.

**Fontes:**

- Carregue só os pesos usados.
- Prefira hospedar a fonte no próprio domínio, com `preload` e `crossorigin`.
- Nunca `@import` dentro do CSS, porque serializa requisições.

**Imagens:** WebP, com AVIF quando possível. Densidade 2× no máximo.

### 14.4 Mídia pesada sem destruir o carregamento

Página de produto de alto acabamento usa vídeo, animação e textura. O conflito entre craft e performance é real, e tem solução conhecida. A medição de uma página de referência desse nível encontrou **cerca de 25 MB de mídia e nenhum `poster` em nenhum vídeo**: acabamento visual não veio acompanhado de disciplina técnica. Não repita isso.

#### Orçamento de LCP, que vira plano de trabalho

| Parte | Fatia ideal |
|---|---|
| Resposta do servidor | cerca de 40% |
| Atraso até começar a baixar o recurso | **menos de 10%** |
| Download do recurso | cerca de 40% |
| Atraso de renderização | **menos de 10%** |

O recurso de LCP precisa começar a carregar **junto com o primeiro recurso da página**. As duas fatias de 10% são onde quase todo mundo perde tempo sem perceber.

#### A regra que resolve vídeo no topo

**O pôster é o elemento de LCP. Sempre. O vídeo é melhoria progressiva.**

```html
<img src="poster.webp" fetchpriority="high" alt="" class="hero-poster">
<video preload="none" poster="poster.webp" muted loop playsinline></video>
```

```js
// só troca para carregamento completo quando o vídeo chega perto da tela
new IntersectionObserver(([e]) => {
  if (!e.isIntersecting) return;
  e.target.preload = 'auto';
  e.target.play();
}, { rootMargin: '200px' }).observe(video);

// dissolve o pôster no vídeo, em vez de mostrar indicador de carregamento
video.addEventListener('canplaythrough', () => { poster.style.opacity = 0; }, { once: true });

// obrigatório, e é o que a página medida não fez
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  video.remove();            // fica só o pôster
}
document.addEventListener('visibilitychange', () => {
  document.hidden ? video.pause() : video.play();
});
```

#### Compressão, com os números

| Formato | Peso típico de um laço de 10 s |
|---|---|
| GIF animado | 4 a 8 MB. **Nunca use** |
| MP4 1080p sem tratamento | 8 a 15 MB |
| Transmissão adaptativa, variante de celular | 400 a 800 KB |
| Transmissão adaptativa, variante de tela grande | 2 a 4 MB |

Dois comandos que levaram um arquivo de 26 MB em 5000 px para cerca de 290 KB e 260 KB:

```bash
ffmpeg -i in.mp4 -c:v libvpx-vp9 -crf 40 -vf scale=3840:-2 -deadline best -an out.webm
ffmpeg -i in.mp4 -c:v libx265 -crf 32 -vf scale=3840:-2 -preset veryslow -tag:v hvc1 -movflags faststart -an out.mp4
```

As três bandeiras que quase ninguém usa e são obrigatórias:

- `-an` remove a faixa de áudio vazia, que existe mesmo em vídeo mudo.
- `-movflags faststart` move o índice para o início do arquivo. **Num caso medido, só isso cortou 1,2 s do tempo até o primeiro quadro.**
- `-tag:v hvc1` é o que faz H265 tocar em iOS e macOS. Sem ela, a tela fica preta.

Os dois formatos juntos, VP9 e H265, cobrem a grande maioria dos navegadores. Para reduzir resolução sem parecer borrado em tela densa, acrescente `,unsharp=5:5:1.0` ao `scale`. Para vídeo controlado quadro a quadro pela rolagem, use `-g 1`.

Num caso de estúdio, sem fonte pública verificada, que vale como ordem de grandeza e não como promessa, partindo de um vídeo de 18 MB: carregamento de 4,7 s para 1,8 s, resposta de 320 ms para 175 ms, peso da página de 21,8 MB para 4,2 MB. Trocar o pôster de JPEG para WebP sozinho economizou cerca de 200 ms.

**Calibragem de mercado:** só 3% dos `<video>` da web têm pôster, e entre os que usam `<source>`, só 1 em 10 oferece mais de um formato (Web Almanac 2024, capítulo de mídia). O piso é baixo, e é fácil ficar muito acima dele.

#### Fontes

Uma fonte web pesa de 20 a 30 KB, e um conjunto de pesos e estilos chega a 150 KB.

- **Corte os subconjuntos que você não usa.** Manter só maiúsculas, minúsculas, números, pontuação e moeda costuma reduzir o arquivo a uma fração do completo; restringir aos caracteres efetivamente usados reduz ainda mais. Meça o seu antes e depois. Vale muito quando uma fonte de display aparece só no topo.
- **O deslocamento de layout causado por fonte não é problema de download.** É descasamento de métricas entre a fonte de reserva e a definitiva, e um servidor mais rápido não resolve. A correção é declarar a reserva com as métricas ajustadas:

```css
@font-face{
  font-family:'Reserva';
  src: local('Arial');
  ascent-override: ____%;
  descent-override: ____%;
  line-gap-override: 0%;
  size-adjust: ____%;    /* calcule com um gerador de métricas de reserva */
}
```

- `font-display`: `swap` troca assim que carrega; `fallback` desiste se a fonte não chegar em 3 s; `optional` só usa a fonte própria se ela chegar em 100 ms. Em página de marca, `swap` com métricas ajustadas é o padrão.

#### Animação vetorial e bibliotecas

**Animação exportada em JSON (Lottie) contra animação vetorial em tempo de execução (Rive)**, mesma peça, numa comparação publicada pela própria Rive em 2022: 181,7 KB contra 18 KB; memória de placa de vídeo de 149 a 190 MB contra 2,6 MB; processador de 91,8% contra 31,8%. A diferença é grande o bastante para mudar a decisão, mas a medição é do fabricante: refaça com a sua peça antes de escolher.

As três armadilhas do formato vetorial em tempo de execução:

1. O ambiente de execução pesa cerca de 78 KB e, por padrão, **vem de um servidor de terceiros**, não do seu domínio (dado de 2022). Hospede no próprio domínio e pré-carregue o binário junto com o arquivo do topo: no mesmo caso, o intervalo entre montar e animar caiu de 1000 ms para 30 ms.
2. Fora do topo, carregue por observador de interseção com limiar de 0,2 e margem de 200 px, disparo único, **sem montar o componente antes**, dentro de um invólucro com proporção fixa para não deslocar o layout.
3. **Não existe desfoque genérico.** Brilho e sombra suave só por *feathering*, disponível desde fevereiro de 2025. Se a direção de arte depende de luz complexa, um vídeo bem comprimido pode pesar menos.

**Biblioteca de rolagem suave: saiba o que você está comprando.** Ela move a rolagem da roda para a linha principal de execução. A rolagem nativa roda no compositor e continua andando mesmo com o JavaScript ocupado; com a biblioteca, **uma tarefa longa pausa a própria rolagem e todas as animações ligadas a ela**, inclusive as aceleradas por hardware. Some o fato de não funcionar com encaixe de rolagem e de travar a taxa de quadros em alguns navegadores. A alternativa que roda fora da linha principal são as animações nativas guiadas por rolagem (`animation-timeline: scroll()` e `view()`); a pegadinha é que `animation-timeline` não faz parte do atalho `animation` e precisa vir **depois** dele.

#### Dois ganhos baratos que quase ninguém usa

```css
/* página longa com muitas seções. Custo de renderização inicial medido
   no exemplo do web.dev: 232 ms para 30 ms. O conteúdo continua no DOM e na árvore de
   acessibilidade, ao contrário de esconder. */
.secao { content-visibility: auto; contain-intrinsic-size: auto 300px; }
```

```html
<!-- quem pediu menos movimento nem baixa o CSS de animação -->
<link rel="stylesheet" href="animacoes.css" media="(prefers-reduced-motion: no-preference)">
```

#### Se a página chegar a 3D

- Uma textura de 4096 por 4096 com mipmaps consome cerca de **90 MB de memória de vídeo**, independentemente do tamanho do arquivo. A conta é largura × altura × 4 × 1,333.
- O ajuste de maior retorno é **limitar a densidade de pixels a 2**: renderizar em 3× custa nove vezes o preenchimento de 1×, e a diferença visual entre 2× e 3× é desprezível.
- Degradação adaptativa (baixar a densidade quando a taxa de quadros cai) vale mais que otimização estática. E lembre que **o que roda a 60 quadros no início pode cair para 20 depois de 30 segundos**, por aquecimento do aparelho.

**A frase que encerra a discussão com o cliente:** vídeo no topo não é um material de design, é uma **decisão de arquitetura**. O vídeo não é inimigo das métricas; uma má implementação é.
