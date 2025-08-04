#  Como Usar o Dashboard de Testes

##  Passos Simples

### 1. Abrir o Dashboard
```bash
# Na pasta backend, execute:
npm run dashboard
```

### 2. Ou abra manualmente
- Navegue até a pasta `backend`
- Clique duas vezes no arquivo `test-dashboard.html`
- Ele abrirá no seu navegador padrão

### 3. Executar Testes
```bash
# Todos os testes
npm test

# Testes com cobertura
npm run test:coverage

# Testes em modo watch (atualiza automaticamente)
npm run test:watch
```

##  O que você verá no Dashboard

- **Estatísticas**: 7 suites, 41 testes passando, 0 falhando
- **Cobertura**: 60.35% de cobertura geral
- **Módulos testados**: Serviços, Controladores, Middleware, Integração
- **Interface bonita**: Cores, animações e design moderno

##  Atualizar Dados

1. Execute `npm test` no terminal
2. Recarregue a página do dashboard (F5)
3. Os dados serão atualizados

##  Dicas

- O dashboard funciona melhor no Chrome, Firefox ou Edge
- Mantenha o terminal aberto para executar os testes
- Use `npm run test:watch` para testes automáticos

