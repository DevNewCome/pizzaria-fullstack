/**
 * DEFINIÇÕES DE TIPOS PARA JEST
 * 
 * Este arquivo contém extensões de tipos para o Jest, permitindo:
 * - Melhor tipagem para mocks e matchers customizados
 * - Extensões das interfaces do Jest para TypeScript
 * - Definição de tipos globais para testes
 * 
 * Estas definições ajudam o TypeScript a entender melhor os tipos
 * usados nos testes e fornecem autocompletar mais preciso.
 */

/// <reference types="jest" />

declare global {
  namespace jest {
    interface Matchers<R> {
      // Adicione matchers customizados aqui se necessário
      // Exemplo: toBeValidEmail(): R;
      // Exemplo: toHaveValidPassword(): R;
    }
  }
}

// Extend Jest types for better mocking
// Estende os tipos do Jest para incluir métodos de mock mais específicos
declare module 'jest' {
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

export {}; 