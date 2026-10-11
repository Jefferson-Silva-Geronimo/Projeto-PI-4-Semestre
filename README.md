# Projeto Integrador do 4º Semestre — Pet Shop

Aplicativo de pet shop com e-commerce de produtos (pagamento pelo Mercado Pago) e agendamento de serviços.

## O que o app faz

**Cliente**
- Cadastro, login, recuperação de senha e edição de perfil.
- Catálogo com busca, categorias e filtro por espécie; carrinho; checkout pelo Mercado Pago; acompanhamento de pedidos.
- Cadastro de pets, consulta de serviços e agendamento por pet, data e horário livre. O pagamento do serviço é feito na loja.
- Catálogo e sessão em cache local (SQLite), com aviso de offline.

**Administrador**
- Painel com pedidos aguardando, agendamentos do dia e produtos com estoque baixo.
- CRUD de produtos (inserir, alterar, inativar e excluir), de serviços e gestão de pedidos.
- Agenda do dia: confirmar, concluir ou cancelar atendimentos.

## Telas

- Autenticação: Login, Cadastro, Esqueci a senha, Redefinir senha.
- Cliente: Início/Catálogo, Detalhe do produto, Carrinho, Checkout, Pedidos, Detalhe do pedido, Serviços, Agendar serviço, Meus agendamentos, Meus pets, Cadastro/edição de pet, Perfil, Editar perfil.
- Admin: Painel, Produtos, Cadastrar produto, Editar produto, Pedidos, Detalhe do pedido, Serviços, Cadastro/edição de serviço, Agenda do dia.

## Como rodar

### Backend

```bash
cd backend
cp .env.example .env
npm install
docker compose up -d db
npx prisma migrate deploy
npx prisma generate
npm run dev
```

### Mobile

```bash
cd mobile
cp .env.example .env
npm install
npm start
```

## Variáveis de ambiente

Backend (`backend/.env`):

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL`, `DIRECT_URL` | Conexão com o PostgreSQL |
| `JWT_SECRET` | Segredo dos tokens JWT (mínimo 32 caracteres) |
| `JWT_EXPIRES_IN`, `CORS_ORIGIN`, `PORT` | Configuração da API |
| `MERCADOPAGO_ACCESS_TOKEN` | Token do Mercado Pago (use o de teste) |
| `MERCADOPAGO_RETURN_URL` | Deep link de retorno (`petshop://payment-return`) |
| `MERCADOPAGO_WEBHOOK_SECRET`, `MERCADOPAGO_WEBHOOK_URL` | Assinatura e URL pública do webhook |

Mobile (`mobile/.env`):

| Variável | Descrição |
| --- | --- |
| `EXPO_PUBLIC_API_URL` | URL da API, por exemplo `http://SEU_IP_LOCAL:3000` |

## Acessibilidade

O app segue as diretrizes de acessibilidade para TalkBack (Android, prioridade) e VoiceOver (iOS).

**Componentes base** (`mobile/src/components/`). Telas novas **devem** usá-los:

| Componente | Uso |
| --- | --- |
| `AppButton` | Todo botão simples (principal, contorno, perigo, link), com estados `disabled` e `busy` |
| `AppTextField` / `PasswordInput` | Todo campo de formulário, com rótulo visível ligado ao campo |
| `FeedbackMessage` | Erros, sucessos e avisos anunciados pelo leitor de tela |
| `LoadingIndicator` | Todo carregamento, com papel `progressbar` |
| `ScreenTitle` | Título da tela (`header`) e foco do leitor ao entrar na tela |
| `BackButton` | Botão de voltar com 48 dp |
| `ChipGroup` | Seleção única como `radiogroup`, sempre com `groupLabel` |

**Regras resumidas**

1. Todo controle tocável tem `accessibilityRole`.
2. O nome acessível começa com o texto visível (comando de voz "toque em Entrar"); só se acrescenta contexto depois.
3. Se o texto visível já descreve o controle, não se define `accessibilityLabel`.
4. Cartões tocáveis têm rótulo composto com todas as informações visíveis; nunca UUID ou ID técnico.
5. Alvo de toque mínimo de 48 x 48 dp, com `minHeight`/`minWidth` (não `hitSlop`) e sem `height` fixo em texto.
6. Contraste mínimo de 4,5:1 para texto e 3:1 para bordas e ícones; cores em `theme/tokens.ts`.
7. Nunca informar só por cor; desabilitado não usa `opacity`.
8. Todo campo tem rótulo visível e erro em texto abaixo do campo; teclado, `autoComplete` e foco encadeado corretos.
9. Erros e avisos são anunciados (região viva no Android, `announceForAccessibility` no iOS, nunca os dois).
10. Títulos de tela e de seção usam `accessibilityRole="header"`; imagens decorativas usam `accessible={false}`.

**Auditoria automática**

```bash
cd mobile
npm run audit:a11y
```

O script verifica toques sem papel, campos sem rótulo, imagens sem rótulo e estilos de controle menores que 48 dp. O esperado é a saída `Nenhum problema encontrado.`.

**Limitações conhecidas**

- Orientação travada em retrato (`orientation: "portrait"`), o que a WCAG 1.3.4 recomenda evitar.
- Apenas tema claro (`userInterfaceStyle: "light"`).
- A versão web não é alvo de teste com leitor de tela.

## Estrutura de pastas

```
backend/
  prisma/               schema e migrations
  src/
    modules/            auth, products, cart, orders, payments, pets, services, appointments
    middlewares/        autenticação, admin, validação e erros
    config/ database/ shared/
mobile/
  src/
    screens/            telas
    hooks/              lógica de cada tela
    services/           chamadas à API
    components/         componentes reutilizáveis
    navigation/         navegação por perfil
    storage/            token seguro e cache SQLite
    types/ utils/ theme/ config/ contexts/
```
