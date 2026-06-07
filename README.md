# SistemaPedidos

Sistema de gerenciamento de pedidos com backend em .NET e aplicativo mobile em React Native.

## Visão Geral

Aplicação completa para gerenciar pedidos, clientes e produtos. O app mobile se conecta ao Firebase (Firestore) para persistência de dados em tempo real e autenticação de usuários.

## Tecnologias

**Backend**
- .NET 10 / ASP.NET Core
- Arquitetura em camadas (Domain, Application, Infrastructure, API)

**Mobile**
- React Native 0.85 + Expo 56
- TypeScript
- Firebase (Firestore + Authentication)
- NativeWind (Tailwind CSS para React Native)
- React Navigation (Stack + Bottom Tabs)

## Funcionalidades

- Autenticação com e-mail e senha (Firebase Auth)
- Cadastro e listagem de **clientes**
- Cadastro e listagem de **produtos** com controle de estoque
- Criação e gerenciamento de **pedidos** com status: `Pendente`, `Pago`, `Enviado`, `Cancelado`
- Carrinho de compras com persistência local (AsyncStorage)
- Busca e filtros em todas as listas
- Sincronização em tempo real via Firestore

## Estrutura do Projeto

```
SistemaPedidos/
├── SistemaPedidos.API/            # API ASP.NET Core
├── SistemaPedidos.Application/    # Casos de uso
├── SistemaPedidos.Domain/         # Entidades e enums
├── SistemaPedidos.Infrastructure/ # Acesso a dados
└── mobile/                        # App React Native/Expo
    └── src/
        ├── context/               # AuthContext (Firebase)
        ├── hooks/                 # useCart
        ├── navigation/            # Navegação por stacks e tabs
        ├── screens/               # Telas (Auth, Dashboard, Pedidos, Produtos, Clientes)
        ├── services/              # Configuração Firebase
        └── types/                 # Tipagens TypeScript
```

## Como Rodar o Mobile

**Pré-requisitos:** Node.js, Expo CLI

```bash
cd mobile
npm install
npx expo start
```

Escaneie o QR code com o app **Expo Go** no celular, ou rode em emulador.

## Como Rodar o Backend

**Pré-requisitos:** .NET 10 SDK

```bash
cd SistemaPedidos.API
dotnet run
```

API disponível em `https://localhost:7267` (Swagger em `/swagger`).

## Variáveis de Ambiente

O app mobile utiliza o Firebase. Configure suas credenciais em `mobile/src/services/firebase.ts`:

```ts
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```
