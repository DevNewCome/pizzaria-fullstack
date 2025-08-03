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
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^services/(.*)$': '<rootDir>/src/services/$1',
    '^__tests__/(.*)$': '<rootDir>/src/__tests__/$1'
  },
  moduleDirectories: ['node_modules', 'src'],
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Relatório de Testes - Sistema de Pizzaria',
      outputPath: './test-report.html',
      includeFailureMsg: true,
      includeConsoleLog: true,
      theme: 'darkTheme'
    }]
  ]
}; 