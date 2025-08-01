# 📚 Documentação da API Pizzaria

## 🚀 Visão Geral

Esta documentação descreve a API completa do sistema de gerenciamento de pizzaria, incluindo todas as rotas, parâmetros, respostas e exemplos de uso.

## 📖 Acesso à Documentação Interativa

A documentação interativa está disponível através do Swagger UI:

- **URL**: `http://localhost:3001/api-docs`
- **Descrição**: Interface interativa para testar todas as rotas da API

## 🔐 Autenticação

A API utiliza autenticação JWT (JSON Web Token) para proteger as rotas. Para acessar rotas protegidas:

1. Faça login através da rota `/session`
2. Use o token retornado no header `Authorization: Bearer <token>`

### Exemplo de Autenticação

```bash
curl -X POST http://localhost:3001/session \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@email.com",
    "password": "123456"
  }'
```

## 📋 Endpoints da API

### 👥 Usuários

#### Criar Usuário
- **POST** `/users`
- **Descrição**: Cria um novo usuário no sistema
- **Autenticação**: Não requerida

```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456"
  }'
```

#### Autenticar Usuário
- **POST** `/session`
- **Descrição**: Autentica um usuário e retorna um token JWT
- **Autenticação**: Não requerida

```bash
curl -X POST http://localhost:3001/session \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "123456"
  }'
```

#### Obter Dados do Usuário
- **GET** `/me`
- **Descrição**: Retorna os dados do usuário autenticado
- **Autenticação**: Requerida

```bash
curl -X GET http://localhost:3001/me \
  -H "Authorization: Bearer <seu_token_jwt>"
```

### 📂 Categorias

#### Criar Categoria
- **POST** `/category`
- **Descrição**: Cria uma nova categoria de produtos
- **Autenticação**: Requerida

```bash
curl -X POST http://localhost:3001/category \
  -H "Authorization: Bearer <seu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizzas"
  }'
```

#### Listar Categorias
- **GET** `/category`
- **Descrição**: Lista todas as categorias
- **Autenticação**: Requerida

```bash
curl -X GET http://localhost:3001/category \
  -H "Authorization: Bearer <seu_token_jwt>"
```

### 🍕 Produtos

#### Criar Produto
- **POST** `/product`
- **Descrição**: Cria um novo produto com upload de imagem
- **Autenticação**: Requerida
- **Content-Type**: `multipart/form-data`

```bash
curl -X POST http://localhost:3001/product \
  -H "Authorization: Bearer <seu_token_jwt>" \
  -F "name=Pizza Margherita" \
  -F "price=25.90" \
  -F "description=Pizza tradicional com molho de tomate e mussarela" \
  -F "category_id=123e4567-e89b-12d3-a456-426614174000" \
  -F "file=@imagem.jpg"
```

#### Listar Produtos por Categoria
- **GET** `/category/product?category_id=<id>`
- **Descrição**: Lista produtos de uma categoria específica
- **Autenticação**: Requerida

```bash
curl -X GET "http://localhost:3001/category/product?category_id=123e4567-e89b-12d3-a456-426614174000" \
  -H "Authorization: Bearer <seu_token_jwt>"
```

### 📋 Pedidos

#### Criar Pedido
- **POST** `/order`
- **Descrição**: Cria um novo pedido
- **Autenticação**: Requerida

```bash
curl -X POST http://localhost:3001/order \
  -H "Authorization: Bearer <seu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "table": 1,
    "name": "Maria Silva"
  }'
```

#### Adicionar Item ao Pedido
- **POST** `/order/add`
- **Descrição**: Adiciona um item a um pedido existente
- **Autenticação**: Requerida

```bash
curl -X POST http://localhost:3001/order/add \
  -H "Authorization: Bearer <seu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "123e4567-e89b-12d3-a456-426614174000",
    "product_id": "123e4567-e89b-12d3-a456-426614174001",
    "amount": 2
  }'
```

#### Remover Item do Pedido
- **DELETE** `/order/remove`
- **Descrição**: Remove um item de um pedido
- **Autenticação**: Requerida

