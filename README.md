# Marta Sousa Terapias — Website

Site estático (HTML + CSS + JS, sem dependências) criado a partir do briefing de 24/09/2026.

## Estrutura

```
index.html            Início
servicos.html         Serviços + preços
faq.html              Perguntas frequentes
contacto.html         Contacto + mapa + formulário
marcacao.html         Marcação / reserva online
area-clientes.html    Área de clientes (com código de acesso)
en/                   Versão em inglês das 6 páginas
css/style.css         Estilos (paleta branco · lilás #A78BFA · negro)
js/config.js          >>> PERSONALIZE AQUI <<<
js/main.js            Lógica (menu, marcação, área de clientes)
images/               Imagens (hero, sobre, g1–g5)
favicon.svg           Ícone
```

## O que já funciona

- **Marcação online**: o formulário prepara automaticamente uma mensagem de
  WhatsApp com todos os dados (nome, serviço, data, hora…). A Marta só tem de
  enviar a mensagem para validar o pedido, e responde ao cliente para
  confirmar a disponibilidade. Há também opção de enviar por email.
- **Área de Clientes**: com código de acesso (atualmente `MARTA2026`), mostra
  os pedidos de marcação feitos naquele dispositivo (localStorage), com
  botão de reenviar no WhatsApp e de remover. Inclui dicas de preparação
  da sessão e de autocuidado.
- **Botão WhatsApp** flutuante em todas as páginas + WhatsApp no rodapé
  e na página de contacto.
- **Mapa** Google (Vila Nova de Gaia) na página de contacto.
- **Versão em inglês** completa, com alternância PT ⇄ EN no cabeçalho.
- **Formulário de contacto** (abre email pronto a enviar; alternativa por WhatsApp).
- SEO básico: meta tags, Open Graph e dados estruturados (LocalBusiness) na página inicial.
- Nota legal no rodapé: "As terapias holísticas têm caráter complementar e não substituem o acompanhamento médico."

## O que personalizar ANTES de publicar

Tudo o que é indicado está marcado com `TODO` em **`js/config.js`**:

1. **Código da Área de Clientes** (`clientCode`) — escolha um código só seu (ex.: `MS-2026`) e partilhe-o com as clientes quando confirmam a marcação.
2. **Redes sociais** (`instagram`, `facebook`) — substitua pelos perfis reais (também nas páginas, onde aparecem diretamente nos links).
3. **Endereço / mapa** — quando quiser mostrar a localização exata, edite:
   - `address` e `mapQuery` em `js/config.js`
   - o `src` do `<iframe>` em `contacto.html` (e `en/contact.html`), ex.:
     `https://www.google.com/maps?q=Rua+Exemplo,+123,+Vila+Nova+de+Gaia&output=embed`
4. **Preços** — os valores (50€/35€/35€/70€) são indicativos. Ajuste em
   `servicos.html` e `en/services.html` (textos dos serviços + tabela de preços),
   e também nos `<option>` de `marcacao.html` / `en/booking.html`.
5. **Logótipo** — o cabeçalho usa um logótipo tipográfico (lotus + "Marta Sousa
   Terapias") como provisório. Para usar o logótipo próprio, substitua o bloco
   `<svg class="brand-mark">…</svg>` por
   `<img class="brand-mark" src="images/logo.png" alt="Marta Sousa Terapias">`
   (coloque o ficheiro em `images/` e, se quiser, reduza a altura em `css/style.css`).
6. **Horários** — "segunda a sábado, por marcação" e as horas do formulário são
   por defeito; confirme se corresponde à sua disponibilidade.

## Como publicar (gratuito)

Opção mais simples — **Netlify** (sem precisar de programar):
1. Crie uma conta gratuita em https://www.netlify.com
2. Arraste a pasta inteira do site para https://app.netlify.com/drop
3. Pronto — o site fica online com um endereço `https://….netlify.app`
4. (Opcional) ligue um domínio próprio, ex. `martasousaterapias.pt`

Alternativas equivalentes: GitHub Pages, Vercel ou Cloudflare Pages
(também com arrastar e largar / upload da pasta).

> Nota: o domínio `.pt` pode ser registado em registos.pt; os domínios
> `.com`/`.pt` podem ser obtidos em registadores como IONOS, OVH ou 19A.

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

- Abrir `index.html` no navegador: navegação, botões, galeria, FAQ.
- Marcar sessão: preencher e submeter → deve abrir o WhatsApp com a mensagem.
- Área de Clientes: código `MARTA2026` (ou o que definir em `config.js`).
- Alternância PT ⇄ EN nos cabeçalhos.
