/**
 * TESTE DO SERVIÇO DE DETALHES DO USUÁRIO
 */

import { DetailUserService } from '../../../services/user/DetailUserService';
import prismaClient from '../../../prisma';

// Mock do cliente Prisma para isolar os testes do banco de dados
jest.mock('../../../prisma', () => ({
  user: {
    findFirst: jest.fn(),
  },
}));

// Tipagem do mock do Prisma para facilitar o uso nos testes
const mockPrisma = prismaClient as unknown as {
  user: {
    findFirst: jest.Mock;
  };
};

describe('DetailUserService', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user details successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const userId = 'user-123';
    const expectedUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com'
    };

    // Configura o mock para retornar o usuário esperado
    mockPrisma.user.findFirst.mockResolvedValue(expectedUser);

    // Act - Execução do serviço sendo testado
    const service = new DetailUserService();
    const result = await service.execute(userId);

    // Assert - Verificação dos resultados
    // Verifica se o método findFirst foi chamado com os parâmetros corretos
    expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      }
    });
    // Verifica se o resultado retornado é igual ao esperado
    expect(result).toEqual(expectedUser);
  });

  it('should return null when user not found', async () => {
    // Arrange - Preparação dos dados de teste (usuário não encontrado)
    const userId = 'user-999';
    mockPrisma.user.findFirst.mockResolvedValue(null);

    // Act - Execução do serviço sendo testado
    const service = new DetailUserService();
    const result = await service.execute(userId);

    // Assert - Verificação dos resultados
    // Verifica se retorna null quando o usuário não é encontrado
    expect(result).toBeNull();
  });
}); 