```bash
curl -X DELETE http://localhost:3001/order/remove \
  -H "Authorization: Bearer <seu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

#### Enviar Pedido
- **PUT** `/order/send`
- **Descrição**: Envia o pedido para a cozinha (muda status de draft para false)
- **Autenticação**: Requerida

```bash
curl -X PUT http://localhost:3001/order/send \
  -H "Authorization: Bearer <seu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

#### Finalizar Pedido
- **PUT** `/order/finish`
- **Descrição**: Finaliza um pedido (muda status para true)
- **Autenticação**: Requerida

```bash
curl -X PUT http://localhost:3001/order/finish \
  -H "Authorization: Bearer <seu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

#### Listar Pedidos
- **GET** `/orders`
- **Descrição**: Lista todos os pedidos
- **Autenticação**: Requerida

```bash
curl -X GET http://localhost:3001/orders \
  -H "Authorization: Bearer <seu_token_jwt>"
```

#### Detalhes do Pedido
- **GET** `/order/detail?order_id=<id>`
- **Descrição**: Retorna detalhes de um pedido específico com seus itens
- **Autenticação**: Requerida

```bash
curl -X GET "http://localhost:3001/order/detail?order_id=123e4567-e89b-12d3-a456-426614174000" \
  -H "Authorization: Bearer <seu_token_jwt>"
```

#### Remover Pedido
- **DELETE** `/order`
- **Descrição**: Remove um pedido completo
- **Autenticação**: Requerida

```bash
curl -X DELETE http://localhost:3001/order \
  -H "Authorization: Bearer <seu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

## 📊 Modelos de Dados

### User
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Category
```json
{
  "id": "string",
  "name": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Product
```json
{
  "id": "string",
  "name": "string",
  "price": "string",
  "description": "string",
  "banner": "string",
  "category_id": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Order
```json
{
  "id": "string",
  "table": "integer",
  "status": "boolean",
  "draft": "boolean",
  "name": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Item
```json
{
  "id": "string",
  "amount": "integer",
  "order_id": "string",
  "product_id": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## 🔧 Códigos de Status HTTP

- **200**: Sucesso
- **400**: Erro de validação ou dados inválidos
- **401**: Não autorizado (token inválido ou ausente)
- **500**: Erro interno do servidor

## 📁 Upload de Arquivos

Para upload de imagens de produtos:

1. Use `multipart/form-data` como Content-Type
2. O campo deve se chamar `file`
3. Formatos aceitos: JPG, PNG, GIF
4. Tamanho máximo: 5MB
5. As imagens ficam disponíveis em `/files/<nome_do_arquivo>`

## 🚀 Como Testar

### 1. Inicie o servidor
```bash
cd backend
npm run dev
```

### 2. Acesse a documentação
Abra o navegador e acesse: `http://localhost:3001/api-docs`

### 3. Teste as rotas
Use a interface do Swagger para:
- Testar todas as rotas interativamente
- Ver exemplos de requisição e resposta
- Entender os parâmetros necessários
- Validar os formatos de dados

## 📝 Exemplos de Fluxo Completo

### Fluxo de Criação de Pedido

1. **Criar usuário** (se não existir)
2. **Fazer login** para obter token
3. **Criar categoria** (se não existir)
4. **Criar produto** na categoria
5. **Criar pedido**
6. **Adicionar itens** ao pedido
7. **Enviar pedido** para cozinha
8. **Finalizar pedido** quando pronto

### Exemplo de Script de Teste

```bash
#!/bin/bash

# 1. Criar usuário
USER_RESPONSE=$(curl -s -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@email.com","password":"123456"}')

echo "Usuário criado: $USER_RESPONSE"

# 2. Fazer login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/session \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","password":"123456"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Token obtido: $TOKEN"

# 3. Criar categoria
CATEGORY_RESPONSE=$(curl -s -X POST http://localhost:3001/category \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Pizzas"}')

echo "Categoria criada: $CATEGORY_RESPONSE"
```

## 🛠️ Ferramentas Recomendadas

- **Postman**: Para testar as rotas
- **Insomnia**: Alternativa ao Postman
- **cURL**: Para testes via linha de comando
- **Swagger UI**: Interface interativa (já incluída)

## 📞 Suporte

Para dúvidas sobre a API:

- **Email**: suporte@pizzaria.com
- **Documentação**: http://localhost:3001/api-docs
- **Issues**: Abra uma issue no repositório do projeto 