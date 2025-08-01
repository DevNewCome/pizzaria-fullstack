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
- **Documentação Interativa**: API documentada com Swagger

## 📚 Documentação da API

### Swagger UI
A documentação interativa da API está disponível através do Swagger UI:

- **URL**: `http://localhost:3001/api-docs`
- **Descrição**: Interface interativa para testar todas as rotas da API
- **Recursos**: 
  - Teste todas as rotas diretamente no navegador
  - Veja exemplos de requisição e resposta
  - Entenda os parâmetros necessários
  - Valide os formatos de dados

### Documentação Completa
Para documentação detalhada com exemplos de uso, consulte:
- **Arquivo**: `backend/API_DOCUMENTATION.md`
- **Conteúdo**: Guia completo com exemplos de cURL, modelos de dados e fluxos

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
- **Swagger UI Express** - Documentação interativa da API
- **Swagger JSDoc** - Geração de documentação a partir de comentários

### Testes
- **Jest** - Framework de testes
- **Supertest** - Testes de integração HTTP
- **ts-jest** - Suporte TypeScript para Jest

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
A documentação da API estará disponível em `http://localhost:3001/api-docs`

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

## 🧪 Testes Automatizados

O projeto possui uma suíte completa de testes automatizados cobrindo:

### Executar Testes
```bash
# Navegue para a pasta backend
cd backend

# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

### Cobertura de Testes
- **Serviços**: Validação de regras de negócio, criação de usuários, autenticação
- **Controladores**: Respostas HTTP, tratamento de erros
- **Middlewares**: Autenticação JWT, validação de tokens
- **Integração**: Testes end-to-end das rotas HTTP
- **Regras de Negócio**: Validação de dados, formatos, limites
- **Casos de Erro**: Tratamento de exceções, edge cases

### Estrutura dos Testes
```
backend/src/__tests__/
├── services/          # Testes de serviços
├── controllers/       # Testes de controladores
├── middlewares/       # Testes de middlewares
├── integration/       # Testes de integração
├── business-rules/    # Testes de regras de negócio
├── error-handling/    # Testes de casos de erro
└── utils/            # Utilitários para testes
```

Para mais detalhes sobre os testes, consulte: `backend/src/__tests__/README.md`

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
│   │   ├── config/          # Configurações (multer, swagger, etc.)
│   │   ├── @types/          # Definições de tipos TypeScript
│   │   ├── prisma/          # Configurações do Prisma
│   │   ├── __tests__/       # Testes automatizados
│   │   ├── routes.ts        # Definição das rotas com Swagger
│   │   └── server.ts        # Arquivo principal do servidor
│   ├── prisma/
│   │   ├── schema.prisma    # Schema do banco de dados
│   │   └── migrations/      # Migrações do banco
│   ├── jest.config.js       # Configuração do Jest
│   ├── API_DOCUMENTATION.md # Documentação detalhada da API
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
- `npm test`: Executa todos os testes
- `npm run test:watch`: Executa testes em modo watch
- `npm run test:coverage`: Executa testes com relatório de cobertura

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

### Qualidade de Código

- **Testes Automatizados**: Cobertura abrangente com Jest e Supertest
- **TypeScript**: Tipagem estática para maior segurança
- **ESLint**: Linting para manter padrões de código
- **Prisma**: ORM type-safe para banco de dados
- **Swagger**: Documentação automática da API

## 🚀 Futuras Melhorias

- [ ] Implementação de testes E2E com Cypress
- [ ] Sistema de notificações em tempo real
- [ ] Relatórios e dashboards analíticos
- [ ] Sistema de delivery integrado
- [ ] Aplicativo mobile para clientes
- [ ] Integração com sistemas de pagamento
- [ ] Sistema de fidelidade
- [ ] Gestão de estoque
- [ ] Múltiplas filiais
- [ ] API de terceiros (Google Maps, etc.)
- [ ] CI/CD pipeline com testes automatizados
- [ ] Monitoramento e logging avançado

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👥 Contribuição

Contribuições são bem-vindas! Por favor, leia as diretrizes de contribuição antes de submeter pull requests.

### Processo de Contribuição
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
6. Certifique-se de que todos os testes passam
7. Mantenha a cobertura de testes acima de 90% 