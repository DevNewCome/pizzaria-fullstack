/**
 * CONFIGURAÇÃO GLOBAL DOS TESTES
 * 
 * Este arquivo é executado antes de todos os testes e configura
 * o ambiente de teste. Ele é referenciado no jest.config.js
 * através da propriedade setupFilesAfterEnv.
 * 
 * O que este arquivo faz:
 * - Carrega variáveis de ambiente específicas para testes
 * - Configura mocks globais (console.log, etc.)
 * - Define hooks globais (beforeAll, afterAll)
 * - Estende tipos do Jest para melhor tipagem
 */

import dotenv from 'dotenv';

// Carrega as variáveis de ambiente para os testes
// Usa o arquivo .env.test para não interferir com o ambiente de desenvolvimento
dotenv.config({ path: '.env.test' });

// Configuração global para os testes
// Este hook é executado uma vez antes de todos os testes
beforeAll(async () => {
  // Aqui você pode adicionar configurações globais
  // como limpar o banco de dados de teste
  // Exemplo: await prisma.$connect();
  // Exemplo: await prisma.user.deleteMany();
});

// Cleanup após todos os testes
// Este hook é executado uma vez após todos os testes terminarem
afterAll(async () => {
  // Aqui você pode adicionar limpeza global
  // como desconectar do banco de dados
  // Exemplo: await prisma.$disconnect();
});

// Mock do console.log para não poluir os logs dos testes
// Substitui todas as funções de console por mocks do Jest
// Isso evita que logs apareçam durante a execução dos testes
global.console = {
  ...console, // Mantém outras propriedades do console
  log: jest.fn(),    // Mock do console.log
  debug: jest.fn(),  // Mock do console.debug
  info: jest.fn(),   // Mock do console.info
  warn: jest.fn(),   // Mock do console.warn
  error: jest.fn(),  // Mock do console.error
};

// Configuração global para tipos do Jest
// Estende as interfaces do Jest para incluir métodos de mock mais específicos
// Isso melhora a tipagem TypeScript nos testes
declare global {
  namespace jest {
    interface Mock<T = any, Y extends any[] = any> {
      // Mock que retorna uma Promise resolvida
      mockResolvedValue: (value: T) => Mock<T, Y>;
      // Mock que retorna uma Promise rejeitada
      mockRejectedValue: (value: any) => Mock<T, Y>;
      // Mock que retorna um valor síncrono
      mockReturnValue: (value: T) => Mock<T, Y>;
      // Mock que executa uma função customizada
      mockImplementation: (fn: (...args: Y) => T) => Mock<T, Y>;
    }
  }
} 