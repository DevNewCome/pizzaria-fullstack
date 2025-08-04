#  Dashboard de Testes - Sistema de Pizzaria

##  Visão Geral

Este dashboard fornece uma interface visual amigável para acompanhar os resultados dos testes automatizados do sistema de pizzaria.

##  Como Usar

### Abrir o Dashboard

```bash
# Usando npm
npm run dashboard

# Usando PowerShell
.\open-dashboard.ps1

# Usando Batch (Windows)
open-dashboard.bat

# Ou simplesmente abra o arquivo
test-dashboard.html
```

### Executar Testes

```bash
# Executar todos os testes
npm test

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo watch
npm run test:watch

# Gerar relatório HTML
npm run test:report
```

##  Métricas Exibidas

### Estatísticas Gerais
- **Test Suites**: Número total de suites de teste
- **Testes Passando**: Quantidade de testes que passaram
- **Testes Falhando**: Quantidade de testes que falharam
- **Cobertura de Código**: Percentual de cobertura geral

### Cobertura por Módulo
- **Serviços de Usuário**: 93.54%
- **Serviços de Categoria**: 81.81%
- **Controladores de Usuário**: 81.81%
- **Middleware isAuth**: 100%

### Tipos de Teste
-  **Testes de Serviços**: Validação das regras de negócio
-  **Testes de Controladores**: Respostas corretas das rotas
-  **Testes de Middleware**: Autenticação e autorização
-  **Testes de Integração**: Comportamento das rotas HTTP
-  **Testes de Validação**: Regras de negócio e validações

##  Recursos Visuais

- **Interface Responsiva**: Funciona em desktop e mobile
- **Animações Suaves**: Transições e efeitos visuais
- **Cores Intuitivas**: Verde para sucesso, vermelho para falhas
- **Barras de Progresso**: Visualização da cobertura de código
- **Design Moderno**: Interface limpa e profissional

##  Atualização Automática

O dashboard mostra a data/hora da última atualização. Para atualizar os dados:

1. Execute os testes: `npm test`
2. Recarregue a página do dashboard
3. Os dados serão atualizados automaticamente

##  Estrutura de Arquivos

```
backend/
├── test-dashboard.html      # Dashboard principal
├── open-dashboard.bat       # Script Windows
├── open-dashboard.ps1       # Script PowerShell
├── DASHBOARD.md            # Esta documentação
└── coverage/               # Relatórios de cobertura
    └── lcov-report/
        └── index.html      # Relatório detalhado de cobertura
```

##  Personalização

Você pode personalizar o dashboard editando o arquivo `test-dashboard.html`:

- **Cores**: Modifique as variáveis CSS
- **Layout**: Ajuste o grid e espaçamentos
- **Métricas**: Adicione novas estatísticas
- **Animações**: Personalize os efeitos visuais

##  Suporte

Se encontrar problemas com o dashboard:

1. Verifique se o arquivo `test-dashboard.html` existe
2. Certifique-se de que os testes estão funcionando
3. Tente recarregar a página
4. Verifique o console do navegador para erros

---

**Desenvolvido com ❤️ para o Sistema de Gerenciamento de Pizzaria** 