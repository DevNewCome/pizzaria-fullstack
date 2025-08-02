/**
 * TESTE DO SERVIÇO DE AUTENTICAÇÃO DE USUÁRIO
 * 
 * Este arquivo testa o serviço responsável por autenticar usuários no sistema.
 * O serviço deve:
 * - Receber email e senha do usuário
 * - Buscar o usuário no banco pelo email
 * - Comparar a senha fornecida com a senha criptografada
 * - Gerar um token JWT se as credenciais estiverem corretas
 * - Retornar os dados do usuário + token
 * - Rejeitar credenciais inválidas
 */

import { authUserService } from '../../../services/user/AuthUserService';
import prismaClient from '../../../prisma';
import { compare as bcryptCompare } from 'bcryptjs';
import { sign as jwtSign } from 'jsonwebtoken';

// Mocks do prisma, bcrypt e jsonwebtoken - Simulam as dependências externas
jest.mock('../../../prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findFirst: jest.fn(), // Mock da busca de usuário por email
    },
  },
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(), // Mock da comparação de senhas
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(), // Mock da geração de token JWT
}));

// Referência tipada para os mocks
const mockPrisma = prismaClient as unknown as {
  user: {
    findFirst: jest.Mock;
  };
};

const mockCompare = bcryptCompare as jest.Mock;
const mockSign = jwtSign as jest.Mock;

describe('AuthUserService', () => {
  // Antes de cada teste, limpa mocks e configura variável de ambiente
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret'; // Chave secreta para JWT
  });

  // Dados válidos para autenticação
  const validAuthData = {
    email: 'test@example.com',
    password: 'password123',
  };

  // Usuário mock que simula um usuário do banco de dados
  const mockUser = {
    id: 'user-id',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword', // Senha já criptografada no banco
    created_at: new Date(),
    updated_at: new Date(),
  };

  /**
   * TESTE DE SUCESSO - Autenticação com credenciais válidas
   * 
   * Este teste verifica se o serviço consegue autenticar quando:
   * - O usuário existe no banco
   * - A senha está correta
   * - O token JWT é gerado corretamente
   * - Retorna dados do usuário + token
   */
  it('should authenticate user successfully with valid credentials', async () => {
    // Arrange - Preparar mocks para simular sucesso
    mockPrisma.user.findFirst.mockResolvedValue(mockUser); // Usuário encontrado
    mockCompare.mockResolvedValue(true); // Senha correta
    mockSign.mockReturnValue('valid-jwt-token'); // Token gerado

    // Act - Executar autenticação
    const result = await authUserService(validAuthData);

    // Assert - Verificar se tudo funcionou corretamente
    // Verifica se a busca foi feita com o email correto
    expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    // Verifica se a senha foi comparada corretamente
    expect(mockCompare).toHaveBeenCalledWith('password123', 'hashedPassword');
    // Verifica se o token JWT foi gerado com os dados corretos
    expect(mockSign).toHaveBeenCalledWith(
      {
        name: 'Test User',
        email: 'test@example.com',
      },
      'test-secret', // Chave secreta
      {
        subject: 'user-id', // ID do usuário no token
        expiresIn: '30d', // Token válido por 30 dias
      }
    );
    // Verifica se o resultado está correto
    expect(result).toEqual({
      id: 'user-id',
      name: 'Test User',
      email: 'test@example.com',
      token: 'valid-jwt-token',
    });
  });

  /**
   * TESTE DE ERRO - Usuário não existe
   * 
   * Este teste verifica se o serviço rejeita quando:
   * - O email não existe no banco de dados
   * - Não deve tentar comparar senhas
   * - Não deve tentar gerar token
   * - Deve lançar erro genérico (por segurança)
   */
  it('should throw error when user does not exist', async () => {
    // Arrange - Simular que o usuário não existe
    mockPrisma.user.findFirst.mockResolvedValue(null);

    // Act & Assert - Verificar se o erro foi lançado
    await expect(authUserService(validAuthData)).rejects.toThrow('User/password incorrect');
    // Verifica que não tentou comparar senha nem gerar token
    expect(mockCompare).not.toHaveBeenCalled();
    expect(mockSign).not.toHaveBeenCalled();
  });

  /**
   * TESTE DE ERRO - Senha incorreta
   * 
   * Este teste verifica se o serviço rejeita quando:
   * - O usuário existe no banco
   * - Mas a senha está incorreta
   * - Não deve tentar gerar token
   * - Deve lançar erro genérico (por segurança)
   */
  it('should throw error when password is incorrect', async () => {
    // Arrange - Simular usuário existe mas senha errada
    mockPrisma.user.findFirst.mockResolvedValue(mockUser);
    mockCompare.mockResolvedValue(false); // Senha incorreta

    // Act & Assert - Verificar se o erro foi lançado
    await expect(authUserService(validAuthData)).rejects.toThrow('User/password incorrect');
    // Verifica que não tentou gerar token
    expect(mockSign).not.toHaveBeenCalled();
  });

  /**
   * TESTE DE ERRO - Problemas de banco de dados
   * 
   * Este teste verifica se o serviço trata erros de banco:
   * - Conexão com banco falha
   * - Erro durante a busca do usuário
   * - Deve propagar o erro para ser tratado pelo controller
   */
  it('should handle database errors gracefully', async () => {
    // Arrange - Simular erro de banco de dados
    mockPrisma.user.findFirst.mockRejectedValue(new Error('Database connection failed'));

    // Act & Assert - Verificar se o erro foi propagado
    await expect(authUserService(validAuthData)).rejects.toThrow('Database connection failed');
  });

  /**
   * TESTE DE ERRO - Problemas na geração do token JWT
   * 
   * Este teste verifica se o serviço trata erros de JWT:
   * - Problema na geração do token
   * - Chave secreta inválida
   * - Deve propagar o erro para ser tratado pelo controller
   */
  it('should handle JWT signing errors gracefully', async () => {
    // Arrange - Simular erro na geração do token
    mockPrisma.user.findFirst.mockResolvedValue(mockUser);
    mockCompare.mockResolvedValue(true);
    mockSign.mockImplementation(() => {
      throw new Error('JWT signing failed');
    });

    // Act & Assert - Verificar se o erro foi propagado
    await expect(authUserService(validAuthData)).rejects.toThrow('JWT signing failed');
  });
});
