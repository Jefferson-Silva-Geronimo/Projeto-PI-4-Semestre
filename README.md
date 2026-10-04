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
