# Landing page — Imersão: planejamento sucessório e proteção patrimonial

Página estática em Next.js + TypeScript + Tailwind CSS. Sem banco de dados, login, formulários ou coleta de dados pessoais.

## Onde editar

Todo o conteúdo editável fica em **`src/config/evento.ts`**.

| O quê | Campo |
| --- | --- |
| **Link de inscrição** | `registrationUrl` |
| Nome e descrição | `name`, `theme`, `description` |
| Data e horário | `date`, `time` |
| Local | `venue`, `address`, `city` |
| Preço e inclusões | `price`, `priceNote`, `inclusions` |
| Palestrantes | `speakers` (fotos em `public/palestrantes/`) |
| Formato e programação | `format`, `schedule` |
| Depoimentos e fotos de outras edições | `testimonials`, `pastEventPhotos` |
| Logo do evento | `logo`, `logoAlt` (arquivo em `public/`) |
| Realização e contatos | `organizer`, `organizerLogo`, `organizerUrl`, `contacts` |
| Perguntas frequentes | `faq` |

Campos vazios não aparecem na página. A seção de palestrantes/realização fica oculta até receber dados reais.

## Ativar as inscrições

Preencha apenas:

```ts
registrationUrl: "https://seu-link-de-inscricao",
```

- Com o campo vazio, o botão final “Realizar inscrição” abre um aviso de que as inscrições ainda não estão disponíveis.
- Com um endereço `http(s)` válido, o mesmo botão leva direto ao link.
- Todos os outros botões da página levam à seção `#inscricao`.

## Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm run typecheck
```

A fonte Manrope (licença OFL) vem do pacote `@fontsource-variable/manrope` e é servida pelo próprio site.
