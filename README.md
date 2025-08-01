# 🍕 Sistema de Gerenciamento de Pizzaria

## Descrição Geral

Sistema completo de gerenciamento para pizzaria desenvolvido com arquitetura full-stack. O projeto permite o controle de usuários, categorias de produtos, produtos, pedidos e itens, oferecendo uma solução completa para o gerenciamento de uma pizzaria.

### Funcionalidades Principais

- **Autenticação de Usuários**: Sistema de login e registro com JWT
- **Gerenciamento de Categorias**: Criação e listagem de categorias de produtos
- **Gerenciamento de Produtos**: Cadastro de produtos com upload de imagens
- **Sistema de Pedidos**: Criação, edição e finalização de pedidos
- **Controle de Itens**: Adição e remoção de itens nos pedidos
- **Dashboard Administrativo**: Interface para gerenciamento completo

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15.2.4** - Framework React com App Router
- **React 19.0.0** - Biblioteca para interface do usuário
- **TypeScript** - Linguagem de programação tipada
- **SASS** - Pré-processador CSS
- **Axios** - Cliente HTTP para requisições
- **Lucide React** - Biblioteca de ícones
- **Sonner** - Biblioteca de notificações
- **Cookies-next** - Gerenciamento de cookies

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Linguagem de programação tipada
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **Bcryptjs** - Criptografia de senhas
- **Multer** - Upload de arquivos
- **CORS** - Cross-Origin Resource Sharing

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos
- Node.js (versão 18 ou superior)
- PostgreSQL instalado e configurado
- npm ou yarn

### Configuração do Backend

1. **Navegue para a pasta do backend:**
   ```bash
   cd backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:
   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
   JWT_SECRET="sua_chave_secreta_jwt"
   ```

4. **Configure o banco de dados:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

O backend estará rodando em `http://localhost:3001`

### Configuração do Frontend

1. **Navegue para a pasta do frontend:**
   ```bash
   cd frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

O frontend estará rodando em `http://localhost:3000`

## 📡 Como Usar a API

### Autenticação

#### Criar Usuário
```http
POST /users
Content-Type: application/json

{
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "password": "senha123"
}
```

#### Fazer Login
```http
POST /session
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

### Categorias

#### Criar Categoria
```http
POST /category
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nome da Categoria"
}
```

#### Listar Categorias
```http
GET /category
Authorization: Bearer <token>
```

### Produtos

#### Criar Produto
```http
POST /product
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "name": "Nome do Produto",
  "price": "25.90",
  "description": "Descrição do produto",
  "category_id": "id_da_categoria",
  "file": [arquivo_imagem]
}
```

#### Listar Produtos por Categoria
```http
GET /category/product?category_id=<id_categoria>
Authorization: Bearer <token>
```

### Pedidos

#### Criar Pedido
```http
POST /order
Authorization: Bearer <token>
Content-Type: application/json

{
  "table": 1,
  "name": "Nome do Cliente"
}
```

#### Adicionar Item ao Pedido
```http
POST /order/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "order_id": "id_do_pedido",
  "product_id": "id_do_produto",
  "amount": 2
}
```

#### Enviar Pedido
```http
PUT /order/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "order_id": "id_do_pedido"
}
```

#### Finalizar Pedido
```http
PUT /order/finish
Authorization: Bearer <token>
Content-Type: application/json

{
  "order_id": "id_do_pedido"
}
```

## 📁 Estrutura de Pastas

```
projeto-pizzaria/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Controladores da aplicação
│   │   ├── middlewares/     # Middlewares (autenticação, etc.)
│   │   ├── services/        # Lógica de negócio
│   │   ├── config/          # Configurações (multer, etc.)
│   │   ├── @types/          # Definições de tipos TypeScript
│   │   ├── prisma/          # Configurações do Prisma
│   │   ├── routes.ts        # Definição das rotas
│   │   └── server.ts        # Arquivo principal do servidor
│   ├── prisma/
│   │   ├── schema.prisma    # Schema do banco de dados
│   │   └── migrations/      # Migrações do banco
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/             # Páginas da aplicação (App Router)
│   │   │   ├── dashboard/   # Área administrativa
│   │   │   ├── signup/      # Página de registro
│   │   │   └── page.tsx     # Página inicial
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── services/        # Serviços de API
│   │   ├── providers/       # Providers do React
│   │   └── lib/             # Utilitários e configurações
│   ├── public/              # Arquivos estáticos
│   └── package.json
└── README.md
```

## 📊 Modelos do Banco de Dados

- **User**: Usuários do sistema
- **Category**: Categorias de produtos
- **Product**: Produtos da pizzaria
- **Order**: Pedidos dos clientes
- **Item**: Itens dentro dos pedidos

## 🔧 Informações Adicionais

### Scripts Disponíveis

**Backend:**
- `npm run dev`: Inicia o servidor em modo desenvolvimento

**Frontend:**
- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera build de produção
- `npm run start`: Inicia o servidor de produção
- `npm run lint`: Executa o linter

### Segurança

- Autenticação JWT implementada
- Senhas criptografadas com bcrypt
- Middleware de autenticação em rotas protegidas
- Upload de arquivos com validação

## 🚀 Futuras Melhorias

- [ ] Implementação de testes automatizados
- [ ] Sistema de notificações em tempo real
- [ ] Relatórios e dashboards analíticos
- [ ] Sistema de delivery integrado
- [ ] Aplicativo mobile para clientes
- [ ] Integração com sistemas de pagamento
- [ ] Sistema de fidelidade
- [ ] Gestão de estoque
- [ ] Múltiplas filiais
- [ ] API de terceiros (Google Maps, etc.)

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👥 Contribuição

Contribuições são bem-vindas! Por favor, leia as diretrizes de contribuição antes de submeter pull requests. 