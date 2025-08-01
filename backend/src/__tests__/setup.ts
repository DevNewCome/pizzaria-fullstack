import dotenv from 'dotenv';

// Carrega as variáveis de ambiente para os testes
dotenv.config({ path: '.env.test' });

// Configuração global para os testes
beforeAll(async () => {
  // Aqui você pode adicionar configurações globais
  // como limpar o banco de dados de teste
});

afterAll(async () => {
  // Cleanup após todos os testes
});

// Mock do console.log para não poluir os logs dos testes
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Configuração global para tipos do Jest
declare global {
  namespace jest {
    interface Mock<T = any, Y extends any[] = any> {
      mockResolvedValue: (value: T) => Mock<T, Y>;
      mockRejectedValue: (value: any) => Mock<T, Y>;
      mockReturnValue: (value: T) => Mock<T, Y>;
      mockImplementation: (fn: (...args: Y) => T) => Mock<T, Y>;
    }
  }
} 