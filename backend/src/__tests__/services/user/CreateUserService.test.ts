/**
 * TESTE DO SERVIÇO DE CRIAÇÃO DE USUÁRIO
 * 
 * Este arquivo testa o serviço responsável por criar novos usuários no sistema.
 * O serviço deve:
 * - Validar os dados de entrada (nome, email, senha)
 * - Verificar se o email já existe no banco
 * - Criptografar a senha antes de salvar
 * - Criar o usuário no banco de dados
 * - Retornar os dados do usuário criado (sem a senha)
 */

import { createUserService } from '../../../services/user/CreateUserService';
import prismaClient from '../../../prisma';
import { hash } from 'bcryptjs';

// Mock do Prisma Client - Simula o banco de dados para não fazer conexões reais durante os testes
jest.mock('../../../prisma', () => ({
  user: {
    findFirst: jest.fn(), // Mock da função que busca usuário por email
    create: jest.fn(),    // Mock da função que cria usuário no banco
  },
}));

// Mock do bcryptjs - Simula a criptografia de senha para não fazer hash real durante os testes
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

// Cast para simplificar o prismaClient com mocks do jest
const mockPrisma = prismaClient as unknown as {
  user: {
    findFirst: jest.Mock<any, any>;
    create: jest.Mock<any, any>;
  };
};

// Aqui forçamos o mock do hash como jest.Mock simples
const mockHash = hash as unknown as jest.Mock;

describe('CreateUserService', () => {
  // Antes de cada teste, limpa todos os mocks para garantir que cada teste seja independente
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUserService', () => {
    // Dados válidos que serão usados em vários testes
    const validUserData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    /**
     * TESTE DE SUCESSO - Criação de usuário com dados válidos
     * 
     * Este teste verifica se o serviço consegue criar um usuário quando:
     * - Todos os dados estão corretos
     * - O email não existe no banco
     * - A senha é criptografada corretamente
     * - O usuário é salvo no banco
     * - Retorna os dados do usuário (sem a senha)
     */
    it('should create a user successfully with valid data', async () => {
      // Arrange - Preparar os mocks e dados
      mockPrisma.user.findFirst.mockResolvedValue(null); // Simula que o email não existe
      mockHash.mockResolvedValue('hashedPassword'); // Simula a criptografia da senha
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
      });

      // Act - Executar o serviço
      const result = await createUserService(validUserData);

      // Assert - Verificar se tudo funcionou corretamente
      // Verifica se a busca por email foi feita
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      // Verifica se a senha foi criptografada com salt 8
      expect(mockHash).toHaveBeenCalledWith('password123', 8);
      // Verifica se o usuário foi criado com os dados corretos
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashedPassword', // Senha criptografada
        },
        select: {
          id: true,
          name: true,
          email: true,
          // Note que password não está no select - não retorna a senha
        }
      });
      // Verifica se o resultado está correto
      expect(result).toEqual({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
      });
    });

    /**
     * TESTE DE ERRO - Email em branco
     * 
     * Este teste verifica se o serviço rejeita dados inválidos:
     * - Email vazio ou em branco
     * - Não deve tentar buscar no banco
     * - Não deve tentar criptografar senha
     * - Não deve tentar criar usuário
     */
    it('should throw error when email is missing', async () => {
      // Arrange - Preparar dados inválidos
      const invalidUserData = {
        name: 'Test User',
        email: '', // Email vazio
        password: 'password123'
      };

      // Act & Assert - Executar e verificar se o erro foi lançado
      await expect(createUserService(invalidUserData)).rejects.toThrow('Email incorrect');
      // Verifica que nenhuma operação de banco foi feita
      expect(mockPrisma.user.findFirst).not.toHaveBeenCalled();
      expect(mockHash).not.toHaveBeenCalled();
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    /**
     * TESTE DE ERRO - Usuário já existe
     * 
     * Este teste verifica se o serviço detecta quando:
     * - O email já existe no banco de dados
     * - Não deve tentar criptografar senha
     * - Não deve tentar criar usuário
     * - Deve lançar erro específico
     */
    it('should throw error when user already exists', async () => {
      // Arrange - Simular que o usuário já existe
      mockPrisma.user.findFirst.mockResolvedValue({
        id: 'existing-user-id',
        name: 'Existing User',
        email: 'test@example.com',
        password: 'hashedPassword',
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Act & Assert - Verificar se o erro foi lançado
      await expect(createUserService(validUserData)).rejects.toThrow('User already exists');
      // Verifica que a busca foi feita mas não as outras operações
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(mockHash).not.toHaveBeenCalled();
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    /**
     * TESTE DE ERRO - Problemas de banco de dados
     * 
     * Este teste verifica se o serviço trata erros de banco:
     * - Conexão com banco falha
     * - Erro durante a criação do usuário
     * - Deve propagar o erro para ser tratado pelo controller
     */
    it('should handle database errors gracefully', async () => {
      // Arrange - Simular erro de banco de dados
      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockHash.mockResolvedValue('hashedPassword');
      mockPrisma.user.create.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert - Verificar se o erro foi propagado
      await expect(createUserService(validUserData)).rejects.toThrow('Database connection failed');
    });
  });
});
