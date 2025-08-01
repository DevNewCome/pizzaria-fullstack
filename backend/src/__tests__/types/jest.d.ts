/// <reference types="jest" />

declare global {
  namespace jest {
    interface Matchers<R> {
      // Adicione matchers customizados aqui se necessário
    }
  }
}

// Extend Jest types for better mocking
declare module 'jest' {
  interface Mock<T = any, Y extends any[] = any> {
    mockResolvedValue: (value: T) => Mock<T, Y>;
    mockRejectedValue: (value: any) => Mock<T, Y>;
    mockReturnValue: (value: T) => Mock<T, Y>;
    mockImplementation: (fn: (...args: Y) => T) => Mock<T, Y>;
  }
}

export {}; 