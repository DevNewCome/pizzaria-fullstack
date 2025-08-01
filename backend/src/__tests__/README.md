# Testes Automatizados - Sistema de Pizzaria

Este diretório contém todos os testes automatizados para o sistema de gerenciamento de pizzaria.

## 📁 Estrutura dos Testes

```
__tests__/
├── setup.ts                           # Configuração global dos testes
├── utils/
│   └── testUtils.ts                   # Utilitários para testes
├── services/
│   ├── user/
│   │   ├── CreateUserService.test.ts  # Testes do serviço de criação de usuário
│   │   └── AuthUserService.test.ts    # Testes do serviço de autenticação
│   └── category/
│       └── CreateCategoryService.test.ts # Testes do serviço de categoria
├── controllers/
│   └── user/
│       └── CreateUserController.test.ts # Testes do controlador de usuário
├── middlewares/
│   └── isAuth.test.ts                 # Testes do middleware de autenticação
├── integration/
│   └── routes.test.ts                 # Testes de integração das rotas
├── business-rules/
│   └── validation.test.ts             # Testes de validação de regras de negócio
├── error-handling/
│   └── errorCases.test.ts             # Testes de casos de erro e edge cases
└── README.md                          # Esta documentação
```

## 🚀 Como Executar os Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm run test:watch
```

### Executar testes com cobertura
```bash
npm run test:coverage
```

### Executar testes específicos
```bash
# Testes de um arquivo específico
npm test -- CreateUserService.test.ts

# Testes de um diretório específico
npm test -- services/

# Testes com padrão de nome
npm test -- --testNamePattern="should create user"
```

## 📊 Cobertura de Testes

Os testes cobrem os seguintes aspectos:

### ✅ Serviços (Services)
- **CreateUserService**: Validação de dados, criação de usuário, tratamento de erros
- **AuthUserService**: Autenticação, verificação de credenciais, geração de JWT
- **CreateCategoryService**: Criação de categorias, validação de nomes

### ✅ Controladores (Controllers)
- **CreateUserController**: Respostas HTTP, tratamento de erros, integração com serviços

### ✅ Middlewares
- **isAuth**: Validação de tokens JWT, autenticação de rotas protegidas

### ✅ Integração
- **Routes**: Testes end-to-end das rotas HTTP usando Supertest
- Validação de respostas HTTP (status codes, body)
- Testes de autenticação em rotas protegidas

### ✅ Regras de Negócio
- Validação de formato de email
- Validação de força de senha
- Validação de nomes e preços
- Validação de números de mesa e quantidades

### ✅ Casos de Erro
- Erros de conexão com banco de dados
- Validação de entrada de dados
- Tratamento de tokens JWT inválidos
- Edge cases e casos extremos

## 🛠️ Tecnologias Utilizadas

- **Jest**: Framework de testes principal
- **Supertest**: Testes de integração HTTP
- **TypeScript**: Tipagem estática para testes
- **Mocks**: Isolamento de dependências externas

## 📝 Padrões de Teste

### Estrutura AAA (Arrange, Act, Assert)
```typescript
describe('Service Test', () => {
  it('should do something', async () => {
    // Arrange - Preparar dados e mocks
    const mockData = { name: 'Test' };
    mockService.mockResolvedValue(expectedResult);

    // Act - Executar a ação
    const result = await service(mockData);

    // Assert - Verificar resultados
    expect(result).toEqual(expectedResult);
    expect(mockService).toHaveBeenCalledWith(mockData);
  });
});
```

### Mocks e Stubs
- **Prisma Client**: Mockado para evitar conexões reais com banco
- **bcryptjs**: Mockado para testes de hash e comparação
- **jsonwebtoken**: Mockado para testes de JWT
- **Express**: Mockado para testes de middlewares

### Testes de Integração
- Uso do Supertest para testar rotas HTTP
- Mock do middleware de autenticação
- Validação de respostas HTTP completas

## 🔧 Configuração

### Jest Configuration (jest.config.js)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/routes.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts']
};
```

### Setup Global (setup.ts)
- Carregamento de variáveis de ambiente
- Configuração de mocks globais
- Setup e teardown de testes

## 📈 Métricas de Qualidade

### Cobertura de Código
- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

### Tipos de Teste
- **Unit Tests**: 70% - Testes isolados de funções e classes
- **Integration Tests**: 20% - Testes de integração entre componentes
- **Error Tests**: 10% - Testes de casos de erro e edge cases

## 🚨 Boas Práticas

### ✅ Recomendado
- Usar nomes descritivos para testes
- Seguir o padrão AAA (Arrange, Act, Assert)
- Mockar dependências externas
- Testar casos de sucesso e erro
- Manter testes independentes
- Usar dados de teste realistas

### ❌ Evitar
- Testes que dependem de outros testes
- Mocks desnecessários
- Testes muito específicos de implementação
- Dados de teste não realistas
- Testes que não adicionam valor

## 🔄 Manutenção

### Adicionando Novos Testes
1. Crie o arquivo de teste na pasta apropriada
2. Siga a convenção de nomenclatura: `*.test.ts`
3. Use mocks para dependências externas
4. Adicione testes para casos de sucesso e erro
5. Execute os testes para garantir que passam

### Atualizando Testes Existentes
1. Execute todos os testes antes de fazer mudanças
2. Faça mudanças incrementais
3. Verifique se os testes ainda passam
4. Atualize documentação se necessário

## 📚 Recursos Adicionais

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices) 