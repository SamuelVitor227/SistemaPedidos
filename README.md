# SistemaPedidos

Aplicativo móvel de **e-commerce e delivery** em React Native (Expo), integrado ao
Firebase. O repositório contém duas frentes:

- **`mobile/`** — o aplicativo principal. Arquitetura **BaaS**: o app conversa
  **direto com o Firebase Cloud Firestore** (catálogo, pedidos e perfis) e usa o
  Firebase Authentication para login. É o fluxo ativo do projeto.
- **`backend/`** — uma **API REST opcional** em Node.js + Express com Firebase Admin
  SDK. Foi construída como camada de retaguarda/administração, mas **o app mobile
  hoje não depende dela** — ele acessa o Firestore diretamente. Mantida no repositório
  como alternativa de back-office.

## Tecnologias

**Mobile (app principal)**
- React Native 0.85 + Expo 56 + TypeScript
- Firebase Authentication (e-mail/senha)
- Firebase Cloud Firestore (acesso direto — BaaS)
- AsyncStorage + Context API (carrinho)
- NativeWind (Tailwind CSS para React Native)
- React Navigation (Bottom Tabs + Stacks)

**Backend (opcional)**
- Node.js + Express
- Firebase Admin SDK (Firestore)

## Funcionalidades do app

- Autenticação com e-mail e senha (Firebase Auth)
- Catálogo de **produtos** por categoria, lido do Firestore
- **Carrinho** de compras com persistência local (AsyncStorage)
- **Checkout** com endereço e forma de pagamento, gravando o pedido no Firestore
- **Histórico de pedidos** e **rastreamento de status** em tempo real (snapshot listeners)
- Busca de produtos e perfil do usuário

## Estrutura do Projeto

```
SistemaPedidos/
├── mobile/                    # App React Native/Expo (fluxo ativo)
│   └── src/
│       ├── context/           # AuthContext (Firebase Auth), CartContext (AsyncStorage)
│       ├── navigation/        # AppNavigator (tabs) + HomeStack, PedidosStack, AuthStack
│       ├── screens/           # Auth, Home, Buscar, Pedidos, Perfil
│       ├── services/          # firebase.ts (config) e firestore.ts (acesso a dados)
│       ├── theme/             # paleta dark/verde-lima
│       ├── types/             # tipagens do domínio
│       └── utils/             # formatação (moeda BRL, datas)
│   └── README.md              # documentação detalhada do app + setup do Firebase
└── backend/                   # API Node.js + Express (opcional / back-office)
    ├── src/
    │   ├── config/firebase.js
    │   ├── routes/            # clientes.js, produtos.js, pedidos.js
    │   ├── app.js
    │   └── server.js
    └── package.json
```

## Como rodar o app mobile (principal)

**Pré-requisitos:** Node.js, Expo Go (ou emulador)

```bash
cd mobile
npm install
npx expo start -c
```

Antes do primeiro uso, configure o projeto Firebase `sistemas-de-pedido`:
habilite **Authentication → E-mail/senha** e crie o **Firestore** com regras para
usuários autenticados. O passo a passo completo (e as regras prontas) está em
[`mobile/README.md`](./mobile/README.md). O catálogo é populado automaticamente na
primeira abertura.

## Como rodar o backend (opcional)

O backend não é necessário para usar o app, mas pode servir como API de retaguarda.

**Pré-requisitos:** Node.js

```bash
cd backend
npm install
npm run dev
```

API disponível em `http://localhost:3000`.

### Endpoints da API (backend opcional)

| Método | Rota | Descrição |
|---|---|---|
| GET / POST | `/clientes` | Listar / Criar cliente |
| GET / PUT / DELETE | `/clientes/:id` | Buscar / Editar / Excluir cliente |
| GET / POST | `/produtos` | Listar / Criar produto |
| GET / PUT / DELETE | `/produtos/:id` | Buscar / Editar / Excluir produto |
| GET / POST | `/pedidos` | Listar / Criar pedido |
| GET / DELETE | `/pedidos/:id` | Buscar / Excluir pedido |
| GET | `/pedidos/cliente/:clienteId` | Pedidos por cliente |
| PATCH | `/pedidos/:id/status` | Atualizar status do pedido |

### Variáveis de ambiente do backend

Crie um arquivo `.env` dentro de `backend/`:

```env
PORT=3000
FIREBASE_CREDENTIAL_PATH=./firebase-credentials.json
```
