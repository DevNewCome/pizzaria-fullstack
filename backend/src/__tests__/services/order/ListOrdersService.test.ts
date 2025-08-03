/**
 * TESTE DO SERVIÇO DE LISTAGEM DE PEDIDOS
 */

import { ListOrdersService } from '../../../services/order/ListOrdersService';
import prismaClient from '../../../prisma';

// Mock do cliente Prisma para isolar os testes do banco de dados
jest.mock('../../../prisma', () => ({
  order: {
    findMany: jest.fn(),
  },
}));

// Tipagem do mock do Prisma para facilitar o uso nos testes
const mockPrisma = prismaClient as unknown as {
  order: {
    findMany: jest.Mock;
  };
};

describe('ListOrdersService', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all orders successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const expectedOrders = [
      { id: 'order-1', table: 5, status: false, draft: false },
      { id: 'order-2', table: 3, status: false, draft: false }
    ];

    // Configura o mock para retornar os pedidos esperados
    mockPrisma.order.findMany.mockResolvedValue(expectedOrders);

    // Act - Execução do serviço sendo testado
    const service = new ListOrdersService();
    const result = await service.execute();

    // Assert - Verificação dos resultados
    // Verifica se o método findMany foi chamado com os filtros corretos
    expect(mockPrisma.order.findMany).toHaveBeenCalledWith({
      where: {
        draft: false,
        status: false,
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    // Verifica se o resultado retornado é igual ao esperado
    expect(result).toEqual(expectedOrders);
  });
}); 