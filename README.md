# 🍕 Pizzaria Fullstack

Sistema completo para gerenciamento de pedidos de uma pizzaria, com **frontend** e **backend** separados. Desenvolvido com **Next.js** (frontend), **Node.js + TypeScript** (backend), **PostgreSQL** para o banco de dados, **Prisma ORM**, e estilizado com **Sass**. As APIs foram testadas utilizando **Insomnia**.

---

## 📚 Tecnologias Utilizadas

### 🔙 Backend
- Node.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT (autenticação)
- Bcrypt (hash de senha)
- Insomnia (testes de rotas)

### 🎨 Frontend
- Next.js
- React
- TypeScript
- Sass (SCSS)
- Axios

---

## ⚙️ Como Rodar o Projeto

📌 Funcionalidades Principais
Autenticação de usuários (login)

Cadastro de produtos (pizzas)

Listagem de pedidos em tempo real

Atualização de status dos pedidos (em preparo, pronto, entregue)

Painel administrativo

Layout responsivo e estilizado com Sass

🧪 Testes de API
As rotas da API foram testadas com Insomnia.

Você pode importar o arquivo de exportação .json do Insomnia para testar todas as rotas rapidamente. (Recomenda-se adicioná-lo na pasta docs/ do projeto.)

```bash
# 1. Clone o repositório
git clone https://github.com/DevNewCome/pizzaria-fullstack.git
cd pizzaria-fullstack

# 2. Instale as dependências do backend
cd backend
npm install

# 3. Configure as variáveis de ambiente do backend
cp .env.example .env
# Edite o .env com suas configurações:
# DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
# JWT_SECRET=sua_chave_secreta

# 4. Rode as migrações com o Prisma
npx prisma migrate dev

# 5. Inicie o servidor backend
npm run dev

# 6. Em outro terminal, instale o frontend
cd ../frontend
npm install

# 7. Inicie o frontend
npm run dev


👨‍💻 Autor
Desenvolvido por Jefferson Lira
