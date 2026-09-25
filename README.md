# Marta Sousa Terapias — Website

Site estático (HTML + CSS + JS, sem dependências) criado a partir do briefing de 24/09/2026.

## Estrutura

```
index.html            Início
servicos.html         Serviços (duração e formato das sessões)
faq.html              Perguntas frequentes
contacto.html         Contacto + mapa + formulário
marcacao.html         Marcação / reserva online
area-clientes.html    Área de clientes (com código de acesso)
en/                   Versão em inglês das 6 páginas
css/style.css         Estilos (paleta branco · lilás #A78BFA · negro)
js/config.js          >>> PERSONALIZE AQUI <<<
js/main.js            Lógica (menu, marcação, área de clientes)
images/               Fotografias reais da Marta e do espaço (marta-*.jpg,
                    principios-reiki.jpg) + ambiente (g2/g4/g5). As
                    variantes responsivas (ex.: marta-sobre-480.jpg) são
                    geradas por tools/make-responsive-images.sh
tools/                Scripts auxiliares (imagens responsivas + srcset)
favicon.svg           Ícone
.nojekyll             GitHub Pages (serve os ficheiros tal como estão)
```

## O que já funciona

- **Marcação online**: o formulário prepara automaticamente uma mensagem de
  WhatsApp com todos os dados (nome, serviço, data, hora…). A Marta só tem de
  enviar a mensagem para validar o pedido, e responde ao cliente para
  confirmar a disponibilidade. Há também opção de enviar por email.
- **Área de Clientes**: com código de acesso (atualmente `MS2026`), mostra
  os pedidos de marcação feitos naquele dispositivo (localStorage), com
  botão de reenviar no WhatsApp e de remover. Inclui dicas de preparação
  da sessão e de autocuidado.
- **Botão WhatsApp** flutuante em todas as páginas + WhatsApp no rodapé
  e na página de contacto.
- **Mapa** Google (Vila Nova de Gaia) na página de contacto.
- **Versão em inglês** completa, com alternância PT ⇄ EN no cabeçalho.
- **Formulário de contacto** (abre email pronto a enviar; alternativa por WhatsApp).
- **Imagens responsivas**: cada fotografia tem variantes de largura mais
  pequena (geradas por `tools/make-responsive-images.sh`) e é servida em
  `srcset`/`sizes` com `width`/`height` declarados — o telemóvel descarrega
  ficheiros muito mais leves e não há saltos de layout durante o carregamento.
- SEO básico: meta tags, Open Graph e dados estruturados (LocalBusiness) na página inicial.
- Nota legal no rodapé: "As terapias holísticas têm caráter complementar e não substituem o acompanhamento médico."

## O que personalizar ANTES de publicar

Tudo o que é indicado está marcado com `TODO` em **`js/config.js`**:

1. **Código da Área de Clientes** (`clientCode`) — o código atual é `MS2026`.
   É lido de `js/config.js` em sítos únicos: a validação na Área de Clientes e
   o texto da página de marcação. Partilhe-o com as clientes quando confirma
   a marcação; cada pedido recebe também o seu próprio código (ex.: `MS4821`).
2. **Redes sociais** (`instagram`, `facebook`) — substitua pelos perfis reais (também nas páginas, onde aparecem diretamente nos links).
3. **Endereço / mapa** — quando quiser mostrar a localização exata, edite:
   - `address` e `mapQuery` em `js/config.js`
   - o `src` do `<iframe>` em `contacto.html` (e `en/contact.html`), ex.:
     `https://www.google.com/maps?q=Rua+Exemplo,+123,+Vila+Nova+de+Gaia&output=embed`
4. **Preços** — *desativados por agora*. Os blocos de valor foram retirados de
   `servicos.html` / `en/services.html` (essas páginas mostram apenas duração e
   formato) e `showPrices` está a `false` em `js/config.js`, pelo que o preço
   também não aparece no dropdown do formulário de marcação. Os valores
   (50€/35€/35€/70€) continuam guardados no campo `price` de cada serviço em
   `js/config.js` — para voltar a mostrá-los, reponha o markup dos preços nas
   duas páginas de serviços e mude `showPrices` para `true`. As classes
   `.price-row`, `.price-tag`, `.price-note` e `.price-table` continuam
   disponíveis em `css/style.css`.
5. **Logótipo** — o cabeçalho e o rodapé usam o emblema oficial em
   `images/logo.jpeg` (56 px no cabeçalho · 84 px no rodapé; ver `.brand-mark`
   em `css/style.css`). Para trocar pelo ficheiro original, basta substituir
   `images/logo.jpeg` mantendo o nome.
6. **Horários** — "segunda a sábado, por marcação" e as horas do formulário são
   por defeito; confirme se corresponde à sua disponibilidade. As horas do
   dropdown vêm de `timeSlots` em `js/config.js`.

## Como publicar (gratuito) — GitHub Pages

O site está preparado para o **GitHub Pages** (ficheiro `.nojekyll` incluído;
todos os caminhos de imagens/CSS/JS são relativos, por isso funciona também em
`https://<utilizador>.github.io/martasousaterapias/`).

Para ativar (uma só vez, no GitHub):
1. Abra o repositório → **Settings** → **Pages**
2. Em **Source** escolha **Deploy from a branch**
3. Escolha a branch com o conteúdo do site (ex.: `main` após aceitar o pull
   request, ou a branch de trabalho) e pasta **/ (root)** → **Save**
4. Ao fim de 1–2 minutos o site fica online em
   `https://benmrodrigues2000.github.io/martasousaterapias/`
   (o endereço exato aparece em Settings → Pages)

> O GitHub Pages gratuito exige que o repositório esteja **público**
> (Settings → General → Danger Zone → Change visibility → Public).

Alternativas equivalentes: Netlify (arrastar a pasta para
https://app.netlify.com/drop), Vercel ou Cloudflare Pages.

> Nota: o domínio `.pt` pode ser registado em registos.pt; os domínios
> `.com`/`.pt` podem ser obtidos em registadores como IONOS, OVH ou 19A.
>
> Se passar para um domínio próprio, atualize também `og:url` e `og:image`
> em `index.html` e `en/index.html` (hoje apontam para o GitHub Pages).

## Como funciona a marcação (resumo)

1. O cliente preenche o formulário em **Marcar sessão**.
2. O site abre o WhatsApp com a mensagem já escrita (dados + serviço + data).
3. A Marta envia a mensagem → confirma disponibilidade → a marcação está feita.
4. O pedido fica guardado no telemóvel/computador do cliente, visível na
   **Área de Clientes** (com o código partilhado pela Marta).

> Se mais à frente quiser marcações 100% automáticas (agenda com bloqueio de
> horários, lembretes, etc.), o próximo passo é ligar o site a uma ferramenta
> como o Calendly ou a um pequeno backend com base de dados. O formulário
> atual já foi preparado para facilitar essa transição.

## Testes rápidos

- Abrir `index.html` no navegador: navegação, botões, FAQ.
- Marcar sessão: preencher e submeter → deve abrir o WhatsApp com a mensagem.
- Área de Clientes: código `MS2026` (ou o que definir em `config.js`).
- Alternância PT ⇄ EN nos cabeçalhos.
